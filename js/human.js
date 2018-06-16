var Human = function() {
    //Имя - обязательно
    this.name = "Human";
    //Что может делать
    this.can = ["take","drop","put","get"]//,"wear","takeoff"];
    //Остальные нужные структуры с данными.
    this.hands = {
        name : "Руки",
        item : false
    };
}
module.exports = Human;
