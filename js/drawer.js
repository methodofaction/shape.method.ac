function Drawer(selector) {
  const el = dom.qs(selector);

  function toggle(){ el.classList.toggle("open") }
  function open()  { el.classList.add("open")    }
  function close() { el.classList.remove("open") }

  el.addEventListener("click", function(e){
    e.stopPropagation();
    el.classList.toggle("open")
  });

  this.toggle = toggle;
  this.open = open;
  this.close = close;
}