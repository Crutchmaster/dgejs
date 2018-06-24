var Action = {
    take : {
        //Функция для действия
        do : function(act, obj) {act.hands.item = obj; obj.place = act.hands;},
        //Откуда делать сбор объектов
        for : [["samePlace"]],
        //Условие для выполнения действия. c - ссылка на Condions, a - actor, b и последующие - объекты из for
        condition : function(c,a,b) {return c.notSelf(a,b) && c.handsFree(a);},
        //Функция возвращает название по аргументам. В перспективе можно добавить лицо, число, слконение в объект/интернационализацию.
        name : function(a,b) {return "Взять "+b.str.acc;}
    },
    drop : {
        for : [["actorHands"]],
        do : function(act, obj) {obj.place = act.place; act.hands.item = false;},
        condition : function(c,a,b) {return c.itemInHands(a,b) && c.taken(a,b);},
        name : function(a,b) {return "Бросить "+b.str.acc;}
    },
    put : {
        for : [["samePlace"]],
        condition : function(c,a,b) {return c.notSelf(a,b) && c.itemInHands(a,b) && c.hasStorage(a,b);},
        do : function(act, obj) {obj.storage.push(act.hands.item); act.hands.item.place = obj; act.hands.item = false;},
        name : function(a,b) {return "Положить "+a.hands.item.str.nom+" в "+b.str.nom;}
    },
    get : {
        for : [["samePlace","actorHands"],["stored"]],
        //Если в массиве for больше одного массива, объекты оттуда берутся из следующего агрумента (здесь - c)
        condition : function(q,a,b,c) {return q.handsFree(a) && q.hasStorage(a,b);},
        //Аналогично для do. При действиях с нескольними объектами они просто дописываются в конец.
        do : function(act, obj, s) {
            act.hands.item = s;
            s.place = act.hands;
            obj.storage.splice(obj.storage.indexOf(s),1);
        },
        name : function(a,b,c) {return "Достать "+c.str.nom+" из "+b.str.gen;}
    },
    wear : {
        for : [["actorHands"]],
        condition : function(c,a,b) {return a.wear;},
        do : function(a, b) {a.wear.push(b); a.hands.item = false; b.place = a;},
        name : function(a,b) {return "Надеть "+b.str.nom;}
    },
    takeoff : {
        for : [["actorWeared"]],
        condition : function(c,a,b) {return c.handsFree(a,b);},
        do : function(a, b) {
            Action.take.do(a,b);
            a.wear.splice(a.wear.indexOf(b), 1);
        },
        name : function(a,b) {return "Снять "+b.str.acc;}
    },
    talk : {
        for : [["samePlace"],["talkTopic"]],
        condition : function(q,a,b,c) {return a != b && a != c && c.condition(a,b);},
        do : function(a,b,c) {return c.getTalk(a,b,c);},
        name : function(a,b,c) {console.log(a,b,c);
            return c.getName(a,b,c);}
    }
}
module.exports = Action;
