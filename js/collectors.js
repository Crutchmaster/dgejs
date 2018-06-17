var Collectors = {
    actorWeared : function(actor, objs) {return actor.wear;},
    talkTopic : function(actor, objs) {
        return Helper.for2(objs, function(obj) {
            if (obj.talkTopic) {
                log("Collect "+obj.talkTopic.length+" topics");
                return obj.talkTopic;
            }
            return false;
        });
    }
}
var Helper = {
    for2 : function(objs, addFunc) {
        ret = [];
        for (var i = 0, c = objs.length; i < c; i++)
        for (var j = 0, c2 = objs[i].length; j < c2; j++) {
            var obj = objs[i][j];
            var newobj = addFunc(obj);
            if (newobj) {ret = ret.concat(newobj)};
        }
        return ret;
    }
}
module.exports = Collectors;
