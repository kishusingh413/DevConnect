const express = require('express') ;
const router = express.Router() ;
const gravatar = require('gravatar') ;
const bcrypt = require('bcryptjs') ;
const jwt = require('jsonwebtoken') ;

const keys = require('../../configr/keys') ;
const passport= require('passport') ;

//load validation input
const validateRegisterInput = require('../../validation/register') ;
const validateLoginInput = require('../../validation/login') ;

// load user model
const User = require('../../models/User') ;

//@route Get api/users/test
//@desc  tests users route
//@access public

router.get('/test', (req,res) => res.json({msg: 'User works'})) ;

//@route Get api/users/register
//@desc  register a user
//@access public

router.post('/register',(req,res) => {
   const {errors, isValid} = validateRegisterInput(req.body) ;
// check validation
   if(!isValid){
      return res.status(404).json(errors) ;
   }

   User.findOne({email: req.body.email})
   .then(user => {
    if(user){
        errors.email ='Email already exists' ;
        return res.status(400).json(errors) ;
    }else{
        const avatar =gravatar.url(req.body.email, {
            s: '200', //size
            r: 'pg', // rating
            d: 'mm' //default
        });
        const newUser =new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
        });

        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(newUser.password, salt, (err,hash) => {
                if(err) throw err ;
                newUser.password = hash ;
                newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err)) ;
            })
        })
    }
   });
});

//@route Get api/users/login
//@desc  login a user
//@access public

router.post('/login' , (req,res) => {
    const {errors, isValid} = validateLoginInput(req.body) ;
    // check validation
       if(!isValid){
          return res.status(404).json(errors) ;
       }

     const email = req.body.email ;
     const password = req.body.password ;

     User.findOne({email})
     .then(user => {
        //check for user
        if(!user){
            errors.email = 'User not found' ;
            return res.status(404).json(errors) ;
        }

        //Check Password
        bcrypt.compare(password, user.password)
          .then(isMatch =>{
            if(isMatch){
               //user matched
               const payload = {id: user.id, name: user.name, avatar: user.avatar} //Create token

               //sign token
               jwt.sign(payload,
                 keys.secretOrKey,
                 {expiresIn: 3600}, 
                 (err, token) => {
                   res.json({
                    success: true,
                    token: 'Bearer' + token
                   })
               }) ;
            }else{
                errors.password = 'password incorrect' ;
                return res.status(404).json(errors) ;
            }
          })
     });
});

//@route Get api/users/current
//@desc  return current user
//@access private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user) ;
})

module.exports = router ;