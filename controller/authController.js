const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const validateInputs = (email, password) => {
  return email && email.includes("@") && password && password.length >= 6;
};

const postRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateInputs(email, password)) {
      return res.json({ success: false, message: "Check inputs" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User Already Exists Login" });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, password: hashPassword });
    const userDetails = { email: user.email, _id: user._id };
    const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY);
    res.json({
      message: "Successfully registered User",
      success: true,
      token,
      userDetails,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateInputs(email, password)) {
      return res.json({ success: false, message: "Check inputs" });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.json({
        success: false,
        message: "User Doesn't Exists Register",
      });
    }
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.json({ success: false, message: "Password doesn't match" });
    }
    const userDetails = { _id: userExists._id, email: userExists.email };
    const token = jwt.sign({ userId: userExists._id }, process.env.PRIVATE_KEY);
    res.json({
      message: "Successfully Logged In User",
      success: true,
      token,
      userDetails,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

module.exports = { postRegister, postLogin };
