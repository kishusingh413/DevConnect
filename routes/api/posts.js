const express =require('express') ;
const router = express.Router() ;
const mongoose = require('mongoose') ;
const passport = require('passport') ;
const Post = require('../../models/Post');

//validtaion
const validatePostInput = require('../../validation/post') ;
const Profile = require('../../models/Profile');

//@route Get api/posts/test
//@desc  tests posts route
//@access public

router.get('/test', (req,res) => res.json({msg: 'post works'})) ;

//@route Get api/posts/
//@desc  get all the posts
//@access public

router.get('/', (req, res) =>{
    Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .cache(err => res.status(400).json({nopostsfound: 'No post found'})) ;
});

//@route Get api/posts/:id
//@desc  get post by id
//@access public

router.get('/:id', (req, res) =>{
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .cache(err => res.status(400).json({nopostfound: 'No post found for the given ID'})) ;
});


//@route post api/posts/
//@desc  create a post
//@access public

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{

    //validate
    const {errors, isValid} = validatePostInput(req.body) ;

    if(!isValid){
        return res.status(400).json(errors) ;
    }

    const newpost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.body.id
    })

    newpost.save().then(post => res.json(post)) ;
});

//@route Delete api/posts/:id
//@desc  delete a post
//@access private

router.delete('/:id', passport.authenticate('jwt', {session: false}, (req, res) => {
      Profile.findOne({user: req.user.id})
       .then(Profile => {
          Post.findById(req.params.id)
          .then(post =>{
            if(post.user.toString !== req.user.id){
                return res.status(401).json({notauthorised: 'user not authorised'}) ;
            }

            post.remove().then(() => res.json({success: true})) ;
          })
          .catch(err => res.status(404).json({postnotfound: 'No post found'})) ;
       })
      
}));

//@route  post api/like/:id
//@desc  like a post
//@access private

router.post('/like/:id', passport.authenticate('jwt', {session: false}, (req, res) => {
    Profile.findOne({user: req.user.id})
     .then(Profile => {
        Post.findById(req.params.id)
        .then(post =>{
           if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
             return res.status(400).json({ alreadyliked: 'User has already liked the post'}) ;
           }

           post.likes.unshift({user: req.user.id}) ;

           post.save().then(post =>res.json(post)) ;
        })
        .catch(err => res.status(404).json({postnotfound: 'No post found'})) ;
     })
    
}));

//@route  post api/unlike/:id
//@desc  unlike a post
//@access private

router.post('/unlike/:id', passport.authenticate('jwt', {session: false}, (req, res) => {
    Profile.findOne({user: req.user.id})
     .then(Profile => {
        Post.findById(req.params.id)
        .then(post =>{
           if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
             return res.status(400).json({ notliked: 'User has not liked the post'}) ;
           }

           const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id) ;

           post.likes.splice(removeIndex, 1) ;

           post.save().then(post => res.json(post)) ;
        })
        .catch(err => res.status(404).json({postnotfound: 'No post found'})) ;
     })
    
}));

//@route post api/posts/comment/:id
//@desc  comment on a post
//@access public

router.post('/comment/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
     //validate
     const {errors, isValid} = validatePostInput(req.body) ;

     if(!isValid){
         return res.status(400).json(errors) ;
     }

    Post.findById(req.params.id)
     .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment) ;

        post.save().then(post => res.json(post)) ;
     })
     .catch(err => res.status(404).json({ postnotfound : 'No post found'})) ;
});

//@route Delete api/posts/comment/:id/:comment_id
//@desc  Delete a comment
//@access public

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false}), (req, res) =>{
   
   Post.findById(req.params.id)
    .then(post => {
       if(post.comments.filter(comment => 
        comment._id.toString() === req.params.comment_id).length() ===0){
            return res.status(404).json({commentnotexits : 'Comment does not exist'}) ;
       }

       //Get index of comment to be remove
       const removeIndex = post.comments
       .map(item => item._id.toString())
       .indexOf(req.params.comment_id) ;

       // splice comment out of array
       post.comments.splice(removeIndex, 1) ;

       post.save().then(post => res.json(post)) ;
    })
    .catch(err => res.status(404).json({ postnotfound : 'No post found'})) ;
});


module.exports = router ;