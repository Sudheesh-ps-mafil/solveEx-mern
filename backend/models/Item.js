const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: String,
    cashback: Number,
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;