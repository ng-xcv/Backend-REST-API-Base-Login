const jwt = require("jsonwebtoken");
const { Profil } = require("../models/User");

const verifyToken = (req, res, next) => {
   const authHeader = req.headers.token;
   if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
         if (err) return res.status(403).send("Token invalid 😠");
         req.user = user;
         next();
      });
   } else {
      return res.status(401).send("Vous n'êtes pas connecté 😡");
   }
};

const verifyTokenAndAuthorization = (req, res, next) => {
   verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.profil === Profil.Admin) {
         next();
      } else {
         res.status(403).send(
            "Vous n'avez pas les accés requis pour cette action 🤬"
         );
      }
   });
};

const verifyTokenAndAdmin = (req, res, next) => {
   verifyToken(req, res, () => {
      if (req.user.profil === Profil.Admin) {
         next();
      } else {
         res.status(403).send(
            "Vous n'avez pas les accés requis pour cette action 🤬"
         );
      }
   });
};

const verifyTokenAndProfilAuthorization = (profil) => (req, res, next) => {
   verifyToken(req, res, () => {
      !profil.includes(req.user.profil.toLowerCase())
         ? res
              .status(401)
              .send("Vous n'avez pas les accés requis pour cette action 🤬")
         : next();
   });
};

module.exports = {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
   verifyTokenAndProfilAuthorization,
};
