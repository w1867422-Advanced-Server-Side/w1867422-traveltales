require('dotenv').config();
const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const path          = require('path');
const swaggerUi      = require('swagger-ui-express');
const YAML           = require('yamljs');

require('./config/database'); // open DB + create tables

const openapiDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

const authRoutes  = require('./routes/authRoutes');
const postRoutes  = require('./routes/postRoutes');
const followRoutes = require('./routes/followRoutes');
const voteRoutes   = require('./routes/voteRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler= require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors({
    origin:      'http://localhost:5000',
    credentials: true
}));

app.get('/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openapiDocument);
});

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument, {
        explorer: true,            // show search box
        swaggerOptions: {
            docExpansion: 'none'
        }
    })
);

app.use('/uploads', express.static(path.join(__dirname,'public/uploads')));

app.use('/auth',  authRoutes);
app.use('/posts', postRoutes);
app.use('/follows', followRoutes);
app.use('/posts', voteRoutes);
app.use('/posts', commentRoutes);

app.use(errorHandler);

app.listen(PORT, ()=> console.log(`API on http://localhost:${PORT}`));