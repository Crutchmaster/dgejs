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
    
    this.doAction = function(actName, actor, objs) {
        var act = Action[actName];
        console.log(objs);
        if (act.do) act.do(actor, ...objs);
    }

    this.objectsForAction = function(actName, actor) {
            log("=== Action == "+actName,"+");

            var endVariants = [];
            var act = Action[actName];
            if (act) {

                log("Collect variants...","--");
                var variants = this.collectVariants(act, actor);

                log("Check conditions:","+");
                endVariants = this.combine(act, variants, actor, actName);
            }
        log("Check "+actName+" done.","--");
        return endVariants;
    }

    this.combine = function(act, variants, actor, actName) {
        var endVariants = [];
        var ai = [], al = [];
        var cnt = variants.length;
        for (var j = 0; j < cnt; j++) {
            ai[j] = 0;
            al[j] = variants[j].length;
        }
        ai[-1] = 0;
        while (ai[-1] == 0) {
            var combine = [];
            var check = true;
            var varstr = "";
            for (var j = 0; j < cnt; j++) {
                var obj = variants[j][ai[j]];
                if (!obj.can_be || obj.can_be.indexOf(actName) == -1) {
                    check = false;
                    break
                }
                varstr += obj.name+";";
                combine.push(obj);
            }
            if (varstr != "") log("Combination: "+varstr);
            if (check) {
                log("can be "+actName);
                if (!act.condition || act.condition(Conditions, actor, ...combine)) { 
                    log("Condition - ok");
                    endVariants.push(combine);
                } else {
                    log("Conditions NOT passed");
                }
            }
            ai[cnt-1]++;
            for (var j = cnt-1; j >= 0; j--)
                if (ai[j] >= al[j]) {ai[j] = 0; ai[j-1]++;}
        }
    return endVariants;
    }

    this.collectVariants = function(act, actor) {
        var variants = [];
        for (var ai in act["for"]) {
            variants[ai] = [actor];
            for (var ci in act["for"][ai]) {
                var collectName = act["for"][ai][ci];
                log("Collect for "+collectName,"+");
                if (this[collectName]) {
                    var newObjs = this[collectName](actor, variants);
                    for (var k in newObjs) {

                        var newObj = newObjs[k];
                        log("collected:"+newObj.name);
                        if (variants[ai].indexOf(newObj) == -1) variants[ai].push(newObj);
                    }
                } else {
                    log("Error: can't collect for "+collectName);
                }
                log("Collected.","--");
            }
        }
    return variants;
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
    this.stored = function(actor, objs) {
        var ret = [];
        for (var i in objs) {
            for (var j in objs[i]) {
                var obj = objs[i][j];
                if (obj.storage) {
                    log("Found storage in "+obj.name);
                    ret = ret.concat(obj.storage);
                }
            }
        }
    return ret;
    }
}
module.exports = Engine;
