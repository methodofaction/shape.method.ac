function draggable(node) {
  const root_sctm = svgRoot.getScreenCTM().inverse();
  var zoom = 1;
  var touched = false;
  var x;
  var y;

  node.addEventListener('touchstart', handleMousedown);
  node.addEventListener('mousedown', handleMousedown);

  function handleMousedown(e) {
    e.preventDefault();

    touched =  e.touches ? e.touches.length : false;
    if (touched) e = e.touches[0];
    const pt = utils.transformPoint( e.screenX, e.screenY, root_sctm );

    zoom = svgRoot.viewBox.baseVal.width/window.innerWidth;

    x = pt.x * zoom;
    y = pt.y * zoom;
    
    const els = utils.elementsAt(e.pageX, e.pageY);
    const l = els.find((el)=> el.nodeName === "path");
    node = l ? l.parentNode : node;
    node.dispatchEvent(new CustomEvent('dragstart', {
      detail: { x, y }
    }));

    window.addEventListener(touched ? 'touchmove' : 'mousemove', handleMousemove, {passive: false});
    window.addEventListener(touched ? 'touchend' : 'mouseup', handleMouseup);
  }

  function handleMousemove(e) {
    e.preventDefault();
    if (touched) e = e.touches[0];
    var pt = utils.transformPoint( e.screenX, e.screenY, root_sctm );
    if (touched) zoom = 1;
    const dx = (pt.x * zoom - x);
    const dy = (pt.y * zoom - y);
    x = pt.x * zoom,
    y = pt.y * zoom;


    node.dispatchEvent(new CustomEvent('dragmove', {
      detail: { x, y, dx, dy }
    }));
  }

  function handleMouseup(e) {
    //e.preventDefault();
    if (touched) e = e.changedTouches[0];
    var pt = utils.transformPoint( e.screenX, e.screenY, root_sctm ),
    x = pt.x * zoom,
    y = pt.y * zoom;


    node.dispatchEvent(new CustomEvent('dragend', {
      detail: { x, y }
    }));

    window.removeEventListener(touched ? 'touchmove' : 'mousemove', handleMousemove);
    window.removeEventListener(touched ? 'touchend' : 'mouseup', handleMouseup);
  }

  return {
    destroy() {
      node.removeEventListener('touchstart', handleMousedown);
      node.removeEventListener('mousedown', handleMousedown);
    }
  };
}