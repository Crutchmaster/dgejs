var Conditions = require("./conditions.js");
var Things = require("./things.js");
var Action = require("./action.js");
/**
 * Движок. Рулит объектами, проверяет возможность совершения действий с ними на основе условий для действий.
 */

var Engine = function() {
    this.objects = [];
    /**
     * Выдаёт массив с объектами и всеми возможными действиями над ними для определённого актора
     */
    this.getActions = function(actor) {
        log("Begin GetActions","+");
        var ret = {actor:actor, actions : {}};
        //Перебираем всё, что актор может
        for (var i in actor.can) {
                var actName = actor.can[i];
                //Собираем объекты для действия
                var objs = this.objectsForAction(actName, actor);
                if (!ret.actions[actName]) ret.actions[actName] = [];
                ret.actions[actName] = objs;
        }
        log("Done getActions","--");
        return ret;
    }
    /**
     * Выполняет действие для массива объектов
     */
    
    this.doAction = function(actName, actor, objs) {
        var act = Action[actName];
        if (act.do) act.do(actor, ...objs);
    }

    /**
     * Сбор объектов для действия
     */

    this.objectsForAction = function(actName, actor) {
            log("=== Action == "+actName,"+");

            var endVariants = [];
            var act = Action[actName];
            if (act) {

                log("Collect variants...","--");
                //Собираем массив объектов [[a,b,c],[d,e],[f,g]] (первый, второй, ... элемент для действия)
                var variants = this.collectVariants(act, actor);

                log("Check conditions:","+");
                //Комбинируем массив объектов и проверяем условния (из Action.condition) [[a,b,c],[d,e],[f,g]] => [[a,d,f],[a,d,g],[a,e,f], ...] => condition(a,d,f), condition(a,d,g), ...
                endVariants = this.combine(act, variants, actor, actName);
            }
        log("Check "+actName+" done.","--");
        return endVariants;
    }

    /**
     * Комбинирование объектов и проверка условий выполнения действия
     */

    this.combine = function(act, variants, actor, actName) {
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
            if (varstr != "") log("Combination: "+varstr);
            if (check) {
                log("can be "+actName);
                //Проверка условий действия над всей комбинацией
                if (!act.condition || act.condition(Conditions, actor, ...combine)) { 
                    log("Condition - ok");
                    endVariants.push(combine);
                } else {
                    log("Conditions NOT passed");
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
        var variants = [];
        for (var ai in act["for"]) {
            //По агрументам. Можно использовать для поиска объектов уже собранные для ai > 0.
            //Первый вариант - сам актор
            variants[ai] = [actor];
            for (var ci in act["for"][ai]) {
                //Сбор объектов
                var collectName = act["for"][ai][ci];
                log("Collect for "+collectName,"+");
                var newObjs = [];
                //Сборщик - сам движок - в перспективе поменять/добавить. Функция должна возвращать массив.
                if (this[collectName]) newObjs = this[collectName](actor, variants);
                else if (Collectors[collectName]) newObjs = Collectors[collectName](actor, variants);
                else log("Error: can't collect for "+collectName);

                for (var k in newObjs) {
                    //сохранение уникальных объектов для каждого аргумента
                    var newObj = newObjs[k];
                    log("collected:"+newObj.name);
                    if (variants[ai].indexOf(newObj) == -1) variants[ai].push(newObj);
                }

                log("Collected.","--");
            }
        }
    return variants;
    }
    /**
     * Сбор объектов из одного и того же места
     */
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
                    log("Found storage in "+obj.name);
                    ret = ret.concat(obj.storage);
                }
            }
        }
    return ret;
    }
}
module.exports = Engine;
