
function log(s) {
    console.log(s);
}

var Engine = function() {
    this.objects = [];
    this.getActions = function(actor) {
        var ret = {actor:actor, actions : {}};
        for (var i in actor.can) {
            var actName = actor.can[i];
            log("Action "+actName+" check...");
            var act = Action[actName];
            if (act && this.thingCheck(actor, act.actorReq)) {
                log("Collect variants...");
                var variants = [actor];
                var endVariants = [];
                for (var j in act["for"]) {
                    var collectName = act["for"][j];
                    log("Collect for "+collectName);
                    if (this[collectName]) {
                        log("Get variants from engine");
                        //TODO check can/can_be
                        variants = variants.concat(this[collectName](actor));
                    } else {
                        log("Error: can't collect for "+collectName);
                    }
                }
                for (var k in variants) {
                    var obj = variants[k];
                    log("Check "+actName+" condition for "+obj.name);
                    if (act.condition(Conditions, actor, obj)) { 
                        log("Condition ok for "+actName+". Actors:"+actor.name+" and "+obj.name);
                        if (endVariants.indexOf(obj) == -1) endVariants.push(obj);
                    }
                }
            }
            var doitfunc = function(f,a) {return function(n) {
                    var obj = this.objs[n];
                    if (obj) {
                        var ac = Action[f];
                        if (ac.active) ac.active(a, obj);
                        if (ac.passive) ac.passive(a, obj);                        
                    }
                }}(actName,actor)
 
            ret.actions[actName] = {
                objs : endVariants,
                doit : doitfunc
            }
        }
        return ret;
    }

    this.thingCheck = function(actor, list) {
        for (var i in list) {
            var thingName = list[i];
            log("Check "+thingName+" for "+actor.name);
            var thing = Things[thingName];
            var actorThing = actor[thingName];
            var actorHasThing = actor.hasOwnProperty(thingName);
            if (!thing) {
                log("Error:"+thingName+" not registred.");
                return false;
            }
            if (!actorHasThing) {
                log("actor:");
                log(actor);
                log(actor.name+" don't have "+thingName);
                return false;
            }
            for (var j in thing) {
                var thingParName = thing[j];
                log("Check "+thingName+" part: "+thingParName);
                var ok = true;
                var thingPar = Things[thingParName];
                if (thingPar) ok = this.thingCheck(actorThing, thingPar);
                if (!ok) return false;
                if (!actorThing.hasOwnProperty(thingParName)) {
                    log(actor.name+"'s "+thingName+" don't have "+thingParName+".");
                    return false;
                }
            }
        }
        log("Ok");
        return true;
    }

    this.samePlace = function(actor) {
        log("Search objects on "+actor.place);
        var ret = [];
        for (var i in this.objects) {
            var obj = this.objects[i];
            if (obj != actor && obj.place == actor.place) {
                log("Found "+obj.name);
                ret.push(obj);
            }
        }
        return ret;
    }
    this.actorHands = function(actor) {
        var ret = [];
        if (actor.hands.item) ret.push(actor.hands.item);
        return ret;
    }

}

var Human = function() {
    this.name = "Human";
    this.can = ["take","drop"]; //,"put","get","wear","takeoff"];
    this.hands = {
        name : "Руки",
        item : false
    };
}

var Apple = function() {
    this.name = "Apple";
    this.can_be = ["take","drop"];
}

var Conditions = {
    samePlace : function(a,b) {return a.place == b.place;},
    notSelf : function(a,b) {return a!=b;},
    notTaken : function(a,b) {return a.hands.item != b;},
    taken : function(a,b) {return a.hands.item == b;}
}

var Things = {
    hands : ["item"]
}

var Action = {
    take : {
        actorReq : ["hands"],
        active : function(act, obj) {act.hands.item = obj;},
        passive : function(act, obj) {obj.place = act.hands;},
        for : ["samePlace"],
        condition : function(c,a,b) {return c.samePlace(a,b) && c.notSelf(a,b) && c.notTaken(a,b);}
    },
    drop : {
        actorReq : ["hands"],
        for : ["actorHands"],
        active : function(act, obj) {obj.place = act.place; act.hands.item = false;},
        condition : function(c,a,b) {return c.taken(a,b);} 
    }
}

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


var e = new Engine();
var h = new Human();
var a = new Apple();
var thisPlace = "room";
h.place = thisPlace;
a.place = thisPlace;
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

//TODO separate, make ui, can/can_be, bag
