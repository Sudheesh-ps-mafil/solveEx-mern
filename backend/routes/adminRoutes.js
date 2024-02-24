// routes.js
const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");
const multer = require("multer");

const ItemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, "./public/ItemImage");
  },
  filename: function (req, file, cb) {
    // It is the filename that is given to the saved file.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    console.log(`${uniqueSuffix}-${file.originalname}`);
    // console.log(file);
  },
});

// Configure storage engine instead of dest object.
const ItemImage = multer({
  storage: ItemStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB in bytes
  },
});
const cashbackStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, "./public/cashbackImage");
  },
  filename: function (req, file, cb) {
    // It is the filename that is given to the saved file.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    console.log(`${uniqueSuffix}-${file.originalname}`);
    // console.log(file);
  },
});

// Configure storage engine instead of dest object.
const cashbackImage = multer({
  storage: cashbackStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB in bytes
  },
});
const OneStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, "./public/OneImage");
  },
  filename: function (req, file, cb) {
    // It is the filename that is given to the saved file.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
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

// Register
router.post("/register", adminController.Register);

// Login
router.post("/login", adminController.Login);
//protected route
router.get("/protected", adminAuth, adminController.Protected);
// Get all users
router.get("/get-all-users", adminAuth, adminController.GetAllUsers);
router.delete("/delete-user/:userId", adminAuth, adminController.DeleteUser);
//items
router.get('/get-all-bookings',adminAuth,adminController.GetAllBookings)
router.get('/get-all-items',adminAuth,adminController.GetItemsWithPagination)
router.get('/get-all-cashback',adminAuth,adminController.GetCashBackWithPagination)
// Add new item
router.post(
  "/items",
  ItemImage.single("image"),
  adminAuth,
  adminController.AddItem
);

// Update item
router.put("/items/:id", adminAuth, adminController.UpdateItem);

// Remove item
router.delete("/delete-item/:id", adminAuth, adminController.DeleteItem);
// Get all items
router.get("/items", adminAuth, adminController.GetItems);

//Cashback
// Create a new cashback item
router.post("/cashback", cashbackImage.single("image"),adminAuth, adminController.AddCashBack);

// Get all cashback items
router.get("/cashback", adminAuth, adminController.GetCashBack);

// Get a specific cashback item
router.get("/cashback/:id", adminAuth, adminController.GetSingleCashBack);

// Update cashback item
router.put("/cashback/:id", adminAuth, adminController.UpdateCashBack);

// Delete cashback item
router.delete("/cashback/:id", adminAuth, adminController.DeleteCashBack);

//verify cashback code
router.get(
  "/get-item-code-info/:code",
  adminAuth,
  adminController.GetCodeItemInfo
);

router.post("/verify-item-code", adminAuth, adminController.VerifyItemCode);

router.get("/redeem-code-info/:code", adminAuth, adminController.GetRedeemCode);

router.post("/verify-redeem-code", adminAuth, adminController.VerifyRedeemCode);

router.post(
  "/send-notification",
  OneImage.single("image"),
  adminAuth,
  adminController.SendNotification
);

module.exports = router;
