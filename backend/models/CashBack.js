const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CashBackSchema = new Schema({
    name: String,
    image: String,
    cashback: Number,
});

const CashBack = mongoose.model("CashBack", CashBackSchema);
module.exports = CashBack;
