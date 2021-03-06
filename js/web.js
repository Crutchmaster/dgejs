logspaces = 0;
function log(s,lvl,on = true) {
    if (!on) return;
    if (lvl == "++") logspaces += 2;
    if (lvl == "--") logspaces -= 2;
    if (logspaces < 0) logspaces = 0;
    console.log(" ".repeat(logspaces)+s);
    if (lvl == "+") logspaces += 2;
    if (lvl == "-") logspaces -= 2;
    if (logspaces < 0) logspaces = 0;
}

function say(str) {
    divPush("log",str+"<br/>");
}

function getDiv(id) {
    return document.getElementById(id);
}
function divClear(id) {
    getDiv(id).innerHTML = "";
}

function divAppend(id, str) {
    getDiv(id).innerHTML += str;
}

function divPush(id, str) {
    var div = getDiv(id);
    var divStr = div.innerHTML;
    div.innerHTML = str + divStr;
}

function button(cb, label) {
    return "<button onclick=\""+cb+"\">"+label+"</button><br/>";
}

function turn() {
    acts = e.getActions(h);
    divClear("actions");
    for (var actName in acts.actions) {
        for (var i in acts.actions[actName]) {
                var label = Action[actName].name(acts.actor, ...acts.actions[actName][i]);
                var cb = "doAction('"+actName+"', "+i+")";
                divAppend("actions",button(cb, label));
            }
    }
    divClear("data");
    var humanData = h.getData();
    for (var dname in humanData) {
        var data = humanData[dname];
        divAppend("data", data.label + data.text + "</br>");
    }

}

function doAction(actName, n) {
    e.doAction(actName, acts.actor, acts.actions[actName][n]);
    e.turnAI();
    turn();
}

function init() {
    acts = {};
    e = new Engine();
    h = new Human("Вася");
    h2 = new Human("Федя");
    h2.ai = TraderAI;
    a = new Apple();
    b = new Bag();
    var thisPlace = "room";
    h.place = thisPlace;
    h2.place = thisPlace;
    a.place = h2.hands;
    h2.hands.item = a;
    b.place = thisPlace;
    e.objects.push(h, h2, a, b);
}

init();
document.addEventListener("DOMContentLoaded", turn());
