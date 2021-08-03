
window.onresize = function() {
    document.body.height = window.innerHeight;
}

window.onresize(); // called to initially set the height.

var drawer = new Drawer(".drawer");
var game = new Game();
var stage = new Stage("#canvas");
var state = new State();
var table = new Table("#tabular");
var message = new Message("#message");
var tutorial = new Tutorial();

state.set("stageIndex", state.get("stageIndex") || 1);





