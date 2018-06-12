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
module.exports = Action;
