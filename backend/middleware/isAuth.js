const jwt = require("jsonwebtoken");

// Since public pages can be retrieved by anybody, we don't throw any errors
// in the authentication middleware. We have further authorization checks when
// we load the page from the database.

module.exports = (req, res, next) => {
  console.log("--- Authorizatio Check START ----");
  let { authorization } = req.headers;
  if ( authorization){
    let _token = authorization.split(" ")[1];
    const { userId } = jwt.verify(_token, process.env.JWT_KEY);
    console.log(userId);
    req.body.userId = userId;
    console.log("--- Authorizatio SUCCESS ----");
    next();
  } else {
    console.log("--- Authorizatio FAILED ----");
    res.status(401).json({
      message: "User successfully created.",
    });
  }
};
