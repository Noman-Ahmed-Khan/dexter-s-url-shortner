// You can add routes implementations here
const express = require('express')
const { get_all_users,get_user_by_id,post_new_user,patch_user_by_id,delete_user_by_id } = require('../controllers/user');

const router=express.Router();
// See That we can replace /api/users with / for simplicity  

router.route('/')
    .get(get_all_users)
    .post(post_new_user);


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