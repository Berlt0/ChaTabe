
import jwt from 'jsonwebtoken'



export const verifyToken = (req, res, next) => {

    //Get token from the cookie

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {

    //Verify if user has token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();

  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};
