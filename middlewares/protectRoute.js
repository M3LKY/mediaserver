import User from "../Schema/userTables.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("No token found in cookies");
      return res.status(200).json({ message: req.cookies });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: `${decoded}` });
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("User not found in the database");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    console.log("Authentication successful");
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware: ", err.message);
    res.status(500).json({ message: err.message });
  }
};

export default protectRoute;
