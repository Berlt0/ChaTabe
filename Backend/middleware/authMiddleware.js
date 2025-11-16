
import jwt from 'jsonwebtoken'



export const verifyToken = (req, res, next) => {

    //Get token from the cookie

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied',expired: false });
  }

  try {
    
    //Verify if user has token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();

  } catch (error) {

     if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false,message: 'Token expired', expired: true });
    }


    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};
