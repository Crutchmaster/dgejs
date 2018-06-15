var Conditions = {
    samePlace : function(a,b) {return a.place == b.place;},
    notSelf : function(a,b) {return a!=b;},
    notTaken : function(a,b) {return a.hands.item != b;},
    taken : function(a,b) {return a.hands.item == b;},
    itemInHands : function(a,b) {return a.hands && a.hands.item;},
    handsFree : function(a,b) {return a.hands && !a.hands.item;},
    hasStorage : function(a,b) {return b.storage && b.storage.push;}
}
module.exports = Conditions;

