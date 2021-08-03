function Stage(selector){
  const _self = this;
  const el = dom.qs(selector);
  paper.setup(el);
  const drawlayer = new paper.Layer({locked: true});
  const uiLayer = new paper.Layer();
  const doneButton = dom.gid("done");
  var path = null;
  let curve = null;
  doneButton.addEventListener("click", game.nextStage);

  const dragStyles = {
    strokeWidth: 32,
    strokeColor: runge["--d8"],
    fillColor: runge["--d8"]
  }

  const hoveredStyles = {
    strokeWidth: 32,
    strokeColor: runge["--d8"],
    fillColor: runge["--d8"],
  }

  const nodeStyles = {
    fillColor: runge["--z15"],
    strokeColor: runge["--d8"],
    strokeWidth: 2
  }

  let dragging = false;

  const tool = new paper.Tool();

  tool.onMouseDown = function(e) {
    const hitTarget = uiLayer.hitTest(e.point);
    if (!hitTarget) return;
    dragging = hitTarget.item;
    document.body.classList.add("dragging");
    path.fullySelected = false;
  }

  tool.onMouseUp = function(e) {
    document.body.classList.remove("dragging");
    path.fullySelected = true;
    dragging = false;
  }

  tool.onMouseDrag = function(e) {
    if (!dragging) return;
    const firstScreen = state.get("stageIndex") === 0;
    var x = firstScreen ? 0 : e.delta.x;
    var y = e.delta.y;

    const handle = dragging.data.handle;
    const line = dragging.data.line;
    line.lastSegment.point.x += x;
    line.lastSegment.point.y += y;
    dragging.position.x += x;
    dragging.position.y += y;
    handle.x += x;
    handle.y += y;
  }

  function insertStyles(id) {
    const style = document.documentElement.style;
    [...Array(16).keys()].forEach(number => {
      const value = runge["--" + id + number]
      style.setProperty('--z' + number, value);
    });
  }

  function render(data) {
    insertStyles(data.scheme);
    const colors = runge.switch(data.scheme);
    drawlayer.clear();
    uiLayer.clear();
    drawlayer.activate()
    drawlayer.selectedColor = runge["--z8"]
    const bounds = new paper.Path.Rectangle(0,150,window.innerWidth,window.innerHeight-300);
    const hiddenPath = new paper.CompoundPath(data.path);
    hiddenPath.fitBounds(bounds.bounds);
    hiddenPath.fillColor = runge["--z12"];
    path = new paper.CompoundPath(data.path);
    path.fitBounds(bounds.bounds);
    path.fillColor = runge["--z12"];
    path.fullySelected = true;
    path.blendMode = "screen";
    uiLayer.activate();
    data.destroy.forEach(node => {
      const curve = path.curves[node.index];
      const handle =  curve["handle" + node.handle];
      handle.x = 0;
      handle.y = 0;

      // node
      const seg = curve["segment" + node.handle];
      const pt = seg.point;
      const line = new paper.Path.Line(pt, pt);
      line.style = nodeStyles;
      const segSquare = new paper.Path.Rectangle(
        seg.point.transform(new paper.Matrix(1, 0, 0, 1, 3, 3)), 
        seg.point.transform(new paper.Matrix(1, 0, 0, 1, -3, -3))
      )
      segSquare.style = nodeStyles;

      const circle = new paper.Path.Circle(pt, 8);
      circle.set(dragStyles);
      circle.strokeColor.alpha = 0.2;
      circle.data.handle = handle;
      circle.data.line = line;
      circle.onMouseEnter = function(e){ 
        this.strokeColor.alpha = 0.3; 
        document.body.classList.add("draggable");
      };
      circle.onMouseLeave = function(e){ 
        this.strokeColor.alpha = 0.2;
        document.body.classList.remove("draggable");
      };

    });
  }

  function tryAgain(){
    game.loadStage(state.get("stageIndex"));
  }

  function load(data) {
    el.classList.remove("comparing");
    render(data);
    table.render(data.metadata);
  }

  function getStage(){
    const index = state.get("stageIndex");
    const stage = stages[index];
    return stage;
  }

  function play(){
    el.classList.remove("comparing");
  }

  this.paper = paper;
  this.load = load;
  this.play = play;
  this.selectedIndex = false;
}