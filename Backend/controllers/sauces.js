
// import packages

const Sauce = require('../models/sauce');
const fs = require('fs');

// Function for creating a sauce
// In this createSauces function:
// We start by using the parse function of JSON to retrieve the data sent by the user from the "frontend" to build an object.
// We delete the ID received, because it will be created automatically by MongoDB
// Then, we call the Sauces constructor which is in the models to build the object by retrieving all the parameters that are present in the sauce constant
// Finally, we use the save function to save the object in the Sauces collection of the MongoDB database.
// By returning errors with the error code on failure.

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};


// Function for getting a sauce 
// In this getOneSauce function:
// We retrieve via findOne the sauce corresponding to the linked ID in the database.
// By returning errors with the error code on failure.

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Function for modifying a sauce 
// In this modifySauces function:
// We start by retrieving the data sent by the user from the "frontend" to modify an object.
// We retrieve the image file (if an image is sent) so that it contains the path with the typed file name (Ex: img.jpg)
// We update the data received, with an image or without.
// Finally we update the database object via the save property of mongoose.

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};


// Function for deleting a sauce [D]
// In this deleteSauce function:
// We call the findOne function to retrieve the unique ID of the sauce created by the user,
// In our then block, we get the image file in a "filename" constant from the "split" URL,
// Then with the fs package, we will look for the corresponding immage file in the server tree and we delete it
// Finally, via deleteOne we delete the object in the database.

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Function for retrieving the list of Sauces
// In this getAllSauces function:
// We retrieve all the elements of the "Table / Collection" Sauce from the database,
// By returning errors with the error code on failure.

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};




exports.likeSauce = (req, res, next) => {
  let uid = req.body.userId, like = req.body.like;

  Sauce.findOne({ _id: req.params.id }).exec(function (error, sauce){
    let msg = "", uiL = sauce.usersLiked.indexOf(uid), uiD = sauce.usersDisliked.indexOf(uid);

    if(like == 0 && uiL >-1){

      sauce.likes--;
      sauce.usersLiked.splice(uiL,1);
      msg = "Unliked !";

    } else if(like == 0 && uiD >-1){

      sauce.dislikes--;
      sauce.usersDisliked.splice(uiD,1);
      msg = "Undisliked !";

    };

    if(like == 1){

      sauce.likes++;
      if (sauce.usersLiked.length == 0){
        sauce.usersLiked=[uid];

      } else{
        sauce.usersLiked.push(uid);
      }
      msg = "Like pris en compte !";
    };

    if(like == -1){

      sauce.dislikes++;
      if (sauce.usersDisliked.length == 0){
        sauce.usersDisliked=[uid];
      } else{
        sauce.usersDisliked.push(uid);
      }
      msg = "Disike pris en compte !";

    };

    sauce.save()
      .then(() => res.status(201).json({ message: msg}))
      .catch(error => res.status(400).json({ error }));

  });
};