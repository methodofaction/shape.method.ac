let dom = {
  create: function(attr = {}, parent) {
    const el = attr.el
      ? document.createElement(attr.el)
      : document.createElement("div");
    
    for (let key in attr) {
      var isAttr = key !== 'el' && key !== 'html';
      if (isAttr) el.setAttribute(key, attr[key]);
    }

    if (attr.html) el.innerHTML = attr.html;

    if (parent) parent.appendChild(el);

    return el;
  },
  createNS: function(attr = {}, parent) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", attr.el);
    
    for (let key in attr) {
      var isAttr = key !== 'el' && key !== 'html';
      if (isAttr) el.setAttribute(key, attr[key]);
    }

    if (attr.html) el.textNode(attr.html) ;

    if (parent) parent.appendChild(el);

    return el;
  },
  empty: function(el){
    el.innerHTML = "";
    return el;
  },
  emptyNS: function(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  },
  qs: function(selector, ctx){
    const el = ctx 
      ? ctx.querySelector(selector)
      : document.querySelector(selector);
    return el;
  },
  qsa: function(selector, ctx){
    const els = ctx 
      ? Array.from(ctx.querySelectorAll(selector))
      : Array.from(document.querySelectorAll(selector));
    return els;
  },
  gid: function(id) {
    return document.getElementById(id);
  },
  update: function(type, value) {
    var els = Array.from(document.querySelectorAll(`[data-type=${type}]`));
    els.forEach(el => el.innerHTML = value);
  },
  body: document.body
}
