const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {

        const token=req.header('Authorization');


        // console.log('the token is --------------------------------------------------------------->',token);

        
        const user =jwt.verify(token,process.env.JWT_SECRET);



        // console.log('userid is---------------------------------------------------------------->',user.userId);
        const getUser= await User.findByPk(user.userId)
            // console.log('=================================>',JSON.stringify(user));
            req.user=getUser;
            next();

        
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({success:false});

        
    }



}
module.exports={authenticate };