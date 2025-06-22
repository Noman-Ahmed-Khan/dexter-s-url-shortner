const jwt= require('jsonwebtoken');

protect = (req,res,next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err){
        res.status(401).json({ status: 'error', message: 'Invalid token'});
    }
}

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // 👈 
  } catch (err) {
    console.error('Invalid token:', err.message);
    return null;
  }
};

check_if_logged_in = (req,res,next) =>{
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized'});
    const userId= getUserIdFromToken(token);
    if (!userId) return res.status(401).json({ status: 'error', message: 'Invalid token'});
    
    req.userId=userId; 
    next();
}

module.exports={
    protect,
    check_if_logged_in,
}