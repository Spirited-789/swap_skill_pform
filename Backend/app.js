const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const {User} = require('./models/UserModel');
const {SwapRequest} = require('./models/SwapRequestModel');
const {Feedback} = require('./models/FeedbackModel');
const {Message} = require('./models/MessageModel');
const {Report} = require('./models/ReportModel');

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const swapRoutes = require('./routes/swapRoutes');
app.use('/api/swap', swapRoutes);

const userRoutes = require('./routes/userRoute');
app.use('/api/user', userRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);


// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend origin
  credentials: true // Allow cookies/cross-origin credentials
}));
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports={app,User,SwapRequest,Feedback,Message,Report};

