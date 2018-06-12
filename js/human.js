var Human = function() {
    this.name = "Human";
    this.can = ["take","drop"]; //,"put","get","wear","takeoff"];
    this.hands = {
        name : "Руки",
        item : false
    };
}
module.exports = Human;
