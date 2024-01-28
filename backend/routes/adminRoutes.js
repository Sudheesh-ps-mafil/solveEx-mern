// routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const adminAuth = require('../middleware/adminAuth');
const Item = require('../models/Item');
const CashBack = require('../models/CashBack');
const User = require('../models/User');
const Notification = require('../models/Notification');
const NotificationList = require('../models/NotificationList');
const jwtSecret = process.env.ADMIN_JWT_SECRET
const multer = require("multer");

// Register
router.post('/register', async (req, res) => {
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
});

// Login
router.post('/login', async (req, res) => {
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
});
//protected route
router.get("/protected",adminAuth,async (req,res)=>{
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
// Get all users
router.get('/get-all-users',adminAuth, async (req, res) => {
  try {
    // Get all users from the database
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add new item
router.post('/items',adminAuth, async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update item
router.put('/items/:id',adminAuth, async (req, res) => {
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
});

// Remove item
router.delete('/items/:id', adminAuth,async (req, res) => {
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
});
// Get all items
router.get('/items',adminAuth, async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



//Cashback 
// Create a new cashback item
router.post('/cashback',adminAuth, async (req, res) => {
  try {
    const newCashBack = new CashBack(req.body);
    const savedCashBack = await newCashBack.save();
    res.status(201).json(savedCashBack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all cashback items
router.get('/cashback', adminAuth,async (req, res) => {
  try {
    const cashback = await CashBack.find();
    res.status(200).json(cashback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a specific cashback item
router.get('/cashback/:id',adminAuth, async (req, res) => {
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
});

// Update cashback item
router.put('/cashback/:id',adminAuth, async (req, res) => {
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
});

// Delete cashback item
router.delete('/cashback/:id',adminAuth, async (req, res) => {
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
});

//verify cashback code
router.get('/get-item-code-info/:code', adminAuth, async (req, res) => {
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
});

router.post('/verify-item-code', adminAuth, async (req, res) => {
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
});

router.get("/redeem-code-info/:code", adminAuth, async (req, res) => {
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
});

router.post("/verify-redeem-code",adminAuth,async(req,res)=>{
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
})
const OneStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, "./public/OneImage");
  },
  filename: function (req, file, cb) {
    // It is the filename that is given to the saved file.
    const uniqueSuffix =Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    console.log(`${uniqueSuffix}-${file.originalname}`);
    // console.log(file);
  },
});

// Configure storage engine instead of dest object.
const OneImage = multer({
  storage: OneStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB in bytes
  },
});
router.post("/send-notification",OneImage.single('image'),adminAuth,async(req,res)=>{
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

    const result = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await result.json();

    // Check for errors in the HTTP response
    if (!result.ok) {
        throw new Error(`FCM request failed with status ${result.status}: ${data}`);
    }

    const date = new Date().toString().trim("T");

    // Use Promise.all to await both the fetch and the creation of NotificationList concurrently
    await Promise.all([
        NotificationList.create({ title: title, image: imageObj ? `${process.env.DOMAIN}/OneImage/${imageObj.filename}` : null, url: url, date: date }),
        res.status(200).json({ message: 'Notification sent successfully', data }),
    ]);
} catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
})
module.exports = router;
