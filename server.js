require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const httpStatusText = require('./utils/httpStatusText');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());    
app.use(morgan("dev"));

const url = process.env.MONGO_URL;    


// ==> JSON MIDDLEWARE
app.use(express.json()); 

// ==> DATABASE CONNECTION
mongoose.connect(url).then(()=>{    
    console.log("Connected to Auth-API database !")
});

// ==> ROUTING
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ==> ROUTE ERR HANDLER
app.all(/.*/, (req, res) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        message: "route is not available",
        code: 404
    });
});

// ==> GLOBAL ERR HANDLER
app.use((error, req, res, next) => {    
    res.status(error.statusCode || 500).json({status: error.statusText || "error",
        message: error.message || "unknown error",
        code: error.statusCode || 500
    });
})

// ==> LISTENING TO PORT
app.listen(process.env.PORT || 5000 , ()=>{    
    console.log(`Listening to port ${process.env.PORT} !`);
});