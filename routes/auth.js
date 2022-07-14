const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");
const { Profil } = require("../models/User");
const CryptoJS = require("crypto-js");

//const { validateRegister } = require("../models/User");

if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require("node-localstorage").LocalStorage;
   localStorage = new LocalStorage("./scratch");
}

//Register
router.post("/register", async (req, res) => {
   const { error } = validateRegister(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const user = await User.findOne({ email: req.body.email });
   if (user)
      return res
         .status(400)
         .json("Cette adresse email n'est pas disponible 😑");

   if (req.body.profil) {
      if (!Object.values(Profil).includes(req.body.profil.toLowerCase()))
         return res.status(404).send(`
            Ce profil n'existe tout simplement pas 😤\n 
            Liste des profils : ${Object.values(Profil)}
            `);
   }

   const newUser = new User({
      nom: req.body.nom,
      email: req.body.email,
      prenom: req.body.prenom,
      profil: req.body?.profil,
      password: CryptoJS.AES.encrypt(
         req.body.password,
         process.env.PASSWORD_SECRET
      ),
   });

   try {
      const result = await newUser.save();
      res.status(201).send(
         `Votre inscription a bien été enregistrée "${result.prenom} ${result.nom}" 😊 \n
         Profil : ${result.profil}
         `
      );
   } catch (error) {
      res.status(500).send(error);
   }
});

router.post("/login", async (req, res) => {
   try {
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findOne({ email: req.body.email });
      if (!user)
         return res.status(401).send("Email et/ou Mot de passe incorrect 😑");

      const hashedPassword = CryptoJS.AES.decrypt(
         user.password,
         process.env.PASSWORD_SECRET
      ).toString(CryptoJS.enc.Utf8);

      if (hashedPassword !== req.body.password)
         return res.status(401).send("Email et/ou Mot de passe incorrect 😑");

      const accessToken = jwt.sign(
         {
            id: user._id,
            profil: user?.profil,
         },
         process.env.JWT_SECRET,
         { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;

      localStorage.setItem("user", JSON.stringify({ ...others, accessToken }));

      res.status(200).send(
         `Bienvenue ${others.prenom} ${others.nom} 😎 \n
          _id : ${others._id} \n
          Token d'accès : ${accessToken}`
      );
   } catch (error) {
      res.status(500).send("Erreur lors de la connexion 😒");
   }
});

//Validate Login
function validateLogin(req) {
   const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(50).required(),
   });

   return schema.validate(req);
}

function validateRegister(user) {
   const schema = Joi.object().keys({
      prenom: Joi.string().min(3).max(100).required(),
      nom: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(50).required(),
      profil: Joi.string(),
   });

   return schema.validate(user);
}

module.exports = router;
