var Conditions = {
    samePlace : function(a,b) {return a.place == b.place;},
    notSelf : function(a,b) {return a!=b;},
    notTaken : function(a,b) {return a.hands.item != b;},
    taken : function(a,b) {return a.hands.item == b;}
}
module.exports = Conditions;

