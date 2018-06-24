var Human = function(name) {
    //Имя - обязательно
    this.name = name;
    this.str = (Strings[name] ? Strings[name] : Strings["Вася"]);
    this.ai = [""]; //?
    //Что может делать
    this.can = ["take","drop","put","get","wear","takeoff","talk"];
    this.can_be = ["talk"];
    //Остальные нужные структуры с данными.
    this.talkTopic = [TalkTopic.weather, TalkTopic.askItem];
    this.hands = {
        name : "Hands",
        item : false
    };
    this.wear = [];
    this.give = function(i) {
        i.place = this.hands;
        this.hands.item = i;
    }
    this.getData = function() {
        var wearedStr = "";
        for (var i = 0, c = this.wear.length; i < c; i++) {
            wearedStr += this.wear[i].str.nom + (i < c-1 ? "," : ".");
        }
        if (wearedStr == "") wearedStr = "Ничего";

        return {
            name : {
                label : "Имя:",
                text : this.name
            },
            itemsInHands : {
                label : "Руки:",
                text : this.hands.item ? this.hands.item.str.nom : "Пусто"
            },
            weared : {
                label : "Надето:",
                text : wearedStr
            }
        };
    }
}

var TT = function(p) {
    this.name = p.name;
    if (!Strings[p.name]) console.log("ERROR: strings for "+p.name+" not found!");
    this.str = Strings[p.name];
    this.can_be = ["talk"];
    this.getName = p.label;
    this.getTalk = p.talk;
    this.condition = p.condition || function() {return true;};
}

var TalkTopic = {
    weather : new TT({
        name : "погода",
        label : function(a,b,c) {return "Говорить с "+b.str.acl+" "+c.str.voc;},
        talk : function(a,b,c) {say(a.str.nom+" говорит с "+b.str.acl+" "+c.str.voc);}
    }),
    askItem : new TT({
        name : "попросить",
        label : function(a,b,c) {return "Попросить у "+b.str.acl+" "+b.hands.item.str.nom},
        talk : function(a,b,c) {say(a.str.nom+" просит у "+b.str.gen+" "+b.hands.item.str.nom);},
        condition : function(a,b) {return b.hands.item;}
    })
}
module.exports = Human;
