var Bag = function() {
    this.name = "Bag";
    this.str = {
        nom : "мешок",
        gen : "мешка",
        acc : "мешок"
    }
    this.can_be = ["take","drop","put","get","wear","takeoff"];
    this.storage = [];
}
