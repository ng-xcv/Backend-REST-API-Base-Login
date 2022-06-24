const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

mongoose
   .connect(process.env.URI, { useNewUrlParser: true })
   .then(() => console.log("\nSuccessfully connected to the database ..."))
   .catch((error) => console.log(error));

app.listen(process.env.PORT, () => {
   console.log(`\nListening on port ${process.env.PORT} ...`);
});
