const express = require('express') ;
const mongoose =require('mongoose') ;
const bodyParser = require('body-parser') ;
const passport = require('passport') ;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express() ;

//Body parse middlware
app.use(bodyParser.urlencoded({extended: false})) ;
app.use(bodyParser.json()) ;

//DB config
const db = require('./configr/keys').mongoURI ;

mongoose
   .connect(db)
   .then(()=>console.log('mongoDB connected'))
   .catch(err =>console.log(err))


//passport middleware
app.use(passport.initialize()) ;

//passport config
require('./configr/passport')(passport) ;

//use routes
app.use('/api/users',users) ;
app.use('/api/profile',profile) ;
app.use('/api/posts',posts) ;

const port = process.env.PORT || 5000 ;

app.listen(port ,() => console.log(`server is running on ${port}`)) ;