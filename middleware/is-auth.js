const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) {
    const err = new Error();
    err.status = 401;
    err.message = "Not authenticated";
    throw err;
  }
  try {
    token = token.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verify.id;
  } catch (err) {
    const error = new Error();
    error.status = 401;
    error.message = "Not authenticated";
    throw error;
  }
  next();
};
