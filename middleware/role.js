
const checkRoles = (roles) => {
  return (req, res, next) => {
    !roles.includes(req.user.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
  }
}

module.exports = checkRoles;