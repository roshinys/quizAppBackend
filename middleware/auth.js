const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const result = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!result) {
      throw new Error("missing token");
    }
    User.findById(result.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "Missing Jwt token" });
  }
};

const adminAuthenticate = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error();
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return new Error("Authentication error: Token is missing.");
  }
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    User.findById(decoded.userId)
      .then((user) => {
        socket.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    return new Error("Authentication error: Invalid token.");
  }
};

module.exports = {
  authenticate,
  adminAuthenticate,
  authenticateSocket,
};
