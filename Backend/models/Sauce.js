// import packages
const mongoose = require("mongoose");

// we create a data schema which contains the desired fields for each Sauce, indicates their type as well as their character (mandatory or not).
const sauceSchema = mongoose.Schema({
  // _id will be created automatically by MongoDB 
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  likes: { type: Number, required: true, default: 0  },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: [{ type: String }],
  usersDisliked: [{ type: String }],
});
// we export this schema as a Mongoose template called “Sauce”, making it available for our Express application.
module.exports = mongoose.model("Sauce", sauceSchema);
