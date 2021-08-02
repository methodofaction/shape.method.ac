const utils = {};
utils.elementsAt = function( x, y ){
    var elements = [], current = document.elementFromPoint( x, y );
    // dom.create({class: "circle", style: `left: ${x}px; top: ${y}px; `}, document.body)
    // at least one element was found and it's inside a ViewportElement
    // otherwise it would traverse up to the <html> root of jsfiddle webiste.
    while( current &&  current.nearestViewportElement ){
        elements.push( current );
        // hide the element and look again
        current.style.display = "none";
        current = document.elementFromPoint( x, y );
    }
    // restore the display
    elements.forEach( function( elm ){
       elm.style.display = ''; 
    });
    return elements;
}

utils.transformPoint = function(x, y, m) {
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f};
};

// Calculate the bounding box of an element with respect to its parent element
utils.bbox = function(el){
  var bb  = el.getBBox(),
      svg = el.ownerSVGElement,
      m = svg.getScreenCTM().inverse().multiply(svg.getScreenCTM())

  // Create an array of all four points for the original bounding box
  var pts = [
    svg.createSVGPoint(), svg.createSVGPoint(),
    svg.createSVGPoint(), svg.createSVGPoint()
  ];
  pts[0].x=bb.x;          pts[0].y=bb.y;
  pts[1].x=bb.x+bb.width; pts[1].y=bb.y;
  pts[2].x=bb.x+bb.width; pts[2].y=bb.y+bb.height;
  pts[3].x=bb.x;          pts[3].y=bb.y+bb.height;

  // Transform each into the space of the parent,
  // and calculate the min/max points from that.    
  var xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
  pts.forEach(function(pt){
    pt = pt.matrixTransform(m);
    xMin = Math.min(xMin,pt.x);
    xMax = Math.max(xMax,pt.x);
    yMin = Math.min(yMin,pt.y);
    yMax = Math.max(yMax,pt.y);
  });

  // Update the bounding box with the new values
  bb.x = xMin; bb.width  = xMax-xMin;
  bb.y = yMin; bb.height = yMax-yMin;
  return bb;
}

utils.paint = function(bbox){

  const attr = Object.assign(bbox, {
    el: "rect",
    fill: "none",
    stroke: "red"
  })
  dom.createNS(attr, dom.gid("root"))
}

utils.limit = function(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}

utils.lerp = function (value1, value2, amount) {
  //amount = amount < 0 ? 0 : amount;
  //amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
}

utils.scale = function (value) {
  var value = Math.abs(value);
  if (value > 15) return value * 3 // out of bounds
  if (value > 10) return value * 1.5 // out of bounds
  if (value < 2) return 0
  if (value < 3) return 1
  if (value < 4) return 2
  if (value < 6) return 3  
  if (value < 9) return 7
  if (value < 11) return 9
}

utils.viewBox = {x: 0, y: 0, width: 0, height: 0}