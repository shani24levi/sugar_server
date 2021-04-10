const jwt = require("jsonwebtoken");
const constants = require("../config/constants");
const {TOKEN} = constants;

const authToken = (req,res,next) => {
  let token = req.header("x-auth-token");
  // Checking if a token has been sent
  if(!token){return res.status(401).json({ message: "access denied" })}
  try{
    let checkToken = jwt.verify(token,TOKEN);
    req.email = checkToken.email;
    req._id = checkToken._id
    
    next()
  }
  catch(err){
    // If the token is incorrect
    return res.status(400).json(err)
  }
}

exports.authToken = authToken