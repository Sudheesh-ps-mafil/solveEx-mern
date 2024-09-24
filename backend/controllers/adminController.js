const axios = require('axios');
const Item = require('../models/Item');
const CashBack = require('../models/CashBack');
const User = require('../models/User');
const Notification = require('../models/Notification');
const NotificationList = require('../models/NotificationList');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');   

const jwtSecret = process.env.ADMIN_JWT_SECRET
const Register = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new Admin
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
      });
  
      // Save the new Admin
      await newAdmin.save();
  
      return res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create and assign a token
      const token = jwt.sign({ id: existingAdmin._id }, jwtSecret);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
const Protected = async (req,res)=>{
    try{
        return res.status(200).json({message:"Protected Route"})
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const GetAllUsers = async (req, res) => {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1; // Current page (default: 1)
      const limit = parseInt(req.query.limit) || 10; // Number of users per page (default: 10)
  
      // Calculate the skip value based on the page and limit
      const skip = (page - 1) * limit;
  
      // Fetch users from the database with pagination and sorting
      const users = await User.find({})
        .sort({ _id: -1 }) // Sort by _id in descending order (newest first)
        .skip(skip)
        .limit(limit)
        .exec();
  
      // Count total number of users
      const totalUsers = await User.countDocuments({});
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalUsers / limit);
  
      return res.status(200).json({ users, totalPages, currentPage: page });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const DeleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Check if the user with the given ID exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user
      await User.findByIdAndDelete(userId);
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const GetAllBookings = async (req, res) => {
    const page = req.query.page; // Get 'page' from the query parameters
    const limit = req.query.limit; // Get 'limit' from the query parameters

    const skipIndex = (page - 1) * limit; // Calculate the index to start from

    try {
        const bookings = await User.find({ "booked": { $exists: true } }) // Find users where 'booked.verified' is false
            .sort({ "booked.date": -1 }) // Sort by 'booked.date' in descending order
            .skip(skipIndex) // Skip documents
            .limit(limit); // Limit the number of documents
      // Count total number of users
      const totalUsers = await User.countDocuments({ "booked": { $exists: true } });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json({ bookings, totalPages, currentPage: page });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

  const AddItem =  async (req, res) => {
    try {
      const newItem = new Item(req.body);
      if (req.file) {
        newItem.image = req.file.filename;
      }
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const UpdateItem = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const DeleteItem = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedItem = await Item.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const GetItems = async (req, res) => {
    try {
      const items = await Item.find({});
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const GetItemsWithPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    try {
      const items = await Item.find().skip(startIndex).limit(limit);
      res.status(200).json({
        items,
        currentPage: page,
        totalPages: Math.ceil((await Item.countDocuments()) / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const AddCashBack = async (req, res) => {
    try {
      const {name,cashback} = req.body;
      const imgObj = req.file
      const newCashBack = new CashBack({
          name,
          cashback,
          image:`${process.env.DOMAIN}/cashbackImage/${imgObj.filename}`
      });
      const savedCashBack = await newCashBack.save();
      res.status(201).json(savedCashBack);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const GetCashBack = async (req, res) => {
    try {
      const cashback = await CashBack.find();
      res.status(200).json(cashback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
const  GetCashBackWithPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    try {
      const cashback = await CashBack.find().skip(startIndex).limit(limit);
      res.status(200).json({
        cashback,
        currentPage: page,
        totalPages: Math.ceil((await CashBack.countDocuments()) / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const GetSingleCashBack = async (req, res) => {
    try {
      const { id } = req.params;
      const cashback = await CashBack.findById(id);
      if (!cashback) {
        return res.status(404).json({ message: 'CashBack not found' });
      }
      res.status(200).json(cashback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  const UpdateCashBack =  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCashBack = await CashBack.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCashBack) {
        return res.status(404).json({ message: 'CashBack not found' });
      }
      res.status(200).json(updatedCashBack);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const DeleteCashBack = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCashBack = await CashBack.findByIdAndDelete(id);
      if (!deletedCashBack) {
        return res.status(404).json({ message: 'CashBack not found' });
      }
      res.status(200).json({ message: 'CashBack deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const GetCodeItemInfo = async (req, res) => {
    try {
      const { code } = req.params;
  
      const usersWithCode = await User.find({ 'booked.code': code }); // Find users with the given code in their booked items
  
      if (usersWithCode.length === 0) {
        return res.status(404).json({ message: 'Code not found' });
      }
  
      // Extract relevant information from the users with the given code
      const usersData = usersWithCode.map(user => {
        const filteredBooked = user.booked.filter(item => item.code === code);
        return {
          userId: user._id,
          booked: filteredBooked,
        };
      });
  
      res.status(200).json(usersData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const VerifyItemCode = async (req, res) => {
    try {
      const { userId, code } = req.body;
  
      // Find the user with the given userId
      const user = await User.findById(userId).lean();
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the booked item with the given code
      const bookedItem = user.booked.find(item => item.code === code);
  
      if (!bookedItem) {
        return res.status(400).json({ message: 'No Booked Item found with the provided code' });
      }
  
      // Check if the code is already verified
      if (bookedItem.verified) {
        return res.status(400).json({ message: 'Code already verified' });
      }
  
      // Update the booked item to be verified
      const updatedBooked = user.booked.map(item => {
        if (item.code === code) {
          return { ...item, verified: true };
        }
        return item;
      });
  
      // Find the item associated with the booked item
      const item = await Item.findById(bookedItem.itemId).lean();
  
      let updatedWallet = user.wallet || 0; // Ensure that the initial value is 0 if user.wallet is undefined or null
      if (!isNaN(item.cashback)) {
        updatedWallet += Number(item.cashback);
      } else {
        console.error('Invalid cashback value');
        // Handle the error as per your application's logic
      }
      // Update the user
      await User.findByIdAndUpdate(userId, { booked: updatedBooked, wallet: updatedWallet });
  
      res.status(200).json({ updatedBooked, updatedWallet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const GetRedeemCode =  async (req, res) => {
    try {
      const { code } = req.params;
  
      const usersWithCode = await User.find({ 'redeemed.code': code }); // Find users with the given code in their redeemed items
  
      if (usersWithCode.length === 0) {
        return res.status(404).json({ message: 'Code not found' });
      }
  
      // Extract relevant information from the users with the given code
      const usersData = await Promise.all(usersWithCode.map(async (user) => {
        const filteredRedeemed = user.redeemed.filter(item => item.code === code);
        const cashbackPromises = filteredRedeemed.map(async (item) => {
          const cashback = await CashBack.findById(item.cashbackId);
          return {
            name: cashback.name,
            cashback: cashback.cashback,
          };
        });
        const cashbacks = await Promise.all(cashbackPromises);
        return {
          userId: user._id,
          redeemed: filteredRedeemed,
          cashbacks: cashbacks,
        };
      }));
  
      res.status(200).json(usersData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const VerifyRedeemCode =async(req,res)=>{
    try {
      const {userId,redeemId} = req.body;
      const user = await User.findById(userId);
      if(!user){
        return res.status(404).json({message:"User not found"});
      }
      const redeemedItem = user.redeemed.find(item=>item._id.toString()===redeemId);
      if(!redeemedItem){
        return res.status(404).json({message:"Redeemed item not found"});
      }
      if(redeemedItem.verified){
        return res.status(400).json({message:"Code already verified"});
      }
      const updatedRedeemed = user.redeemed.map(item=>{
        if(item._id.toString()===redeemId){
          return {...item,verified:true};
        }
        return item;
      });
      user.redeemed = updatedRedeemed;
      await user.save();
      res.status(200).json({message:"Redeemed item verified successfully"});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  const SendNotification =  async (req, res) => {
    try {
      const { title, url } = req.body;
      const imageObj = req.file;
  
      // Retrieve all tokens from the Notification model
      const allTokens = await Notification.find().distinct('token');
      if (!allTokens) {
        throw new Error('No tokens found');
      }
  
      // Build the payload
      const payload = {
        registration_ids: allTokens,
        notification: {
          body: title,
          title: "RTouch",
          android_channel_id: "rtouch"
        },
        data: {
          url: url,
        },
      };
  
      // Add image property to data if imageObj exists
      if (imageObj) {
        payload.notification.image = `${process.env.DOMAIN}/OneImage/${imageObj.filename}`;
      }
  
      console.log(JSON.stringify(payload));
  
      const result = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
        },
      });
  
      const data = result.data;
  
      // Check for errors in the HTTP response
      if (result.status !== 200) {
        throw new Error(`FCM request failed with status ${result.status}: ${JSON.stringify(data)}`);
      }
  
      const date = new Date().toString().trim("T");
  
      // Use Promise.all to await both the axios request and the creation of NotificationList concurrently
      await Promise.all([
        NotificationList.create({ title: title, image: imageObj ? `${process.env.DOMAIN}/OneImage/${imageObj.filename}` : null, url: url, date: date }),
        res.status(200).json({ message: 'Notification sent successfully', data }),
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = { 
    Register,   
    Login,
    Protected,
    DeleteUser,
    GetAllUsers,
    GetAllBookings,
    AddItem,
    UpdateItem,
    DeleteItem,
    GetItems,
    GetItemsWithPagination,
    GetCashBackWithPagination,
    GetCashBack,
    AddCashBack,
    GetSingleCashBack,
    UpdateCashBack,
    DeleteCashBack,
    GetCodeItemInfo,
    VerifyItemCode,
    GetRedeemCode,
    VerifyRedeemCode,
    SendNotification
  }