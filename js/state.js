function State(){

  const _self = this

  this.set = set;
  this.get = get;
  this.clean = clean;
  this.refresh = refresh;
  this.data = _loadData();
  this.resetKGData = resetKGData;
  dao.forEach(thing => {
    this[thing.name] = eval(thing.name);
  });

  const tenThousandThings = dao.map(thing => thing.name);
  const saveableKeys = dao.filter(thing => thing.save).map(thing => thing.name);

  function refresh(){
   dao.forEach(thing => {
    this[thing.name](this.get(thing.name));
    });
  }

  function stageIndex(index) {
    game.loadStage(index);
  }

  function stageScore(index) {
    // noop
  }

  function collectionIndex(index) {
    game.loadCollection(index);
  }

  function stageTitle(title){
    game.setTitle(stageTitle);
  }

  function stageComparing(bool){
    if (bool) stage.compare();
    else stage.play();
  }

  function stagePositions(arr){
    stage.compare(bool);
  }

  function darkmode(bool){
    game.darkmode(bool);
  }


  function visited(){
    //noop
  }

  function set(key, val){
    key = key.split("-")[0] || key;
    if (tenThousandThings.indexOf(key) === -1) return console.warn( key + " not implemented");

    const archetype = dao.find(thing => thing.name === key);
     _self.data[key] = archetype.clean(val);
    if (~saveableKeys.indexOf(key)) _save(key, val);
    _self[key](val);
  }

  function get(key){
    return _self.data[key];
  }

  function clean(warn = true) {
    if (warn) {
      const confirmed = confirm("Deletes all configuration and text, are you sure?");
      if (!confirmed) return;
    }

    Object.keys(localStorage).forEach(key => localStorage.removeItem(key));
    game.reload();
  }

  // INNER UTILS

  function _save(key, val){

    if (val === undefined || val === null) throw "wont save nuthin, " + key + " " + val;
    localStorage.setItem("type" + "-" + key, val.toString());
  }

  function _loadData() {

    const data = dao.map(thing => {
      return {
        //[thing.name]: getValue(thing.name, utils.findGetParameter(thing.name) || thing.default)
        [thing.name]: getValue(thing.name, thing.default)
      }
    });
    return Object.assign({}, ...data);
  };

  function resetKGData(){
    const newScores = dao.find(thing => thing.name === "stageScore").default.split(",");
    state.set("stageScore", newScores);
    state.set("stageIndex", 0);
    game.load();
  }

  function getValue(key, def) {
    const item = localStorage.getItem("type-" + key) || def;
    const archetype = dao.find(thing => thing.name === key.split("-")[0]);
    if (archetype) return archetype.clean(item);
    else throw "Unkown archetype";
  }



}