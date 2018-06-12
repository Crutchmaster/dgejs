function log(s) {
    console.log(s);
}

function getDiv(id) {
    return document.getElementById(id);
}
function divClear(id) {
    log(getDiv(id));
    getDiv(id).innerHTML = "";
}

function divAppend(id, str) {
    getDiv(id).innerHTML += str;
}

function button(cb, label) {
    return "<button onclick=\""+cb+"\">"+label+"</button><br/>";
}

function turn() {
    acts = e.getActions(h);
    log("=== Actions:");
    log(acts);
    divClear("actions");
    for (var actName in acts.actions) {
        log(actName+" object check");
        for (var i in acts.actions[actName].objs) {
                var obj = acts.actions[actName].objs[i];
                var cb = "doAction('"+actName+"', "+i+")";
                var label = actName+" "+obj.name;
                log(label);
                divAppend("actions",button(cb, label)); 
            }
    }
    divClear("data");
    divAppend("data", h.name+"<br/>");
    divAppend("data", h.hands.name + ": " + (h.hands.item ? h.hands.item.name : "none"));
}

function doAction(actName, n) {
    acts.actions[actName].doit(n);
    turn();
}

function init() {
    acts = {};
    e = new Engine();
    h = new Human();
    a = new Apple();
    var thisPlace = "room";
    h.place = thisPlace;
    a.place = thisPlace;
    e.objects.push(h, a);
}

init();
document.addEventListener("DOMContentLoaded", turn());
