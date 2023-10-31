const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  wallet: {
    type: Number,
    default: 0,
  },
  booked: [
    {
      name: String,
      itemId: String,
      code: String,
      verified: Boolean,
      cashback:String,
      date:String,
      time:String,
      image:String,
      price:Number,
    },
  ],
  redeemed: [
    {
      name: String,
      cashbackId: String,
      code: String,
      verified: Boolean,   
      price:Number,
    },
  ],
  firebasePhone:String,
  firebaseEmail:String,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
