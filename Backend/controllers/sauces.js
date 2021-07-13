// import packages

const Sauce = require("../models/sauce");
const fs = require("fs");

// Function for creating a sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // In this createSauces function:// We start by using the parse function of JSON to retrieve the data sent by the user from the "frontend" to build an object.
  delete sauceObject._id; // We delete the ID received, because it will be created automatically by MongoDB
  const sauce = new Sauce({
    // Then, we call the Sauces constructor which is in the models to build the object by retrieving all the parameters that are present in the sauce constant
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Finally, we use the save function to save the object in the Sauces collection of the MongoDB database
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Function for getting a sauce

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    // We retrieve via findOne the sauce corresponding to the linked ID in the database.

    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Function for modifying a sauce

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce), // We start by retrieving the data sent by the user from the "frontend" to modify an object.

        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`, // We retrieve the image file (if an image is sent) so that it contains the path with the typed file name (Ex: img.jpg)
      }
    : { ...req.body }; // We update the data received, with an image or without.

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  ) // Finally we update the database object via the save property of mongoose.
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Function for deleting a sauce [D]

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // We call the findOne function to retrieve the unique ID of the sauce created by the user,
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // we get the image file in a "filename" constant from the "split" URL,
      fs.unlink(`images/${filename}`, () => {
        // Then with the fs package, we will look for the corresponding immage file in the server tree and we delete it
        Sauce.deleteOne({ _id: req.params.id }) // Finally, via deleteOne we delete the object in the database.
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Function for retrieving the list of Sauces

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(
      // We retrieve all the elements of the "Table / Collection" Sauce from the database,
      (sauces) => {
        res.status(200).json(sauces);
      }
    )
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Fonction Like/Dislike

exports.likeSauce = (req, res, next) => {
  let uid = req.body.userId,
    like = req.body.like; // First, we get the userId & like responses from the frontend.

  Sauce.findOne({ _id: req.params.id }).exec(function (error, sauce) {
    // Then we get the params.id to find the sauce concerned by the Like / Dislike via findOne.

    // Then we create variables in the msg, uiL, uiD function
    let msg = "",
      uiL = sauce.usersLiked.indexOf(uid),
      uiD = sauce.usersDisliked.indexOf(uid);

    // For uiL and uiD we retrieve in the usersLiked & usersDisliked tables to find out if they exist in the event of a choice being canceled.
    if (like == 0 && uiL > -1) {
      sauce.likes--;
      sauce.usersLiked.splice(uiL, 1);
      msg = "Unliked !"; // then we modify the message that will be displayed when calling save.
    } else if (like == 0 && uiD > -1) {
      // If the user cancels a choice, then we remove his userID from the corresponding table & we add or remove 1 from the corresponding counter
      sauce.dislikes--;
      sauce.usersDisliked.splice(uiD, 1);
      msg = "Undisliked !";
    }

    if (like == 1) {
      sauce.likes++; // we increment the corresponding counter (likes), then we modify the message that will be displayed when calling save.

      // If the user likes a sauce and the usersLiked array is empty, we create an entry, otherwise we add this to the array,

      if (sauce.usersLiked.length == 0) {
        sauce.usersLiked = [uid];
      } else {
        sauce.usersLiked.push(uid);
      }
      msg = "Like pris en compte !";
    }

    if (like == -1) {
      sauce.dislikes++; // we increment the corresponding counter (dislikes), then we modify the message which will be displayed when calling save.

      // If the user does not like a sauce, and the usersDisliked array is empty, we create an entry, otherwise we add this to the array.
      if (sauce.usersDisliked.length == 0) {
        sauce.usersDisliked = [uid];
      } else {
        sauce.usersDisliked.push(uid);
      }
      msg = "Disike pris en compte !";
    }

    sauce
      .save()
      .then(() => res.status(201).json({ message: msg }))
      .catch((error) => res.status(400).json({ error })); // returning errors with the error code on failure.
  });
};
