var jwt = require("jsonwebtoken")

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    const valid = jwt.verify(token, "mySecretkey");

    if (valid) {
      next();
    }else{
       return res.send("Unauthorized request") 
    }
      

  }else{
    return res.status(401).send("Unauthorized request")
  }
};


module.exports = verifyAuth;