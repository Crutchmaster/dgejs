var Action = {
    take : {
        actorReq : ["hands"],
        active : function(act, obj) {act.hands.item = obj;},
        passive : function(act, obj) {obj.place = act.hands;},
        for : ["samePlace","self"],
        condition : function(c,a,b) {return c.notSelf(a,b) && c.handsFree(a);}
    },
    drop : {
        actorReq : ["hands"],
        for : ["actorHands"],
        active : function(act, obj) {obj.place = act.place; act.hands.item = false;},
        condition : function(c,a,b) {return c.taken(a,b);} 
    },
    put : {
        actorReq : ["hands"],
        for : ["samePlace"],
        condition : function(c,a,b) {return c.notSelf(a,b) && c.itemInHands(a,b) && c.hasStorage(a,b);},
        active : function(act, obj) {obj.storage.push(act.hands.item); act.hands.item.place = obj; act.hands.item = false;}
    },
    get : {
        actorReq : ["hands"],
        for : ["samePlace"],
        provide : "take"

    }
    


}
module.exports = Action;
