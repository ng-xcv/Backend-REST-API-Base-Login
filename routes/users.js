const router = require("express").Router();
const _ = require("lodash");
const User = require("../models/User");
const { Profil } = require("../models/User");
const CryptoJS = require("crypto-js");

const {
   verifyToken,
   verifyTokenAndAdmin,
   verifyTokenAndAuthorization,
   verifyTokenAndProfilAuthorization,
} = require("../middleware/verifyToken");

//GET ALL USER OR USER BY PROFIL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
   const query = req.query.profil;
   try {
      const users = query
         ? await User.find({ profil: query }).sort({
              createdAt: -1,
           })
         : await User.find().sort({ _id: -1 });

      res.status(200).json(users);
   } catch (err) {
      res.status(500).json(err);
   }
});

//GET USER BY ID
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).send(others);
   } catch (error) {
      res.status(500).send(error);
   }
});

//UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
   if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
         req.body.password,
         process.env.PASSWORD_SECRET
      ).toString();
   }
   try {
      const updatedUser = await User.findByIdAndUpdate(
         req.params.id,
         { $set: req.body },
         { new: true }
      );
      res.status(200).send(updatedUser);
   } catch (error) {
      res.status(500).send(error);
   }
});

//DELETE USER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
   try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).send("User has been deleted ;)");
   } catch (error) {
      res.status(500).send(error);
   }
});

//SWITCH USER PROFIL
router.put(
   "/switchProfil/:id",
   verifyTokenAndProfilAuthorization([Profil.Admin, Profil.Utilisateur]),
   async (req, res) => {
      try {
         const user = await User.findById(req.params.id);
         console.log(user);
         if (!user)
            res.status(400).send("Aucun utilisateur n'est associé a cet ID 🤷🏽‍♂️");

         if (!Object.values(Profil).includes(req.body.profil.toLowerCase()))
            return res
               .status(404)
               .send("Ce profil n'existe tout simplement pas 😤");

         const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { ...req.body, profil: req.body.profil.toLowerCase() } },
            { new: true }
         );
         console.log(updatedUser);
         res.status(200).send(updatedUser);
      } catch (error) {
         res.status(500).send(error);
      }
   }
);

/* ================== LocalStorage Usage ================ 

if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require("node-localstorage").LocalStorage;
   localStorage = new LocalStorage("./scratch");
}

localStorage.getItem("user") &&
   console.log(JSON.parse(localStorage.getItem("user")).accessToken);

========================================================== */
module.exports = router;
