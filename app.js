require('dotenv').config();
const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const path          = require('path');

require('./config/database'); // open DB + create tables

const authRoutes  = require('./routes/authRoutes');
const postRoutes  = require('./routes/postRoutes');
const errorHandler= require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin:      'http://localhost:5000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname,'public/uploads')));

app.use('/auth',  authRoutes);
app.use('/posts', postRoutes);

app.use(errorHandler);

app.listen(PORT, ()=> console.log(`API on http://localhost:${PORT}`));