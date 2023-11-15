const User = require("../models/userModel");
const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}
exports.login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("No user exsist with this email");
    error.statusCode = 404;
    throw error;
  }
  if (user && bcryptjs.compareSync(password, user.password)) {
    res.status(200).json({ user, token: generateToken(user._id) });
  } else {
    const error = new Error();
    error.status = 401;
    error.msg = "Please check your email and password";
    throw error;
  }
});
exports.signup = asynchandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const exsits = await User.findOne({ email: email });
  if (exsits) {
    const error = new Error();
    error.status = 400;
    error.msg = "User already exsits";
    throw error;
  }
  try {
    const hp = await bcryptjs.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hp,
      pic,
    });
    res.status(200).json({ user, token: generateToken(user._id) });
  } catch (e) {
    res.status(400);
    throw new Error("Failed to create user");
  }
});
exports.getuser = async (req, res, next) => {
  const { search } = req.query;
  if (search) {
    const user = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).find({ _id: { $ne: req.userId } });
    res.json(user);
  } else {
    res.json(await User.findById(req.userId, { name: 1, pic: 1, email: 1 }));
  }
};
