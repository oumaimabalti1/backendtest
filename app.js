var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const cors = require('cors'); 


var indexRouter = require('./routes/index');
const authRouter = require('./routes/auth.routes');  
const usersRouter = require('./routes/users.routes');
const { connectToMongoDB } = require('./config/db');
const entrepriseRoutes = require("./routes/entreprise.routes");
const offresRouter = require('./routes/offre.routes');
const candidaturesRouter = require('./routes/candidature.routes');
const cvsRouter = require('./routes/cv.routes');
const congesRouter = require('./routes/conge.routes')
const plaintesRouter = require('./routes/plainte.routes');
const adminRouter = require('./routes/admin.routes'); 
const rhRouter = require('./routes/rh.routes'); 
const employeeRouter=require('./routes/employee.routes');
const candidatRouter=require('./routes/candidat.routes');

require('dotenv').config();

var app = express();

app.use(logger('dev'));

app.use(cors({
    origin: function (origin, callback) {
        // Accepter tous les localhost (3000, 3001, 3002, etc.)
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use('/auth', authRouter); 
app.use("/users", usersRouter);
app.use('/admin', adminRouter);
app.use('/rh', rhRouter); 
app.use('/employee', employeeRouter); 
app.use('/candidat', candidatRouter); 
app.use("/entreprises", entrepriseRoutes);
app.use("/offres",offresRouter);
app.use("/candidatures", candidaturesRouter);
app.use('/cvs', cvsRouter);
app.use('/conges', congesRouter);
app.use('/plaintes', plaintesRouter); 



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error('UPLOAD/API ERROR:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
});


const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
   console.log(` CORS enabled for all localhost ports`); 
});

