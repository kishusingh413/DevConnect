const express =require('express') ;
const router = express.Router() ;

//@route Get api/users/test
//@desc  tests users route
//@access public

router.get('/test', (req,res) => res.json({msg: 'User works'})) ;

module.exports = router ;