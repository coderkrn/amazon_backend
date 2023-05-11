const jwt = require('jsonwebtoken')
const USER = require('../models/usersSchema')
const secKey = process.env.KEY;

const authenticate = async(req, res, next)=>{
    try {
        const token =  req.cookies.AmazonWeb;

        const verifyToken = jwt.verify(token, secKey) 
        // console.log(verifyToken)

        const rootUser = await USER.findOne({_id: verifyToken._id, "tokens.token": token})
        // console.log(rootUser)

        if(!rootUser){
           throw new Error("User not found");
        }
         req.token = token;
         req.rootUser = rootUser;
         req.userID = rootUser._id;

         next();
         
    } catch (error) {
        res.status(400).send("Unauthorized: No user found")
        console.log(error.message)
    }
}

module.exports =  authenticate;