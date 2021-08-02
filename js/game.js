function Game(){


  dom.gid("tryagain").addEventListener("click", function(e){
    e.preventDefault();
    dom.gid("overlay").classList.remove("show");
    reload();
  })

  function load(){
    state.set("stageIndex", 1)
    const index = state.get("stageIndex");
    const isDark = state.get("darkmode");
    const hasVisited = state.get("visited");
    loadStage(index);
    darkmode(isDark);
    if (!index) tutorial.play();
  }

  function loadCollection(index){
    // tbi
  }

  function loadStage(index){
    const scores = state.get("stageScore").filter(score => score > 1);
    stage.load(stages[index]);
    this.currentStage = stages[index];
    state.set("stageComparing", false);
    if (scores.length >= 10) return finish();
  }

  function nextStage(){
    var currentIndex = state.get("stageIndex");
    if (currentIndex >= stages.length-1)
      state.set("stageIndex", 0);
    else 
      state.set("stageIndex", currentIndex + 1);
  }

  function prevStage(){
    var currentIndex = state.get("stageIndex");
    if (currentIndex <= 0)
      state.set("stageIndex", stages.length-1);
    else 
      state.set("stageIndex", currentIndex + 1);
  }

  function reload(){
    state.resetKGData();
    load();
  }
  function setPageTitle(stageTitle){
    document.title = stageTitle ? stageTitle + " – KernType" : "KernType";
  }

  function darkmode(bool){
    document.body.classList.toggle("inverted", !bool);
  };

  function finish(){

    dom.gid("overlay").classList.add("show");

    const score = Math.ceil(state.get("stageScore").reduce((a, b) => parseInt(a, 10) + parseInt(b, 10))/10)
    anime({
      targets: "#finaltotalscore",
      duration: 2000,
      round: 1,
      innerHTML: [0, score],
      easing: "cubicBezier(0.000, .800, 0.485, .800)",
    });


    const text = encodeURI(`I got ${score}/100 on KernType, a letter spacing game.`);
    const url = encodeURI("https://type.method.ac");
    const intent = "https://twitter.com/intent/tweet";
    const hashtags = "KernType";

    dom.gid("twitter").setAttribute("href", `${intent}?text=${text}&url=${url}&hashtags=${hashtags}`);


  }

  this.loadStage = loadStage;
  this.load = load;
  this.nextStage = nextStage;
  this.prevStage = prevStage;
  this.reload = reload;
  this.darkmode = darkmode;
  this.loadColletion = loadCollection;
  this.finish = finish;

}