var Engine = require("./engine.js");
var Apple = require("./apple.js");
var Human = require("./human.js");

function showActions(acts) {
    log(acts.actor.name+" can:");
    for (var actName in acts.actions) {
        var objs = acts.actions[actName].objs;
        for (var i in objs) {
            var obj = objs[i];
            log(actName+" "+obj.name);
        }
    }
}

function log(s) {
    console.log(s);
}

var e = new Engine();
var h = new Human();
var a = new Apple();
var b = new Bag();
var thisPlace = "room";
h.place = thisPlace;
a.place = thisPlace;
b.place = thisPlace;
e.objects.push(h, a);
log(h);
var res = e.getActions(h);
log(h);
res.actions.take.doit(0);
var res = e.getActions(h);
showActions(res);
res.actions.drop.doit(0);
log(h);
var res = e.getActions(h);
showActions(res);
