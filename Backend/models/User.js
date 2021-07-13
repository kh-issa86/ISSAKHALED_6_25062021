// import packages
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// we create a data schema which contains the desired fields for each User, Email and Oblogatory password.

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// We then check that the email address is unique in the database
userSchema.plugin(uniqueValidator);

// we export this schema as a Mongoose model called "User", making it available to our Express application.
module.exports = mongoose.model("User", userSchema);
