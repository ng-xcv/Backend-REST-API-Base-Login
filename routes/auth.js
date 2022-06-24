const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { validateRegister } = require("../models/User");
const User = require("../models/User");

if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require("node-localstorage").LocalStorage;
   localStorage = new LocalStorage("./scratch");
}

const CryptoJS = require("crypto-js");

//Register
router.post("/register", async (req, res) => {
   const { error } = validateRegister(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const newUser = new User({
      nom: req.body.nom,
      email: req.body.email,
      prenom: req.body.prenom,

      password: CryptoJS.AES.encrypt(
         req.body.password,
         process.env.PASSWORD_SECRET
      ),
   });

   try {
      const result = await newUser.save();
      res.status(201).send(result);
   } catch (error) {
      res.status(500).send(error);
   }
});

router.post("/login", async (req, res) => {
   try {
      const { error } = validateLogin(req.body);
      error && res.status(400).send(error.details[0].message);

      const user = await User.findOne({ email: req.body.email });
      !user && res.status(401).send("Invalid username or password 😑");

      const hashedPassword = CryptoJS.AES.decrypt(
         user.password,
         process.env.PASSWORD_SECRET
      ).toString(CryptoJS.enc.Utf8);

      hashedPassword !== req.body.password &&
         res.status(401).send("Invalid username or password 😑");

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

      res.status(200).send({ ...others, accessToken });
   } catch (error) {
      res.status(500).send("Error when logging 😒");
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

module.exports = router;
