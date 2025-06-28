const jwt = require('jsonwebtoken');
const jwtUthMiddleware = (req, res, next) =>{
    const authorization = req.headers.authorization;
    if(!authorization)    return res.status(401).json({error: 'token found'});

    const token = req.headers.authorization.split(' ')[1];
    if(!token)  return res.status(401).json({error: 'unauthorized'})

    try {
        const decode = jwt.verify(token, process.env.jwt_secret_key);
        req.user = decode;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: 'invalid token'});
    }

};

const generateToken = (userData) =>{
    return jwt.sign(userData, process.env.jwt_secret_key, {expiresIn: 3000});
};

module.exports = {jwtUthMiddleware, generateToken};