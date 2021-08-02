function Stage(selector){
  const _self = this;
  const el = dom.qs(selector);
  paper.setup(el);
  const drawlayer = new paper.Layer({locked: true});
  const uiLayer = new paper.Layer();
  const compareButton = dom.gid("compare");
  const nextButton = dom.gid("next");
  var path = null;
  const scoreWidget = dom.gid("scoreWidget");
  const tryAgainButton = dom.qs("a", scoreWidget);
  let curve = null;
  compareButton.addEventListener("click", function(){state.set("stageComparing", true)});
  nextButton.addEventListener("click", game.nextStage);
  tryAgainButton.addEventListener("click", tryAgain);

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

  uiLayer.onMouseDown = function(e) {
    const hitTarget = uiLayer.hitTest(e.point);
    if (!hitTarget) return;
    dragging = hitTarget.item;
    document.body.classList.add("dragging");
    path.fullySelected = false;
  }

  uiLayer.onMouseUp = function(e) {
    document.body.classList.remove("dragging");
    path.fullySelected = true;
  }

  uiLayer.onMouseDrag = function(e) {
    if (!dragging) return;
    const firstScreen = state.get("stageIndex") === 0;
    const x = firstScreen ? 0 : e.delta.x;
    const y = e.delta.y;
    const handle = dragging.data.handle;
    const line = dragging.data.line;
    line.lastSegment.point.x += x;
    line.lastSegment.point.y += y;
    dragging.position.x += x;
    dragging.position.y += y;
    handle.x += x;
    handle.y += y;
    if (firstScreen) {
      console.log(curve["handle1"].y)
    }
  }

  function render(data) {
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
    uiLayer.activate()
    data.destroy.forEach(node => {
      const curve = path.curves[node.index];
      const handle =  curve["handle" + node.handle];
      handle.x = 0;
      handle.y = 0;

      // node
      const seg = curve["segment" + node.handle];
      const pt = seg.point;
      const segSquare = new paper.Path.Rectangle(
        seg.point.transform(new paper.Matrix(1, 0, 0, 1, 4, 4)), 
        seg.point.transform(new paper.Matrix(1, 0, 0, 1, -4, -4))
      )
      segSquare.style = nodeStyles;
      const line = new paper.Path.Line(pt, pt);
      line.style = nodeStyles;
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
    const rs = renderScene.bind(_self);
    rs(data);
    table.render(data);
    radio.hide();
    nextButton.classList.add("hidden");
    compareButton.classList.remove("hidden");
    scoreWidget.classList.add("hidden");
  }

  function renderScene(data){
    if (!data.scene) return;
    else data.scene(this);
  }

  function getStage(){
    const index = state.get("stageIndex");
    const stage = stages[index];
    return stage;
  }

  function play(){
    el.classList.remove("comparing");
  }

  function compare(){
    const stage = getStage();
    table.hide();
    radio.show();
    el.classList.add("comparing");
    nextButton.classList.remove("hidden");
    compareButton.classList.add("hidden");
    scoreWidget.classList.remove("hidden");
    score();
    compareBoth();
  }

  function score(){
    const stage = getStage();
    
    const score = 100;

    anime({
      targets: dom.gid("score"),
      duration: 1000,
      round: 1,
      innerHTML: [0, score],
      easing: "cubicBezier(0.000, .800, 0.485, .800)",
    })
  }

  function compareBoth(){
  }

  function compareSolution(){
    const stage = getStage();
    
  }

  function compareYour(){
    const stage = getStage();

  }

  function getPositions(){
  }

  function getPositionsPct(){
    
  }


  function reposition(dx){

 
  }


  this.paper = paper;
  this.load = load;
  this.getPositions = getPositions;
  this.compare = compare;
  this.play = play;
  this.compareSolution = compareSolution;
  this.compareYour = compareYour;
  this.compareBoth = compareBoth;
  this.selectedIndex = false;
  this.reposition = reposition;
  this.tryAgain = tryAgain;

}