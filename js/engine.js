var Conditions = require("./conditions.js");
var Things = require("./things.js");
var Action = require("./action.js");

var Engine = function() {
    this.objects = [];
    this.getActions = function(actor) {
        log("Begin GetActions","+");
        var ret = {actor:actor, actions : {}};
        for (var i in actor.can) {
                var actName = actor.can[i];
                var objs = this.objectsForAction(actName, actor);
                if (!ret.actions[actName]) ret.actions[actName] = [];
                ret.actions[actName] = ret.actions[actName].concat(objs);
        }
        log("Done getActions","--");
        return ret;
    }
    
    this.doAction = function(actName, actor, obj) {
        var act = Action[actName];
        if (act.active) act.active(actor, obj);
        if (act.passive) act.passive(actor, obj);                        
    }

    this.objectsForAction = function(actName, actor, provider) {
            log("=== Action == "+actName+" == things check...","+");
            if (typeof(provider) == "undefined") {
                provider = actor;
                log("Provider not exists");
            } else {
                log("Provider is "+provider.name);
            }

            var endVariants = [];
            var act = Action[actName];
            var reqThings = act.actorReq ? act.actorReq : [];
            if (act && this.thingCheck(actor, reqThings)) {

                log("Collect variants...","--");
                var variants = [];
                for (var ai in act["for"]) {
                    variants[ai] = [actor];
                    for (var ci in act["for"][ci]) {
                        var collectName = act["for"][ai][ci];
                        log("Collect for "+collectName,"+");
                        if (this[collectName]) {
                            variants[ai] = variants[ai].concat(this[collectName](actor));
                        } else {
                            log("Error: can't collect for "+collectName);
                        }
                        log("Collected.","--");
                    }
                }

                log("Check conditions:","+");
                var ai = [], al = [];
                var cnt = variants.length;
                for (var j = 0; j < cnt; j++) {ai[j] = 0; al[j] = variants[j].length;}
                ai[-1] = 0;
                while (ai[-1] == 0) {
                    var combine = [];
                    var check = true;
                    var varstr = "";
                    for (var j = 0; j < cnt; j++) {
                        var obj = variants[j][ai[j]];
                        if (!obj.can_be || obj.can_be.indexOf(actName) == -1) {check = false; break}
                        combine.push(obj);
                        varstr += obj.name+";";
                    }
                    log("Combination: "+varstr);
                    if (check) {
                        log("can be "+actName);
                        if (!act.condition || act.condition(Conditions, actor, ...combine)) { 
                            log("Condition - ok");
                            if (endVariants.indexOf(combine) == -1) endVariants.push(combine); //TODO do end variants
                        } else {
                            log("Conditions NOT passed");
                        }
                    }
                    
                    ai[cnt-1]++;
                    for (var j = cnt-1; j >= 0; j--) if (ai[j] >= al[j]) {ai[j] = 0; ai[j-1]++;}
                }
            }
        log("Check "+actName+" done.","--");
        log(endVariants);
        return endVariants;
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
    this.self = function(actor) {
        log("Search objects in sameself");
        var ret = [];
        for (var i in this.objects) {
            var obj = this.objects[i];
            if (obj != actor && obj.place == actor) {
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
module.exports = Engine;
