import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};



