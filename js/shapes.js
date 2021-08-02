(function() {
  
  var deselect, destroyFunction, disableKeyboard, trackKey;
  disableKeyboard = false;
  
    var activeColor, circle, currentScreen, debug, end, explode, fillColor, goto, implode, inactiveColor, launch, move, moveY, paintBezier, paper, ring, solution, start, totalScreens, transition;
    currentScreen = 0;
    $("#canvas").data("screen", 0).data("draggables", 0);
    fillColor = "#fff";
    inactiveColor = "#C3AF98";
    activeColor = "#f6f";
    paper = Raphael("canvas");
    debug = false;
    solution = [];
    totalScreens = 10;
    window.finalScore = 0;
    goto = function() {
      return transition(currentScreen);
    };
    transition = function(currentScreen, move) {
      if (move == null) {
        move = false;
      }
      $("#canvas").data("draggables", 0);
      if (!move) {
        return implode(currentScreen);
      } else {
        goto();
        return goto = function() {
          return false;
        };
      }
    };
    launch = function(currentScreen) {
      var canvasHeight, canvasWidth, character, destroyArray, elementHeight, elementWidth, i, node, obliterate, problem, solutionArray, translate, _i, _len, _len2, _ref;
      $("body").attr("data-screen", currentScreen);
      if (currentScreen > 0) {
        $("#results").hide();
        $("#ipad").fadeOut(500, function() {
          return $("#social").fadeIn(500);
        });
        $("#screen").html(("" + currentScreen + " <em>of</em> ") + totalScreens);
      }
      paper.clear();
      character = $(".string").find("h1").eq(currentScreen).html();
      solution = paper.path(letters[character]).toBack().attr({
        "fill": "#f69",
        "opacity": 0,
        "stroke-width": "0",
        "stroke": "transparent"
      });
      solution.node.id = "solution" + currentScreen;
      solutionArray = solution.attr("path");
      problem = paper.path(solutionArray).attr({
        "fill": fillColor,
        "stroke-width": "0",
        "stroke": "transparent"
      });
      problem.node.id = "problem" + currentScreen;
      elementHeight = solution.getBBox().height;
      elementWidth = solution.getBBox().width;
      paper.setSize(elementWidth, elementHeight);
      canvasHeight = paper.height;
      canvasWidth = paper.width;

      destroyArray = destroyFunction(currentScreen);
      for (_i = 0, _len = destroyArray.length; _i < _len; _i++) {
        obliterate = destroyArray[_i];
        node = parseInt(obliterate[0]);
        if (parseInt(obliterate[1]) === 1) {
          solutionArray[node][3] = solutionArray[node][5];
          solutionArray[node][4] = solutionArray[node][6];
        } else if (parseInt(obliterate[1]) === 2) {
          solutionArray[node + 1][1] = solutionArray[node][5];
          solutionArray[node + 1][2] = solutionArray[node][6];
        }
        if (parseInt(obliterate[2]) === 1) {
          solutionArray[node][3] = solutionArray[node][5];
          solutionArray[node][4] = solutionArray[node][6];
        } else if (parseInt(obliterate[2]) === 2) {
          solutionArray[node + 1][1] = solutionArray[node][5];
          solutionArray[node + 1][2] = solutionArray[node][6];
        }
      }
      problem.attr({
        path: solutionArray
      });
      if (currentScreen === 0) {
        paper.circle(solution.attr("path")[node + 1][1], solution.attr("path")[node + 1][2], 10).attr({
          "stroke-dasharray": ". ",
          "stroke": inactiveColor
        });
        paper.path("M" + (problem.attr("path")[node + 1][1]) + " " + (problem.attr("path")[node + 1][2]) + " L" + (solution.attr("path")[node + 1][1]) + " " + (solution.attr("path")[node + 1][2] - 10) + " ").attr({
          "stroke-dasharray": ". ",
          "stroke": inactiveColor
        });
      }
      _ref = problem.attr("path");
      for (i = 0, _len2 = _ref.length; i < _len2; i++) {
        node = _ref[i];
        if (node[0]) {
          paintBezier(node, problem.attr("path")[i + 1], problem.attr("path")[i - 1], problem.attr("path")[1], i, destroyArray, currentScreen);
        }
      }
      problem.toBack();
      if (currentScreen > 0) {
        return explode(currentScreen);
      }
    };
    start = function() {
      currentScreen = $("#canvas").data("screen");
      if (!this.ox) {
        this.oox = this.attr("cx");
      }
      if (!this.oy) {
        this.ooy = this.attr("cy");
      }
      this.ox = this.attr("cx");
      this.oy = this.attr("cy");
      if (!this.line) {
        this.line = paper.path("M " + this.ox + " " + this.oy + " L " + this.ox + " " + this.oy).attr({
          stroke: activeColor
        });
      }
      this.solutionPath = $("#solution" + currentScreen)[0].raphael.attr("path");
      this.currentScreen = currentScreen;
      this.destroy = parseInt(this.node.id.split("c")[1]);
      this.special = this.node.getAttribute("special");
      $("#instructions").fadeOut("500");
      this.element = $("#problem" + this.currentScreen)[0].raphael;
      return this.path = $("#problem" + this.currentScreen)[0].raphael.attr("path");
    };
    move = function(dx, dy, e) {
      var nodeNumber, x, y;
      x = this.ox + dx;
      y = this.oy + dy;
      nodeNumber = 3;
      if (this.special) {
        nodeNumber = 1;
      }
      if ($('#canvas').hasClass("shift")) {
        if (Math.abs(x - this.oox) < Math.abs(y - this.ooy)) {
          this.path[this.destroy][nodeNumber] = this.oox;
          this.path[this.destroy][nodeNumber + 1] = y;
          this.attr({
            cx: this.oox,
            cy: y
          });
          this.line.attr("path", "M " + this.oox + " " + this.ooy + " L " + this.oox + " " + y);
        } else {
          this.path[this.destroy][nodeNumber] = x;
          this.path[this.destroy][nodeNumber + 1] = this.ooy;
          this.attr({
            cx: x,
            cy: this.ooy
          });
          this.line.attr("path", "M " + this.oox + " " + this.ooy + " L " + x + " " + this.ooy);
        }
      } else {
        this.path[this.destroy][nodeNumber] = x;
        this.path[this.destroy][nodeNumber + 1] = y;
        this.attr({
          cx: x,
          cy: y
        });
        this.line.attr("path", "M " + this.oox + " " + this.ooy + " L " + x + " " + y);
      }
      return this.element.attr({
        "path": this.path
      });
    };
    moveY = function(dx, dy, ax, ay, e) {
      var path, x, y;
      x = this.ox + dx;
      y = this.oy + dy;
      this.attr({
        cx: this.oox,
        cy: y
      });
      this.line.attr("path", "M " + this.oox + " " + this.ooy + " L " + this.oox + " " + y);
      path = $("#problem" + currentScreen)[0].raphael.attr("path");
      path[9][2] = y;
      $("#problem" + currentScreen)[0].raphael.attr({
        "path": path
      });
      if (path[9][2] >= this.solutionPath[9][2]) {
        return transition(currentScreen, true);
      }
    };
    end = function() {
      return this.dx = this.dy = 0;
    };
    paintBezier = function(node, nextNode, prevNode, firstNode, i, destroyArray, currentScreen) {
      var count, destroy, e, fills, found, line, lines, points, square, _i, _len;
      if (nextNode == null) {
        nextNode = false;
      }
      points = [];
      fills = {
        "fill": inactiveColor,
        "stroke-width": "0",
        "stroke": "transparent"
      };
      lines = {
        "stroke-width": "1",
        "stroke": inactiveColor
      };
      if (node.length > 3) {
        points = [5, 6];
      } else {
        points = [1, 2];
      }
      if (debug) {
        paper.text(Math.floor(node[points[0]] - 10), Math.floor(node[points[1]]), i).toFront();
      }
      square = paper.rect(Math.floor(node[points[0]]) - 1.5, Math.floor(node[points[1]]) - 1.5, 4, 4).attr(fills);
      if (square.attrs.x === 0 && square.attrs.y === 0) square.remove();
      if (node.length > 3) {
        paper.circle(node[1], node[2], 2).toBack().attr(fills);
        paper.circle(node[3], node[4], 2).toBack().attr(fills);
        if (debug) {
          paper.text(node[1] - 5, node[2] - 5, "1").attr(fills);
        }
        if (debug) {
          paper.text(node[3] - 5, node[4] - 5, "2").attr(fills);
        }
        paper.path("M " + node[3] + " " + node[4] + " L  " + node[points[0]] + " " + node[points[1]]).attr(lines);
      }
      switch (nextNode[0]) {
        case "C":
          line = paper.path("M " + (Math.floor(nextNode[1]) + 0.5) + " " + (Math.floor(nextNode[2]) + 0.5) + " L  " + (Math.floor(node[points[0]]) + 0.5) + " " + (Math.floor(node[points[1]]) + 0.5)).attr(lines);
          break;
        case "L":
          if (nextNode[0].length > 3) {
            paper.path("M " + nextNode[1] + " " + nextNode[2] + " L  " + node[points[0]] + " " + node[points[1]]).attr(lines);
          }
      }
      found = false;
      for (_i = 0, _len = destroyArray.length; _i < _len; _i++) {
        destroy = destroyArray[_i];
        if (parseInt(destroy[0]) === i) {
          found = true;
          $("#canvas").data("draggables", $("#canvas").data("draggables") + 1);
        }
      }
      if (found) {
        count = parseInt($("#canvas").data("draggables")) - 1;
        if (currentScreen !== 0) {
          if (parseInt(destroyArray[count][1]) === 2) {
            e = paper.circle(nextNode[1], nextNode[2], 10).attr({
              fill: activeColor,
              stroke: 0
            }).drag(move, start, end);
            e.node.id = "c" + (i + 1);
            e.node.setAttribute("special", true);
            e.toFront();
          } else if (parseInt(destroyArray[count][1]) === 1) {
            e = paper.circle(node[5], node[6], 10).attr({
              fill: activeColor,
              stroke: 0
            }).drag(move, start, end);
            e.node.id = "c" + i;
            e.toFront();
          }
          if (parseInt(destroyArray[count][2]) === 2) {
            e = paper.circle(nextNode[1], nextNode[2], 10).attr({
              fill: activeColor,
              stroke: 0
            }).drag(move, start, end);
            e.node.id = "c" + (i + 1);
            e.node.setAttribute("special", true);
            e.toFront();
          } else if (parseInt(destroyArray[count][2]) === 1) {
            e = paper.circle(node[5], node[6], 10).attr({
              fill: activeColor,
              stroke: 0
            }).drag(move, start, end);
            e.node.id = "c" + i;
            e.toFront();
          }
        } else {
          e = paper.circle(nextNode[1], nextNode[2], 10).attr({
            fill: activeColor,
            stroke: 0
          }).drag(moveY, start, end);
          e.node.id = "c" + i;
          e.toFront();
        }
        e.attr({
          "stroke": "transparent",
          "stroke-width": 10
        });
        if (Modernizr.touch) {
          return e.attr({
            "stroke": "transparent",
            "stroke-width": 25
          });
        }
      }
    };
    circle = function(vertices) {
      var canvasHeight, canvasWidth, deg, i, path, radius, x, y;
      path = [];
      radius = 100;
      canvasHeight = paper.height;
      canvasWidth = paper.width;
      for (i = 0; 0 <= vertices ? i <= vertices : i >= vertices; 0 <= vertices ? i++ : i--) {
        deg = (i * 1 / vertices) * 360;
        x = Math.sin(deg * Math.PI / 180) * radius + canvasWidth / 2;
        y = Math.cos(deg * Math.PI / 180) * radius + canvasHeight / 2;
        if (!path.length) {
          path.push("M " + x + " " + y);
        } else {
          path.push("A " + radius + "," + radius + ",0,0,0," + x + "," + y);
        }
      }
      path.push("Z");
      return path;
    };
    ring = function(vertices) {
      var canvasHeight, canvasWidth, deg, i, path, radius, x, y;
      path = [];
      radius = 100;
      canvasHeight = paper.height;
      canvasWidth = paper.width;
      vertices = vertices / 2;
      for (i = 0; 0 <= vertices ? i <= vertices : i >= vertices; 0 <= vertices ? i++ : i--) {
        deg = (i * 1 / vertices) * 360;
        x = Math.sin(deg * Math.PI / 180) * radius + canvasWidth / 2;
        y = Math.cos(deg * Math.PI / 180) * radius + canvasHeight / 2;
        if (!path.length) {
          path.push("M " + x + " " + y);
        } else {
          path.push("A " + radius + "," + radius + ",0,0,0," + x + "," + y);
        }
      }
      path.push("Z");
      radius = 0;
      for (i = vertices; vertices <= 0 ? i <= 0 : i >= 0; vertices <= 0 ? i++ : i--) {
        deg = (i * 1 / vertices) * 360;
        x = Math.sin(deg * Math.PI / 180) * radius + canvasWidth / 2;
        y = Math.cos(deg * Math.PI / 180) * radius + canvasHeight / 2;
        if (!path.length) {
          path.push("M " + x + " " + y);
        } else {
          path.push("A " + radius + "," + radius + ",0,0,0," + x + "," + y);
        }
      }
      path.push("Z");
      return path;
    };
    implode = function(currentScreen) {
      var element, holes, imploded, movement, selector;
      $("#results").hide();
      $("#slides").html(10 - parseInt(currentScreen));
      $("#remaining").show();
      $("#canvas").addClass("deselected");
      $("#canvas").removeClass("compare");
      $(".string").eq(currentScreen).hide();
      element = $("#problem" + currentScreen)[0].raphael.clone().attr({
        opacity: 1
      });
      if ($("#problem" + currentScreen).is(":visible")) {
        selector = "#problem";
        $("#dummy" + currentScreen).hide();
        $("#solution" + currentScreen).hide();
      } else {
        selector = "#dummy";
        $("#problem" + currentScreen).hide();
        $("#solution" + currentScreen).hide();
      }
      $(selector + currentScreen).hide();
      holes = (function() {
        var _i, _len, _ref, _results;
        _ref = element.attr("path");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          movement = _ref[_i];
          if (movement[0] === "M") {
            _results.push(movement);
          }
        }
        return _results;
      })();
      if (holes.length > 2) {
        imploded = ring(element.attr("path").length);
      } else {
        imploded = circle(element.attr("path").length);
      }
      element.node.id = "animation";
      return element.animate({
        "path": imploded
      }, 1000, "elastic", function() {
        currentScreen++;
        $("#canvas").data("screen", currentScreen);
        setTimeout(function(){ launch(currentScreen) }, 100);
      });
    };
    explode = function(currentScreen) {
      var imploded, path, ultimatePath;
      $("#remaining").hide();
      ultimatePath = $("#problem" + currentScreen)[0].raphael.attr("path");
      $("#problem" + currentScreen).hide();
      path = circle(ultimatePath.length);
      imploded = paper.path(path).attr({
        fill: "#fff",
        "stroke-width": 0,
        "stroke": "transparent"
      });
      imploded.node.id = "animation";
      return imploded.animate({
        "path": ultimatePath
      }, 1000, "elastic", function() {
        $("#canvas").removeClass("deselected");
        $("#problem" + currentScreen).show();
        $('.string').eq(currentScreen).show();
        return this.remove();
      });
    };
    $("#next").click(function(evt) {
      currentScreen = $("#canvas").data("screen");
      transition(currentScreen);
      $("#select").find(".selected").removeClass("selected");
      return $("#select a").eq(0).addClass("selected");
    });
    $(".compare").click(function(evt) {
      var circle, connector, destroyArray, difference, dummy, eraser, line, newline, node, nodeX, nodeY, nodeid, originalDistance, pathNode, pathNodeX, pathNodeY, problem, set, solutionNode, totalScore, userDistance, userX, userY, _i, _len, _ref;
      currentScreen = $("#canvas").data("screen");
      deselect(evt);
      $(this).hide();
      $(".string").eq(currentScreen).hide();
      $("#results").show();
      set = [];
      solution = $("#solution" + currentScreen)[0].raphael;
      problem = $("#problem" + currentScreen)[0].raphael;
      dummy = $("#problem" + currentScreen)[0].raphael.clone().attr({
        opacity: 0
      });
      dummy.node.id = "dummy" + currentScreen;
      solution.attr({
        "fill": "#fff",
        opacity: 0.8
      }).toBack();
      problem.attr({
        "opacity": 0.8
      });
      destroyArray = destroyFunction(currentScreen);
      originalDistance = 0;
      userDistance = 0;
      difference = 0;
      _ref = $("circle");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        if (circle.id) {
          solutionNode = circle.raphael.clone().attr({
            r: 2
          });
          circle.raphael.animate({
            r: 2,
            fill: inactiveColor
          }, 500);
          nodeid = parseInt(circle.id.split("c")[1]);
          if (circle.getAttribute("special")) {
            node = $("#solution" + currentScreen)[0].raphael.attr("path")[nodeid];
            pathNode = $("#solution" + currentScreen)[0].raphael.attr("path")[nodeid - 1];
            nodeX = node[1];
            nodeY = node[2];
          } else {
            node = $("#solution" + currentScreen)[0].raphael.attr("path")[nodeid];
            pathNode = $("#solution" + currentScreen)[0].raphael.attr("path")[nodeid];
            nodeX = node[3];
            nodeY = node[4];
          }
          pathNodeX = pathNode[5];
          pathNodeY = pathNode[6];
          userX = circle.raphael.attr('cx');
          userY = circle.raphael.attr('cy');
          line = "M " + (circle.raphael.attr('cx')) + " " + (circle.raphael.attr('cy')) + " L " + pathNodeX + " " + pathNodeY;
          connector = paper.path(line).attr({
            stroke: activeColor
          }).toFront();
          eraser = paper.path(line).attr({
            stroke: inactiveColor
          });
          originalDistance += Math.sqrt(Math.pow(Math.abs(pathNodeX - nodeX), 2) + Math.pow(Math.abs(pathNodeY - nodeY), 2));
          userDistance += Math.sqrt(Math.pow(Math.abs(userX - nodeX), 2) + Math.pow(Math.abs(userY - nodeY), 2));
          newline = "M " + nodeX + " " + nodeY + " L " + pathNodeX + "  " + pathNodeY;
          connector.animate({
            path: newline
          }, 1000, "elastic");
          solutionNode.animate({
            cx: nodeX,
            cy: nodeY
          }, 1000, "elastic");
        }
      }
      totalScore = Math.floor((originalDistance - userDistance * 100) / originalDistance) + 100;
      if (totalScore < 0) {
        totalScore = 0;
      }
      if (totalScore > 90) {
        totalScore = 95;
      }
      if (totalScore > 95) {
        totalScore = 100;
      }
      window.finalScore += totalScore;
      console.log(window.finalScore);
      $('#actions').show();
      $('#number').countTo({
        interval: 20,
        startNumber: 0,
        endNumber: totalScore
      });
      if (currentScreen >= 10) {
        $("#next").html("Fin");
        $("#next").unbind("click");
        $("#next").bind("click", function(evt) {
          $("#overlay").addClass("show");
          return $("#finaltotalscore").countTo({
            "interval": 20,
            "startNumber": 0,
            "endNumber": Math.floor(window.finalScore / 10)
          });
        });
        $(document).unbind("click");
      }
      return $("#showexpert, #showyour, #showboth").unbind().bind("click", function(evt) {
        evt.preventDefault();
        $("#select a").removeClass("selected");
        $(this).addClass("selected");
        $("#problem" + currentScreen).hide();
        $("#solution" + currentScreen).hide();
        $("#dummy" + currentScreen).show();
        if (this.id !== "showboth") {
          $("#canvas").addClass("compare");
        }
        if (this.id === "showexpert") {
          return $("#dummy" + currentScreen)[0].raphael.attr({
            opacity: 1,
            fill: "#fff"
          }).toFront().animate({
            "path": $("#solution" + currentScreen)[0].raphael.attr("path")
          }, 500, "easeOut");
        } else if (this.id === "showyour") {
          return $("#dummy" + currentScreen)[0].raphael.attr({
            opacity: 1,
            fill: "#fff"
          }).animate({
            "path": $("#problem" + currentScreen)[0].raphael.attr("path")
          }, 500, "easeOut");
        } else if (this.id === "showboth") {
          $("#problem" + currentScreen).show();
          $("#solution" + currentScreen).show();
          $("#dummy" + currentScreen).hide();
          $("#canvas").removeClass("compare");
          setTimeout(
            function(){
              $("#canvas").removeClass("deselected")
            }
          , 100);
        }
      });
    });
    $("#twitter").bind("click", function(evt) {
      var finaltotalscore, height, left, opts, string, top, url, width;
      evt.preventDefault();
      finaltotalscore = $("#finaltotalscore").text();
      string = "text=I got " + finaltotalscore + "/100 in Shape Type, a typography game";
      width = 575;
      height = 400;
      left = ($(window).width() - width) / 2;
      top = ($(window).height() - height) / 2;
      url = "http://shape.method.ac";
      opts = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
      return window.open("http://twitter.com/share?" + string + "&url=" + url, 'twitter', opts);
    });
  
  window.addEventListener("touchstart", function(evt) {
    if (evt.target.tagName.toLowerCase() !== "path" && evt.target.tagName.toLowerCase() !== "a") {

      return evt.preventDefault();
    }
  },{passive: false});
  window.onclick = function(evt) {
    deselect(evt);
    return true;
  };
  window.onkeydown = function(evt) {
    return trackKey(evt);
  };
  window.onkeyup = function(evt) {
    $("#canvas").removeClass("shift");
    if (evt.keyCode === 18 && !$("#canvas").hasClass("compare")) {
      return $("#canvas").removeClass("deselected");
    }
  };
  deselect = function(evt) {
    if (evt.target.tagName !== "path" && evt.target.tagName !== "circle" && evt.target.className !== "compare" && evt.target.id !== "showboth") {
      $("#canvas").addClass("deselected");
      return window.selected = false;
    } else if (evt.target.id.indexOf("roblem")) {
      return $("#canvas").removeClass("deselected");
    }
  };
  destroyFunction = function(currentScreen) {
    var destroy, destroyArray, x;
    destroy = $(".string").eq(currentScreen).data("destroy");
    destroyArray = [];
    try {
      destroyArray = destroy.split("|");
    } catch (_e) {}
    if (!destroyArray.length) {
      destroyArray.push(destroy);
    }
    return destroyArray = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = destroyArray.length; _i < _len; _i++) {
        x = destroyArray[_i];
        _results.push(x.split(","));
      }
      return _results;
    })();
  };
  trackKey = function(evt) {
    var currentScreen;
    currentScreen = $("#canvas").data("screen");
    if (evt.keyCode === 75 || evt.keyCode === 13 || evt.keyCode === 37 || evt.keyCode === 39 || evt.keyCode === 9) {
      evt.preventDefault();
    }
    if (evt.keyCode === 75 || evt.keyCode === 107) {
      $("#tab").trigger("click");
    }
    if (evt.altKey && !$("#canvas").hasClass("compare")) {
      $("#canvas").addClass("deselected altkey");
    }
    if (evt.keyCode === 16) {
      $("#canvas").addClass("shift");
    }
    if (evt.keyCode === 13) {
      if ($("#results").css("display") === "block" || $("#instructions").css("display") === "block") {
        $("#instructions").fadeOut(500);
        return $("#next").trigger("click");
      } else {
        return $(".compare").eq(currentScreen).trigger("click");
      }
    }
  };
  launch(currentScreen);
}).call(this);
