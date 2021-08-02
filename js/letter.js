function Letter(d, x) {
  d = path.translate(x, 0)(d);
  const _self = this;
  const svg = dom.qs(".stage svg");
  const root_sctm = svg.getScreenCTM().inverse();

  let dx = 0,
      g = dom.createNS({el: "g", class: "draggable letter"}),
      rect,
      pathEl;

  draggable(g);

  function renderLetter(d) {
    const bbox = path.getBBox(d);
    const pt = utils.transformPoint(0,0, root_sctm);
    const pt2 = utils.transformPoint(0,window.innerHeight, root_sctm);
    const lines = stages[state.get("stageIndex")].lines;
    rect = dom.createNS({
      el: "rect",
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
      fill: "rgba(0,0,0,0)",
      class: "dragarea"
    }, g)
    pathEl = dom.createNS({ el: "path", d: d}, g);
    
  }

  function lock(){
    g.classList.remove("draggable");
    g.classList.add("locked");
    this.isLocked = true;
  }

  function unlock(){
    g.classList.add("draggable");
    g.classList.remove("locked");
    this.isLocked = false;
  }
  
  function dragstart(e){
    drawer.close();
    if (_self.isLocked) {
      message.show("Letter is fixed")
    }
  }

  function dragmove(e){
    if (_self.isLocked) return;
    dx += e.detail.dx;
    if (dx > 30) dx -= e.detail.dx;
    if (dx < -30) dx -= e.detail.dx;
    g.setAttribute("transform", `translate(${dx},0)`);
  }

  function dragend(e){
    if (dx) stage.reposition(dx);
  }

  function select(){
    g.classList.add("selected");
  }

  function deselect(){
    g.classList.remove("selected");
  }

  function toggle(bool = true){
    if (!bool) g.setAttribute("visibility", "hidden");
    else g.removeAttribute("visibility");
  }

  function nudge(amount){
    const transform = g.getAttribute("transform");
    const x = transform ? parseInt(transform.split("(")[1].split(",")[0]) : 0;
    g.setAttribute("transform", `translate(${x + amount}, 0)`)
  }

  function fadeOut(){
    anime({
      targets: g,
      duration: 500,
      easing: "easeInOutCubic",
      opacity: 0,
      complete: function(anim){
        g.setAttribute("visibility", "hidden");
        g.style.opacity = 1;
      }
    })
  }

  function remove(){
    g.removeEventListener("dragstart", dragstart);
    g.removeEventListener("dragmove", dragmove);
    g.removeEventListener("dragend", dragend);
    g.parentNode.removeChild(g);
  }

  function getOffset(){
    const transform = g.getAttribute("transform");
    if (!transform) return 0;
    const value = parseInt(
      transform
        .split("(")[1]
        .split(",")[0], 
    10);
    return isNaN(value) ? 0 : value;
  }

  function getDistance(x){
    return _self.getOffset() - x;

  }

  function slide(pos){
    anime({
      targets: g,
      duration: 1000,
      easing: "cubicBezier(0.000, .800, 0.485, .800)",
      transform: [`translate(${_self.getOffset()}, 0)`, `translate(${pos}, 0)`]
    })
  }

  function moveTo(x) {
    g.setAttribute("transform", `translate(${x}, 0)`);
  }

  function overlaps(letter) {
    const selfBBox = _self.path.getBBox() + _self.getOffset();
  }


  g.addEventListener("dragstart", dragstart);
  g.addEventListener("dragmove", dragmove);
  g.addEventListener("dragend", dragend);

  renderLetter(d);

  this.select = select;
  this.deselect = deselect;
  this.nudge = nudge;
  this.remove = remove;
  this.getOffset = getOffset;
  this.g = g;
  this.rect = rect;
  this.path = pathEl;
  this.lock = lock;
  this.unlock = unlock;
  this.isLocked = false;
  this.toggleVisibility = toggle;
  this.moveTo = moveTo;
  this.slide = slide;
  this.fadeOut = fadeOut;
  this.getDistance = getDistance;

  return this;

}
