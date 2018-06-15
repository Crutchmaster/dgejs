var Action = {
    take : {
        do : function(act, obj) {act.hands.item = obj; obj.place = act.hands;},
        for : [["samePlace","self"]],
        condition : function(c,a,b) {return c.notSelf(a,b) && c.handsFree(a);}
    },
    drop : {
        for : [["actorHands"]],
        do : function(act, obj) {obj.place = act.place; act.hands.item = false;},
        condition : function(c,a,b) {return c.itemInHands(a,b) && c.taken(a,b);}
    },
    put : {
        for : [["samePlace"]],
        condition : function(c,a,b) {return c.notSelf(a,b) && c.itemInHands(a,b) && c.hasStorage(a,b);},
        do : function(act, obj) {obj.storage.push(act.hands.item); act.hands.item.place = obj; act.hands.item = false;}
    },
    get : {
        for : [["samePlace","actorHands"],["stored"]],
        condition : function(q,a,b,c) {return q.handsFree(a) && q.hasStorage(a,b);},
        do : function(act, obj, s) {
            act.hands.item = s;
            s.place = act.hands;
            obj.storage.splice(obj.storage.indexOf(s),1);
        }
    }
}
module.exports = Action;
