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

const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; 
  } catch (err) {
    // console.error('Invalid token:', err.message);
    return null;
  }
};

check_if_logged_in = (req,res,next) =>{
    // const authHeader = req.headers['authorization'];
    // const token = authHeader?.split(' ')[1];  
    console.log('Token from cookies:', token); // Add this for debugging    
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized'});
    const user= getUserFromToken(token);
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid token'});
    
    console.log("authentication works fine")
    req.user=user; 
    next();
}


authorize=(role) => {
  return (req,res,next)=>{
    // const authHeader = req.headers['authorization'];
    // const token = authHeader?.split(' ')[1];  

    const token = req.cookies.token;
    if(!token) return res.status(401).json({ status: 'error', message: 'Unauthorized'});

    const user=getUserFromToken(token)
    if(!user || !role.includes(user.role)) res.status(401).json({ status: 'error', message: 'Unauthorized'});
    
    console.log("autherization works fine")
    next();
  }
}

module.exports={
    protect,
    check_if_logged_in,
    authorize,
}