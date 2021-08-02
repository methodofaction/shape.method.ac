function Message(selector){
  const el = dom.qs(selector);
  if (!el) throw "Node could not be found"
  
  function show(message, type, duration = 2000){
    el.classList.remove("hidden")
    if (duration) { 
      setTimeout(function(){
        el.classList.add("hidden")
      }, duration)
    }
  }
  
  function hide(message, type){
    el.classList.remove("hidden")
  }
  
  this.show = show;
}