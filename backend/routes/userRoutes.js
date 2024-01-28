//routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const CashBack = require('../models/CashBack');
const Notification   = require('../models/Notification');
const jwt = require('jsonwebtoken'); // Ensure that the jwt module is properly imported
const userAuth = require('../middleware/userAuth');

const admin = require("firebase-admin");
const serviceAccount = require("../firebase/service");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Replace with your Firebase project config
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const jwtSecret = process.env.USER_JWT_SECRET

// Login
router.post('/phone-login', async (req, res) => {
    try {
      var newAccount = false
      const { token } = req.body;
      if(!token){
        res.status(400).json({ message: 'Token is required' });
      }
      const decodedToken = await admin.auth().verifyIdToken(token);

      const newUser = decodedToken;
      if (!newUser.phone_number) {
        return res.send({ status: "Enter your Mobile Number" });
      }
      let user = await User.findOne({firebasePhone: newUser.phone_number });
  
      // If the user doesn't exist, create a new user
      if (!user) {
        newAccount = true;
        user = new User({ firebasePhone:newUser.phone_number });
        await user.save();
      }
  
      // JWT token generation
      const jwtToken = jwt.sign({ id: user._id }, jwtSecret); // Replace 'your_jwt_secret' with your actual JWT secret key
  
      res.status(200).json({ message: 'Login successful', token:jwtToken,newAccount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
router.post('/google-login', async (req, res) => {
    try {
      var newAccount = false
      const { token } = req.body;
      if(!token){
        res.status(400).json({ message: 'Token is required' });
      }
      const decodedToken = await admin.auth().verifyIdToken(token);

      const newUser = decodedToken;
      if (!newUser.email) {
        return res.send({ status: "Enter your Email" });
      }
      let user = await User.findOne({firebaseEmail: newUser.email });
  
      // If the user doesn't exist, create a new user
      if (!user) {
        newAccount = true;
        user = new User({firebaseEmail: newUser.email });
        await user.save();
      }
  
      // JWT token generation
      const jwtToken = jwt.sign({ id: user._id }, jwtSecret); // Replace 'your_jwt_secret' with your actual JWT secret key
  
      res.status(200).json({ message: 'Login successful', token:jwtToken ,newAccount});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get("/protected",userAuth,async (req,res)=>{
    try {
      if(req.user){
        res.status(200).json({message:"User Authenticated"})
      }else{
        res.status(400).json({message:"User Not Authenticated"})
      }
    } catch (error) {
      res.status(500).json({message:"Internal Server Error"})
    }
  })
  router.get("/profile",userAuth,async (req,res)=>{
    try {
      const user = await User.findById(req.user.id);
      if(user){
        res.status(200).json({user})
      }else{
        res.status(400).json({message:"User Not Found"})
      }

    } catch (error) {
      res.status(500).json({message:"Internal Server Error"})
    }
  })
  router.post("/profile-edit",userAuth,async (req,res)=>{
    try {
      const user = await User.findById(req.user.id);
      if(user){
        user.name = req.body.name;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        await user.save();
        res.status(200).json({user})
      }else{
        res.status(400).json({message:"User Not Found"})
      }

    } catch (error) {
      res.status(500).json({message:"Internal Server Error"})
    }
  })
  router.get("/items",async (req,res)=>{
    try {
      const items = await Item.find({});
      if(items){
        res.status(200).json({items})
      }else{
        res.status(400).json({message:"Items Not Found"})
      }

    }catch(error){
      res.status(500).json({message:"Internal Server Error"}) 
    }
  })
  router.get("/items/search/:search", async (req, res) => {
    try {
      const { search } = req.params;
      const items = await Item.find({ name: { $regex: search, $options: 'i' } });
      
      if (items.length > 0) {
        res.status(200).json({ items });
      } else {
        res.status(404).json({ message: "Items Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  router.get("/item/:id",async (req,res)=>{
    try {
      const {id} = req.params;
      const item = await Item.findById(id);
      if(item){
        res.status(200).json(item)
      }else{
        res.status(400).json({message:"Items Not Found"})
      }

    }catch(error){
      res.status(500).json({message:"Internal Server Error"}) 
    }
  })

  router.get("/redeem-card",async (req,res)=>{
    try {
      const cashback = await CashBack.find({});
      if(cashback){
        res.status(200).json(cashback)
      }else{
        res.status(400).json({message:"Items Not Found"})
      }

    }catch(error){
      res.status(500).json({message:"Internal Server Error"}) 
    }
  })
  // add booked item
router.post('/add-booking',userAuth, async (req, res) => {
    try {
      const { itemId ,date,time} = req.body;
      const item = await Item.findById(itemId);
      const user = await User.findById(req.user.id);
        if(!item){
            return res.status(404).json({message:'Item not found'});
        }
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
      // generate code with alphabets and numbers
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      const codeLength = 6;
      for (let i = 0; i < codeLength; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
  
      // add to user booked
      user.booked.push({
        name: item.name,
        itemId: item._id,
        code: code,
        verified: false,
        cashback: item.cashback, // assuming item.cashback is available
        date:date,
        time:time,
        image:item.image,
        price:item.price,
      });
  
      // save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Booking added successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// add booked item
router.post('/add-redeem-code', userAuth, async (req, res) => {
    try {
      const { cashbackId } = req.body;
      const item = await CashBack.findById(cashbackId);
      const user = await User.findById(req.user.id);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.wallet === 0) {
        return res.status(404).json({ message: 'Wallet balance is zero' });
      }
  
      if (user.wallet < item.cashback) {
        return res.status(404).json({ message: 'Not enough balance' });
      }
  
      // Update the user's wallet after subtracting the cashback amount
      let updatedWallet = user.wallet - item.cashback;
  
      // generate code with alphabets and numbers
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      const codeLength = 7;
      for (let i = 0; i < codeLength; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
  
      // Add to the user's redeemed
      user.redeemed.push({
        name: item.name,
        cashbackId: item._id,
        code: code,
        verified: false,
        price:item.cashback,
      });
      user.wallet = updatedWallet;
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Redeem code added successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.delete("/cancel-booking/:id", userAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(req.user.id);
      if (user) {
        const bookingToCancel = user.booked.find(item => item._id.toString() === id.toString());
        if (bookingToCancel && !bookingToCancel.verified) {
          user.booked = user.booked.filter(item => item._id.toString() !== id.toString());
          await user.save();
          res.status(200).json({ user });
        } else {
          res.status(400).json({ message: "Booking not found or already verified" });
        }
      } else {
        res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
router.post("/notification",userAuth, async (req, res) => {
    try {
      const { token} = req.body;
      const notification = await Notification.findOne({ token:token  }); 
      if(!notification){
        const notification = await Notification.create({ token: token, userId: req.user.userId });
        res.status(200).json({ notification });
      }else{
        res.status(200).json({ notification });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
module.exports = router;