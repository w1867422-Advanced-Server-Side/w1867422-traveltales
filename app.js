require('dotenv').config();
const express         = require('express');
const helmet          = require('helmet');
const cors            = require('cors');
const cookieParser    = require('cookie-parser');
require('./config/db'); // init DB & tables

const authRoutes      = require('./routes/authRoutes');
const authMiddleware  = require('./middleware/authMiddleware');
const { csrfProtection, csrfErrorHandler } = require('./middleware/csrf');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
    cors({
        origin: 'http://localhost:5000',
        credentials: true
    })
);

// Body + cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CSRF protection *after* cookieParser, before your routes
app.use(csrfProtection);

// Expose the CSRF token via JSON so your frontend can grab it
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Your existing routes
app.use('/auth', authRoutes);
app.get('/secure', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.userId}` });
});

// CSRF error handler must come *after* your routes
app.use(csrfErrorHandler);

app.listen(PORT, () =>
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
);