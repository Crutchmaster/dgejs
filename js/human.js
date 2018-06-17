var Human = function() {
    //Имя - обязательно
    this.name = "Human";
    //Что может делать
    this.can = ["take","drop","put","get","wear","takeoff","talk"];
    this.can_be = ["talk"];
    //Остальные нужные структуры с данными.
    this.talkTopic = [TalkTopic.weather];
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

var TalkTopic = {
    weather : {
        name : "weather",
        can_be : ["talk"],
        }
}
module.exports = Human;
