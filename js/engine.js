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
                var objs;
                [objs, actName] = this.objectsForAction(actName, actor);

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
            if (act && this.thingCheck(actor, act.actorReq)) {
                log("Collect variants...","--");
                var variants = [actor];
                for (var j in act["for"]) {
                    var collectName = act["for"][j];
                    log("Collect for "+collectName,"+");
                    if (this[collectName]) {
                        variants = variants.concat(this[collectName](provider));
                    } else {
                        log("Error: can't collect for "+collectName);
                    }
                    log("Collected.","--");
                }
                log("Check conditions:","+");
                for (var k in variants) {
                    var obj = variants[k];
                    log("Check "+obj.name);
                    var logstr = obj.name + " " + actName + ":";

                    if (obj.can_be && obj.can_be.indexOf(actName) != -1) {
                        logstr += obj.name + " can be "+actName;
                        if (!act.condition || act.condition(Conditions, actor, obj)) { 
                            logstr+=" condition - ok";
                            if (endVariants.indexOf(obj) == -1) {
                                if (act.provide) {
                                    log("Found provider to "+act.provide+" on action");
                                    var provObjs;
                                    [provObjs] = this.objectsForAction(act.provide, actor, obj);
                                    endVariants.concat(provObjs);
                                    actName = act.provide;
                                } else {
                                    endVariants.push(obj);
                                }
                            } else { logstr+=" conditions NOT passed";}
                            log(logstr);
                        }
                    }
                }
            }
        log("Check "+actName+" done.","--");
        log(endVariants);
        return [endVariants, actName];
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
