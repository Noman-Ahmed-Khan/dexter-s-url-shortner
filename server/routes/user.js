// You can add routes implementations here
const express = require('express')
const protect = require('../middlewares/auth');
const { get_all_users,
        get_user_by_id,
        patch_user_by_id,
        delete_user_by_id,
        register,
        login,
        logout } = require('../controllers/user');

const router=express.Router();

router.route('/')
    .get(get_all_users)
    
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)

router.route('/protected').post(protect, (req,res)=>{
    res.json({message: "authentic", user: req.user})
})

router.get('/protected', protect, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

router.route("/:id")
    .get(get_user_by_id)
    .patch(patch_user_by_id)
    .delete(delete_user_by_id);

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