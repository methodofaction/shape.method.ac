window.addEventListener("keydown", function(e){
  
  const key = e.key;
  const command = navigator.platform.toUpperCase().indexOf('MAC')>=0 ? e.metaKey : e.ctrlKey;
  const shift = e.shiftKey;

  //console.log(key)

  if (key === "k") {
    e.preventDefault();
    drawer.toggle();
  }

  if (key === "Tab") {
    e.preventDefault();
    stage[shift ? "selectPrev" : "selectNext"]();
  }

  if (key === "ArrowRight") {
    e.preventDefault();
    stage.nudgeSelected(shift ? 10 : 1)
  }

  if (key === "ArrowLeft") {
    e.preventDefault();
    stage.nudgeSelected(shift ? -10 : -1)
  }

  if (key === "Enter") {
    e.preventDefault();
    const comparing = state.get("stageComparing");

    if (comparing) {
      if (shift) game.load()
      else game.nextStage()
    }
    else {
      if (shift) game.prevStage()
      else state.set("stageComparing", true);
    }
  }

});

dom.qsa(".metaKey").forEach(function(metaKey){
  metaKey.innerHTML = utils.metaKey();
});