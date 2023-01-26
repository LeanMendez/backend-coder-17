export const checkUser = (req, res, next) => {
    if (req.session?.userName) {
      return next();
    } else {

      return res.redirect("./login");
    }
  };