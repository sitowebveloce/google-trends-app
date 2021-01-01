// Require 
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
// App
const app = express();

// Middlewares
app.use(morgan('combined'));
// View engine ejs
app.set('view engine', 'ejs');
// Public static folder
app.use(express.static(path.join(__dirname, 'public')));
// Body Parser
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(helmet());
// External routes
const index = require('./routes/index');
app.get('/', (req, res)=>{
    res.redirect('/trends/overtime')
});
app.use('/trends', index);

// Listener
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server beating 💓 on PORT ${PORT}`);
});