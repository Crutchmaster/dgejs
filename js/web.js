logspaces = 0;
function log(s,lvl) {
    if (lvl == "++") logspaces += 2;
    if (lvl == "--") logspaces -= 2;
    if (logspaces < 0) logspaces = 0;
    console.log(" ".repeat(logspaces)+s);
    if (lvl == "+") logspaces += 2;
    if (lvl == "-") logspaces -= 2;
    if (logspaces < 0) logspaces = 0;
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
    log(acts);
    divClear("actions");
    for (var actName in acts.actions) {
        for (var i in acts.actions[actName]) {
                var obj = acts.actions[actName][i];
                var cb = "doAction('"+actName+"', "+i+")";
                var label = actName+" "+obj.name;
                divAppend("actions",button(cb, label)); 
            }
    }
    divClear("data");
    divAppend("data", h.name+"<br/>");
    divAppend("data", h.hands.name + ": " + (h.hands.item ? h.hands.item.name : "none"));
}

function doAction(actName, n) {
    e.doAction(actName, acts.actor, acts.actions[actName][n]);
    turn();
}

function init() {
    acts = {};
    e = new Engine();
    h = new Human();
    a = new Apple();
    b = new Bag();
    var thisPlace = "room";
    h.place = thisPlace;
    a.place = thisPlace;
    b.place = thisPlace;
    e.objects.push(h, a);
    e.objects.push(h, b);
}

init();
document.addEventListener("DOMContentLoaded", turn());
