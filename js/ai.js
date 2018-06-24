/*
var AI = function() {
    this.actions = [];
    this.think = function(actor) {
    }
    this.checkActions = function(a) {
        var actor = a.actor;
        var acts = a.actions;
        for (var i = this.actions.length; i ; i--) {
            var act = this.actions[i];
            var actName = act.actName;
            var agrs = act.args;
            if (acts[actName]) {
                if (this.compare(agrs, acts[actName])) {
                    return { "actName" : actName,
                             "actor" : actor,
                             "args" : args };
                }
            }
        }
        return false;
    }
    this.compare = function(a, b) {
        var i = a.length;
        if (i != b.length) return false;
        while (i--) if (a[i] != b[i]) return false;
        return true;
    }

}
*/

var AI = (function (){
    var T = TalkTopic;
    return {
        askDrop : {
            triggers : {
                talk : [
                    {
                    condition : function(a,b,c) {return c == T.askItem && b.hands.item;},
                    trigger : function(a,b,c) {return ["drop",b.hands.item];}
                    }
                ]
            }
        }
    }
}();
