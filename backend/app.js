require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
var path = require('path');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
    // Your code logic after successfully connecting to the database
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Path: app.js
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//public folder
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname,'..','frontend', 'dist')));

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,'..','frontend', "dist", "index.html"));
  });

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Listening on port ${port}`);
})