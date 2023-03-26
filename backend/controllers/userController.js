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
        throw new Error(' Email ou mot de passe invalide');
    }
});
//@desc     Signup new user 
//@route    POST /api/users/signup 
//@access   Public
const signupUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

     // 1 Validate all fields
     if(!name || !email || !password){
        res.status(400)
        throw new Error('Tous les champs sont requis')
    }

    // 2 Find user by email
    const userExists = await User.findOne({email});
    // then Check if user exist
    if(userExists){
        res.status(400)
        throw new Error("L'utilisateurs existe déjà")
    }
    
     // 3 To create the new user
    const user = await User.create({
        name,
        email,
        password
    });

    // 4 Once user created, then set it into db 
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    }else{
        res.status(400)
        throw new Error("Informations invalident ");
    }
   
});

//@desc     Update user profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        //let's check if password was sent 
        if(req.body.password){
            user.password = req.body.password
        }

        //Let's save the updated changes
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    }else{
        res.status(404)
        throw new Error("Utilisateur non trouvé")
    }
});


export {
    signinUser,
    signupUser,
    updateUserProfile,
}