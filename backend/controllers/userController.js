import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';



//@desc     Signin user & get token (LOGIN)
//@route    POST /api/users/sign 
//@access   Public
const signinUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    //Find user by email
    const user = await User.findOne({email});

    //Check if user and password match
    if(user &&(await bcrypt.compare(password, user.password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    }else{
        res.status(401)
        throw new Error('Invalid email or password');
    }
});


export {
    signinUser,
}