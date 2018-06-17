var Collectors = {
    actorWeared : function(actor, objs) {return actor.wear;},
    talkTopic : function(actor, objs) {
        ret = [];
        for (var i = 0, c = objs.length; i < c; i++)
        for (var j = 0, c2 = objs[i].length; j < c2; j++) {
            var obj = objs[i][j];
            if (obj.talkTopic) {
                ret = ret.concat(obj.talkTopic);
                log("Collect "+obj.talkTopic.length+" topics");
            }
        }
        return ret;
    }
}
module.exports = Collectors;
