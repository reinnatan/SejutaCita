const jwt = require("jsonwebtoken");
const config = process.env;
const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token){
        return res.status(403).json({"message":"token parameter required in header"})
    }

    try{
        const decode = jwt.verify(token, config.TOKEN_KEY);
        req.user = decode;
    }catch(err){
        return res.status(401).json({"message":err.message})
    }
    return next();
};

module.exports = verifyToken;