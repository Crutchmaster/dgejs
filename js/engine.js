var Conditions = require("./conditions.js");
var Things = require("./things.js");
var Action = require("./action.js");
/**
 * Движок. Рулит объектами, проверяет возможность совершения действий с ними на основе условий для действий.
 */

var Engine = function() {
    this.objects = [];
    this.turnAI = function() {
        for (var i = 0, c = this.objects.length; i < c; i++) {
            var a = this.objects[i];
            log("Run ai for "+a.name);
            if (a.ai) {
                log("Run AI for "+a.name);
                var aiActs = this.getActions(a);
                console.log(aiActs);
                this.runAI(aiActs);
            }
        }
    }

    this.runAI = function(acts) {
        var ai = a.ai;
        var runAct = this.checkActions(acts);
        console.log(runAct);
        if (runAct) this.doAction(runAct.actName, runAct.actor, runAct.args);
    }


    this.checkActions = function(a) {
        var actor = a.actor;
        var acts = a.actions;
        for (var i = 0, ci = actor.ai.actions.length; i < ci; i++) {
            var act = actor.ai.actions[i];
            var actName = act.actName;
            var args = act.args;
            if (acts[actName]) {
                for (var j = 0, cj = acts[actName].length; j < cj; j++) {
                    var args2 = acts[actName][j];
                    if (this.compare(args, args2)) {
                        actor.ai.actions.splice(i, 1);
                        return { "actName" : actName,
                                 "actor" : actor,
                                 "args" : args,
                                 "index" : i
                        };
                    }
                }
            }
        }
        return false;
    }
    this.compare = function(a, b) {
        log("compare:");
        console.log(a);
        console.log(b);
        log("------");
        var i = a.length;
        if (i != b.length) return false;
        while (i--) if (a[i] != b[i]) return false;
        return true;
    }

    /**
     * Выдаёт массив с объектами и всеми возможными действиями над ними для определённого актора
     */
    this.getActions = function(actor) {
        var D = false;
        log("GetActions");
        var ret = {actor:actor, actions : {}};
        //Перебираем всё, что актор может
        for (var i in actor.can) {
                var actName = actor.can[i];
                //Собираем объекты для действия
                var objs = this.objectsForAction(actName, actor);
                if (!ret.actions[actName]) ret.actions[actName] = [];
                ret.actions[actName] = objs;
        }
        log("Done getActions","--",D);
        return ret;
    }
    /**
     * Выполняет действие для массива объектов
     */
    
    this.doAction = function(actName, actor, objs) {
        log("do Action for "+actor.name);
        var act = Action[actName];
        for (var i = 0, ci = objs.length; i < ci; i++) {
            var obj = objs[i];
            log("Check triggers for "+obj.name);
            if (obj.ai) {
                var tg = obj.ai.triggers;
                if (tg[actName]) {
                    var tgs = tg[actName];
                    for (var j = 0, cj = tgs.length; j < cj; j++) {
                        var trig = tgs[j];
                        if (trig.condition(actor, ...objs)) {
                            var newAction = trig.trigger(actor, ...objs);
                            log("Add action "+newAction.actName+" for ai of "+obj.name);
                            obj.ai.actions.push(newAction);
                        }
                    }
                }
            }
        }
        if (act.do) act.do(actor, ...objs);
    }

    /**
     * Сбор объектов для действия
     */

    this.objectsForAction = function(actName, actor) {
            var D = false;
            log("=== Action == "+actName,"+",D);

            var endVariants = [];
            var act = Action[actName];
            if (act) {

                log("Collect variants...","--",D);
                //Собираем массив объектов [[a,b,c],[d,e],[f,g]] (первый, второй, ... элемент для действия)
                var variants = this.collectVariants(act, actor);

                log("Check conditions:","+",D);
                //Комбинируем массив объектов и проверяем условния (из Action.condition) [[a,b,c],[d,e],[f,g]] => [[a,d,f],[a,d,g],[a,e,f], ...] => condition(a,d,f), condition(a,d,g), ...
                endVariants = this.combine(act, variants, actor, actName);
            }
        log("Check "+actName+" done.","--",D);
        return endVariants;
    }

    /**
     * Комбинирование объектов и проверка условий выполнения действия
     */

    this.combine = function(act, variants, actor, actName) {
        var D = false;
        var endVariants = [];
        //Индекс и количество вариантов для каждого участника действия
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
            //Кобминирование, провекра на возможность действия над объектов (obj.can_be)
            for (var j = 0; j < cnt; j++) {
                var obj = variants[j][ai[j]];
                if (!obj.can_be || obj.can_be.indexOf(actName) == -1) {
                    check = false;
                    break
                }
                varstr += obj.name+";";
                combine.push(obj);
            }
            if (varstr != "") log("Combination: "+varstr,null,D);
            if (check) {
                log("can be "+actName, null, D);
                //Проверка условий действия над всей комбинацией
                if (!act.condition || act.condition(Conditions, actor, ...combine)) { 
                    log("Condition - ok", null, D);
                    endVariants.push(combine);
                } else {
                    log("Conditions NOT passed", null, D);
                }
            }
            //Счётчик для комбинаций
            ai[cnt-1]++;
            for (var j = cnt-1; j >= 0; j--)
                if (ai[j] >= al[j]) {ai[j] = 0; ai[j-1]++;}
        }
    return endVariants;
    }
    /**
     * Сборка вариантов для действия (из Action.for)
     * Коллекции разбиты в двумерный массив.
     * Видна - участник действия - объекты.
     */

    this.collectVariants = function(act, actor) {
        var D = false;
        var variants = [];
        for (var ai in act["for"]) {
            //По агрументам. Можно использовать для поиска объектов уже собранные для ai > 0.
            //Первый вариант - сам актор
            variants[ai] = [actor];
            for (var ci in act["for"][ai]) {
                //Сбор объектов
                var collectName = act["for"][ai][ci];
                log("Collect for "+collectName,"+", D);
                var newObjs = [];
                //Сборщик - сам движок - в перспективе поменять/добавить. Функция должна возвращать массив.
                if (this[collectName]) newObjs = this[collectName](actor, variants);
                else if (Collectors[collectName]) newObjs = Collectors[collectName](actor, variants);
                else log("Error: can't collect for "+collectName, null, D);

                for (var k in newObjs) {
                    //сохранение уникальных объектов для каждого аргумента
                    var newObj = newObjs[k];
                    log("collected:"+newObj.name, null, D);
                    if (variants[ai].indexOf(newObj) == -1) variants[ai].push(newObj);
                }

                log("Collected.","--", D);
            }
        }
    return variants;
    }
    /**
     * Сбор объектов из одного и того же места
     */
    this.samePlace = function(actor) {
        var D = false;
        log("Search objects on "+actor.place, null, D);
        var ret = [];
        for (var i in this.objects) {
            var obj = this.objects[i];
            if (obj != actor && obj.place == actor.place) {
                log("Found "+obj.name, null, D);
                ret.push(obj);
            }
        }
        return ret;
    }
    /**
     * Предметы в руках актора
     */
    this.actorHands = function(actor) {
        var ret = [];
        if (actor.hands.item) ret.push(actor.hands.item);
        return ret;
    }
    /**
     * Предметы в контейнере
     */
    this.stored = function(actor, objs) {
        var ret = [];
        for (var i in objs) {
            for (var j in objs[i]) {
                var obj = objs[i][j];
                if (obj.storage) {
                    //log("Found storage in "+obj.name);
                    ret = ret.concat(obj.storage);
                }
            }
        }
    return ret;
    }
}
module.exports = Engine;
