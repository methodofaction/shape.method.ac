(function() {
  window.onload = function() {
    var abs_trans_x, betterSolution, currentScreen, deselect, disableKeyboard, drawlines, fillColor, getPermalink, goto, isTouch, launch, move, move_welcome, name, paper, select, selectColor, selected, start, startScreen, terrible, totalScore, totalScreens, trackKey, transition, up, upiPad, welcome, welcomeJump;
    fillColor = "#fff";
    selectColor = "#00CCFF";
    currentScreen = 0;
    paper = Raphael("canvas", 900, 280);
    abs_trans_x = 0;
    selected = false;
    terrible = false;
    totalScreens = $(".string").length - 1;
    totalScore = 0;
    isTouch = Modernizr.touch;
    welcomeJump = currentScreen;
    betterSolution = false;
    name = false;
    disableKeyboard = false;
    startScreen = function() {
      var hash;
      try {
        hash = window.location.hash.split("#!")[1];
        betterSolution = hash.split("/");
        betterSolution.shift();
        name = betterSolution.pop();
        currentScreen = betterSolution.shift();
        return currentScreen;
      } catch (error) {
        return currentScreen = 0;
      }
    };
    currentScreen = startScreen();
    $(document).bind("touchmove touchstart", function(evt) {
      if (evt.target.tagName.toLowerCase() !== "path" && evt.target.tagName.toLowerCase() !== "a") {
        return evt.preventDefault();
      }
    });
    $("#next").bind("click", function(evt) {
      return transition(currentScreen);
    });
    getPermalink = function(suggestion) {
      name = $("#yourname").attr("value").replace(" ", "_");
      if (name) {
        $("#popcontent").hide();
        $("#permalink").html("http://type.method.ac/#!/" + currentScreen + "/" + (suggestion.join('/')) + "/" + name).show();
        $("#poppermalink").show();
        return $("#preview").attr("href", "http://type.method.ac/#!/" + currentScreen + "/" + (suggestion.join('/')) + "/" + name);
      } else {
        return $("#getpermalink").animate({
          left: -5
        }, 50, function() {
          return $("#getpermalink").animate({
            left: 5
          }, 50, function() {
            return $("#getpermalink").animate({
              left: -5
            }, 50, function() {
              return $("#getpermalink").animate({
                left: 5
              }, 50, function() {
                return $("#getpermalink").animate({
                  left: 5
                }, 50, function() {
                  return $("#yourname").focus();
                });
              });
            });
          });
        });
      }
    };
    $("#better").bind("click", function(evt) {
      var i, solution, suggestion, x, _len;
      $("#popup").addClass("show");
      disableKeyboard = true;
      $("#yourname").focus();
      suggestion = [];
      solution = $(".string").eq(currentScreen).data("solution").split(",");
      for (i = 0, _len = solution.length; i < _len; i++) {
        x = solution[i];
        suggestion.push(Math.floor($("#c" + (i + 1))[0].raphael.attrs.path[0][1]));
      }
      $("#getpermalink").unbind().bind("submit", function(evt) {
        evt.preventDefault();
        return getPermalink(suggestion);
      });
      return $("#getpermalink").trigger("submit");
    });
    $("#close").bind("click", function(evt) {
      $("#popup").removeClass("show");
      return disableKeyboard = false;
    });
    $("body").bind("click", function(evt) {
      deselect(evt);
      return true;
    });
    deselect = function(evt) {
      if (evt.target.tagName !== "path") {
        paper.set(car).attr({
          "fill": fillColor
        });
        return selected = false;
      }
    };
    $(window).keydown(function(evt) {
      if (!disableKeyboard) {
        return trackKey(evt);
      }
    });
    select = function(id) {
      if (selected && !isTouch) {
        $("#" + selected)[0].raphael.attr({
          "fill": fillColor
        });
      }
      $("#" + id)[0].raphael.attr({
        "fill": selectColor,
        "stroke-width": "0",
        "stroke": "transparent"
      });
      return selected = id;
    };
    start = function() {
      $("#instructions").fadeOut(500);
      this.ox = 0;
      return select(this.node.id);
    };
    move = function(dx, dy) {
      var trans_x;
      trans_x = dx - this.ox;
      this.translate(trans_x, 0);
      return this.ox = dx;
    };
    up = function() {};
    upiPad = function() {
      return this.attr({
        "fill": fillColor
      });
    };
    move_welcome = function(dx, dy) {
      var trans_x;
      trans_x = dx - this.ox;
      if (this.attrs.path[0][1] > 140) {
        this.translate(trans_x, 0);
      } else {
        goto(welcomeJump);
      }
      return this.ox = dx;
    };
    goto = function(index) {
      transition(index);
      return goto = function() {};
    };
    transition = function() {
      currentScreen++;
      setTimeout((function() {
        return launch(currentScreen);
      }), 500);
      return $("#boundries").css({
        "height": 0
      });
    };
    $("#compare").click(function(evt) {
      var blocker, clone, clones, difference, element, i, original, possesive, rawScore, screenScore, set, solution, tolerance, x, _len;
      deselect(evt);
      $(this).hide();
      $(".string").eq(currentScreen).hide();
      $("#results").show();
      set = [];
      solution = $(".string").eq(currentScreen).data("solution").split(",");
      blocker = paper.rect(0, 0, 900, 280).attr({
        "fill": "#fff",
        "opacity": 0
      });
      original = [];
      clones = [];
      rawScore = 0;
      for (i = 0, _len = solution.length; i < _len; i++) {
        x = solution[i];
        element = $("#c" + (i + 1))[0].raphael;
        difference = x - element.attrs.path[0][1];
        tolerance = Math.abs(solution.length);
        if (tolerance < Math.abs(difference)) {
          rawScore += Math.abs(difference);
        }
        clone = element.clone().toBack().animate({
          "translation": "" + difference + ", 0",
          "fill": selectColor
        }, 500, "ease-out");
        original.push(element.attrs.path[0][1]);
        clones.push(clone);
      }
      if (betterSolution) {
        original = betterSolution;
      }
      screenScore = Math.round(Math.max(0, (terrible - rawScore) / terrible * 100));
      totalScore += screenScore;
      if (currentScreen >= totalScreens) {
        $("#next").html("Fin");
        $("#next").unbind("click");
        $("#next").bind("click", function(evt) {
          $("#overlay").addClass("show");
          return $("#finaltotalscore").countTo({
            "interval": 20,
            "startNumber": 0,
            "endNumber": Math.ceil(totalScore / totalScreens)
          });
        });
        $(document).unbind("click");
      }
      $("#score").countTo({
        "interval": 20,
        "startNumber": 0,
        "endNumber": screenScore
      });
      $("#showexpert").unbind().bind("click", function(evt) {
        var i, path, x, _len2, _results;
        evt.preventDefault();
        $("#select a").removeClass("selected");
        $(this).addClass("selected");
        paper.set(clones).animate({
          "opacity": 0
        }, 500);
        _results = [];
        for (i = 0, _len2 = solution.length; i < _len2; i++) {
          x = solution[i];
          element = $("#c" + (i + 1))[0].raphael;
          path = element.attrs.path;
          difference = x - path[0][1];
          _results.push(element.animate({
            "translation": "" + difference + ", 0",
            "fill": "#fff"
          }, 500, "ease-out"));
        }
        return _results;
      });
      $("#showyour").unbind().bind("click", function(evt) {
        var i, path, x, _len2, _results;
        evt.preventDefault();
        $("#select a").removeClass("selected");
        $(this).addClass("selected");
        paper.set(clones).animate({
          "opacity": 0
        }, 500);
        _results = [];
        for (i = 0, _len2 = original.length; i < _len2; i++) {
          x = original[i];
          element = $("#c" + (i + 1))[0].raphael;
          path = element.attrs.path;
          difference = original[i] - path[0][1];
          _results.push(element.animate({
            "translation": "" + difference + ", 0",
            "fill": "#fff"
          }, 500, "ease-out"));
        }
        return _results;
      });
      $("#showboth").unbind().bind("click", function(evt) {
        evt.preventDefault();
        $("#select a").removeClass("selected");
        $(this).addClass("selected");
        $("#showyour").trigger("click").removeClass("selected");
        $(this).addClass("selected");
        return paper.set(clones).animate({
          "opacity": 1
        }, 500);
      });
      if (betterSolution) {
        $("#showyour").trigger("click");
        possesive = "";
        name = name.replace("_", " ");
        if (name.charAt(name.length - 1) === "s") {
          possesive += "'";
        } else {
          possesive += "'s";
        }
        $("#showyour").html(name + possesive + " solution");
        $("#showexpert").html("Original solution");
        $("#actions").append("<div class='pop'><strong>" + name + " says his/her solution is better</strong><br />        Compare it with the original solution and let him/her know what you think<div><p>Haven't played it yet? <a href='/?start'>Try it out yourself</a></p>");
        $(".score").hide();
        $("#next").hide();
        return $("#better").hide();
      }
    });
    $("#tab").toggle(function() {
      if (Modernizr.csstransitions) {
        return $("#footer").addClass("open");
      } else {
        return $("#footer").animate({
          "top": 0
        });
      }
    }, function() {
      if (Modernizr.csstransitions) {
        return $("#footer").removeClass("open");
      } else {
        return $("#footer").animate({
          "top": $("#footer").height() * -1
        });
      }
    });
    $("#twitter").bind("click", function(evt) {
      var finaltotalscore, height, left, opts, string, top, url, width;
      evt.preventDefault();
      finaltotalscore = $("#finaltotalscore").text();
      string = "text=I got " + finaltotalscore + "/100 in this html5 kerning game";
      width = 575;
      height = 400;
      left = ($(window).width() - width) / 2;
      top = ($(window).height() - height) / 2;
      url = "http://type.method.ac";
      opts = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
      return window.open("http://twitter.com/share?" + string + "&url=" + url, 'twitter', opts);
    });
    trackKey = function(evt) {
      var distance, last, next, node, prev, selectNumber;
      if (evt.keyCode === 75 || evt.keyCode === 13 || evt.keyCode === 37 || evt.keyCode === 39 || evt.keyCode === 9) {
        evt.preventDefault();
      }
      if (evt.keyCode === 75 || evt.keyCode === 107) {
        $("#tab").trigger("click");
      }
      if (evt.keyCode === 13) {
        if ($("#results").css("display") === "block" || $("#instructions").css("display") === "block") {
          $("#next").trigger("click");
        } else {
          $("#compare").trigger("click");
        }
      }
      if ($("#results").css("display") !== "block") {
        if (selected && (evt.keyCode === 37 || evt.keyCode === 39)) {
          $("#instructions").fadeOut(500);
          if (evt.shiftKey) {
            distance = 10;
          } else {
            distance = 1;
          }
          node = $("#" + selected)[0];
          if (evt.keyCode === 37) {
            node.raphael.translate(distance * -1, 0);
          }
          if (evt.keyCode === 39) {
            node.raphael.translate(distance * 1, 0);
          }
          if (node.raphael.attr("path")[0][1] < 140 && currentScreen === 0) {
            goto(0);
          }
        }
        if (evt.keyCode === 9) {
          evt.preventDefault();
          if (selected) {
            selectNumber = parseInt(selected.split("c")[1]);
          } else {
            1;
          }
          if (!evt.shiftKey) {
            if ($("#c" + (selectNumber + 1)).length && selectNumber < $("path").length - 2) {
              next = "c" + (selectNumber + 1);
            } else {
              next = "c1";
            }
            if (!selected || typeof selected === "undefined") {
              return select("c1");
            } else {
              return select(next);
            }
          } else {
            if ($("#c" + (selectNumber - 1)).length && selectNumber > 1) {
              prev = "c" + (selectNumber - 1);
            } else {
              last = "c" + ($("path").length - 2);
              prev = "c" + ($("path").length - 2);
            }
            if (!selected || typeof selected === "undefined") {
              return select(last);
            } else {
              return select(prev);
            }
          }
        }
      }
    };
    launch = function(index) {
      var character, element, i, letter, num, path, solution, spacing, string, _len;
      $("#results").hide();
      $("#instructions").hide();
      $("#ipad").fadeOut(500, function() {
        return $("#social").fadeIn(500);
      });
      $("#screen").html(("" + currentScreen + " <em>of</em> ") + totalScreens);
      selected = "";
      window.car = [];
      paper.clear();
      element = $(".string").eq(index);
      spacing = (function() {
        var _i, _len, _ref, _results;
        _ref = element.data("start").split(",");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          num = _ref[_i];
          _results.push(parseInt(num, 10));
        }
        return _results;
      })();
      string = $("h1", element).html().split("");
      terrible = 0;
      solution = $(".string").eq(index).data("solution").split(",");
      $(".string").eq(index - 1).hide();
      element.show();
      for (i = 0, _len = string.length; i < _len; i++) {
        character = string[i];
        path = fonts[element.data("font")][character];
        letter = paper.path(path).attr({
          "fill": fillColor,
          "stroke-width": "0",
          "stroke": "transparent"
        });
        letter.translate(spacing[i], 0);
        if (i && i < solution.length + 1) {
          terrible += Math.abs(solution[i - 1] - letter.attrs.path[0][1]);
        }
        letter.node.id = "c" + i;
        car.push(letter);
      }
      car.pop().attr({
        cursor: "not-allowed"
      });
      car.shift().attr({
        cursor: "not-allowed"
      });
      if (!isTouch) {
        paper.set(car).drag(move, start, up);
      } else {
        paper.set(car).drag(move, start, upiPad);
      }
      paper.set(car).attr({
        cursor: "e-resize",
        cursor: "ew-resize"
      });
      drawlines(index);
      $("#actions").show();
      if (betterSolution) {
        return $("#compare").trigger("click");
      } else {
        return $("#compare").delay(500).show();
      }
    };
    welcome = function() {
      var e, kernme, outline;
      window.car = [];
      paper.clear();
      $('.string').eq(0).show();
      e = paper.path(fonts["frutiger"]["e"]).translate(90, 0);
      outline = e.clone();
      kernme = paper.path(fonts["frutiger"]["init"]).attr({
        "fill": fillColor,
        "stroke-width": "0",
        "stroke": "transparent"
      });
      outline.translate(-20, 0).attr({
        "fill": "transparent",
        "stroke-width": "1",
        "stroke-dasharray": "-",
        "stroke": "#fff",
        "stroke-opacity": 0.3
      }).toBack();
      e.node.id = "c1";
      car.push(e);
      paper.set(car).drag(move_welcome, start, up).attr({
        cursor: "e-resize",
        cursor: "ew-resize"
      });
      drawlines(0);
      return select("c1");
    };
    drawlines = function(screen) {
      var lines;
      lines = $(".string").eq(screen).data("lines").split(",");
      if (Modernizr.csstransitions) {
        $("#boundries").css({
          "height": lines[1] + "px",
          "margin-top": lines[1] / 2 * -1 + "px"
        });
        $("#xheight").css({
          "margin-top": lines[2] + "px",
          "height": lines[3] - lines[2] + "px"
        });
        $(".limit").css({
          "margin-top": lines[1] / 2 * -1 - 50 + "px",
          "height": (parseInt(lines[1]) + 100) + "px"
        });
        $(".string").eq(screen).css({
          "margin-left": lines[5] / 2 * -1 + "px",
          "width": lines[5] + "px"
        });
        $(".limit").eq(0).css({
          "margin-left": lines[5] / 2 * -1 + "px"
        });
        $(".limit").eq(1).css({
          "margin-left": lines[5] / 2 + "px"
        });
        $("#compare").css({
          "margin-left": (lines[5] / 2 - 130) + "px"
        });
        return $("#canvas").css({
          "width": lines[5] + "px",
          "margin-left": lines[5] / 2 * -1 + "px"
        });
      } else {
        $("#boundries").animate({
          "height": lines[1],
          "margin-top": lines[1] / 2 * -1
        });
        $("#xheight").animate({
          "margin-top": lines[2],
          "height": lines[3] - lines[2]
        });
        $(".limit").animate({
          "margin-top": lines[1] / 2 * -1 - 50,
          "height": parseInt(lines[1]) + 100
        });
        $(".string").eq(screen).css({
          "margin-left": lines[5] / 2 * -1,
          "width": lines[5] + "px"
        });
        $(".limit").eq(0).animate({
          "margin-left": lines[5] / 2 * -1
        });
        $(".limit").eq(1).animate({
          "margin-left": lines[5] / 2
        });
        $("#compare").css({
          "margin-left": lines[5] / 2 - 130
        });
        return $("#canvas").animate({
          "width": lines[5],
          "margin-left": lines[5] / 2 * -1
        });
      }
    };
    if (currentScreen) {
      return launch(currentScreen);
    } else {
      return welcome();
    }
  };
}).call(this);
