function Tutorial(){
  const svgRoot = dom.qs("#canvas svg");
  const el = dom.create({class: "tutorial"}, dom.body);
  const finger = dom.create({class: "finger"}, el);
  const tip = dom.create({class: "tip"}, finger);
  var isPlaying = false;

   var tl = anime.timeline({
      easing: 'easeOutQuint',
      duration: 400
    });

   el.addEventListener("click", stop);
   
   function play(){
 

   }

   function stop(){
 
   }

   this.stop = stop;

   this.play = play;
}