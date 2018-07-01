var TraderAI = function (){
    var T = TalkTopic;
    return {
        actions : [],
        triggers : {
            talk : [
                {
                condition : function(a,b,c) {return c == T.askItem && b.hands.item;},
                trigger : function(a,b,c) {return {actName: "drop", args: [b.hands.item]};}
                }
            ]
        }
    }
}();
