const express =require('express') ;
const router = express.Router() ;

//@route Get api/posts/test
//@desc  tests posts route
//@access public

router.get('/test', (req,res) => res.json({msg: 'post works'})) ;

module.exports = router ;