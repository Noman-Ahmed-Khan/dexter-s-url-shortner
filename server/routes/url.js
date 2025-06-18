const express=require('express')
const {post_new_url,get_short_url} = require('../controllers/url')

const router=express.Router();

router.route('/').post(post_new_url);
router.route('/:shortid').get(get_short_url);
module.exports=router;
