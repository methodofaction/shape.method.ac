function Radio(selector, items){
  
  const el = dom.qs(selector);
  const g = dom.qs("svg g");

  items.forEach((obj, i) => {
    const radio = dom.create({el: 'a', "data-index": i, href: '#', html: obj.name, class: !i ? 'selected': ''}, el);
    radio.addEventListener("click", (e)=>{
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      select(index);
      obj.fn(true);
    })
  });

  function hide(){
    el.style.display = "none";
  }

  function show(){
    el.style.display = "";
  }

  function select(index) {
    const items = dom.qsa("a", el);
    items.forEach(radio => radio.classList.remove("selected"));
    items[index].classList.add("selected");
  }

  this.show = show;
  this.hide = hide;
  this.select = select;

}