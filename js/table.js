function Table(selector){
  const el = dom.qs(selector);
  function hide(){
    el.style.display = "none";
  }

  function show(){
    el.style.display = "";
  }

  function render(data){

    // table exists? remove 
    let t = dom.qs("table");
    if (t) t.parentNode.removeChild(t);

    if (!data) return hide();

    const table = dom.create({el: "table"});

    const t_tr = dom.create({el: "tr"}, table);
    const t_th = dom.create({el: "th", html: "Typeface"}, t_tr);
    const t_td = dom.create({el: "td"}, t_tr);
    const t_a = dom.create({el: "a", 
          target: "_blank", 
          href: data.TypefaceUrl,
          html: data.Typeface
        }, t_td);

    const c_tr = dom.create({el: "tr"}, table);
    const c_th = dom.create({el: "th", html: "Creator"}, c_tr);
    const c_td = dom.create({el: "td"}, c_tr);
    const c_a = dom.create({el: "a", 
          target: "_blank", 
          href: data.DesignerUrl,
          html: data.Designer
        }, c_td);
    dom.create({el: "span", class: "mobile-only", html: ' in ' + data.year}, c_td)

    const y_tr = dom.create({el: "tr", class: "desk-only"}, table);
    const y_th = dom.create({el: "th", html: "Released"}, y_tr);
    const y_td = dom.create({el: "td", html: data.Released}, y_tr);


    el.appendChild(table);
    this.show();
  }

  this.render = render;
  this.show = show;
  this.hide = hide;
}