const Joi = require("joi");
const mongoose = require("mongoose");

const Profil = Object.freeze({
   Admin: "admin",
   Utilisateur: "utilisateur",
   Visiteur: "visiteur",
});

const UserSchema = new mongoose.Schema(
   {
      prenom: {
         type: String,
         min: 3,
         max: 100,
         required: true,
      },
      nom: {
         type: String,
         min: 3,
         max: 50,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         min: 4,
         max: 50,
         required: true,
      },
      img: {
         type: String,
         default:
            "https://drive.google.com/drive/folders/1cWq2RGMwzlJZaXevpn7TY_MOFU7mgw7r?usp=sharing",
         //"https://fr.gravatar.com/userimage/108415600/3a20cb4e62d269b3e31d676f5a03e36b.png",
      },
      profil: {
         type: String,
         enum: Object.values(Profil),
         default: Profil.Utilisateur,
      },
   },
   { timestamps: true }
);

Object.assign(UserSchema.statics, {
   Profil,
});



module.exports.validateRegister = validate;
module.exports = mongoose.model("User", UserSchema);
