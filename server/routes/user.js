// You can add routes implementations here
const express = require('express')
const { authorize } = require('../middlewares/auth');
const {protect} = require('../middlewares/auth');
const { get_all_users,
        get_user_by_id,
        patch_user_by_id,
        delete_user_by_id,
        promote_user_by_id,
        demote_user_by_id,
        register,
        login,
        logout } = require('../controllers/user');

const router=express.Router();

router.route('/')
    .get(get_all_users)
    
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)

router.route('/protected').get(protect, (req,res)=>{
    res.json({message: "authentic", user: req.user})
})

router.route('/me').get(protect,(req, res)=>{
    if(!req.user) return res.status(401).json({status: "error", message: "Unauthorized"});
    try{
        res.json({status: "success", user: req.user})
    } catch(err){
        res.status(500).json({status: "error", message: "Internal Error"});
    }
});
router.route("/:id")
    .get(get_user_by_id)
    .patch(patch_user_by_id)
    .delete(delete_user_by_id);

router.patch("/:id/promote", authorize(['admin']), promote_user_by_id);
router.patch("/:id/demote", authorize(['admin']), demote_user_by_id);

// router.get('/users', async (req, res) => {
//     const allusers = await userModel.find({});
//     const html= `
//     <ul>
//         ${allusers.map((allusers)=>`<li>${allusers.first_name} ${allusers.last_name} - ${allusers.email}</li>`).join('')}
//     </ul>
//     `
//     return res.send(html);
// });


module.exports=router;