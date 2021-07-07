// import packages
const multer = require('multer');

// Definition of accepted MIME Types

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};


// In this middleware:
// we create a storage constant, to pass to multer as the configuration, which contains the logic needed to tell multer where to save the incoming files:
// the destination function indicates to multer to save the files in the images folder;
// the filename function tells multer to use the original name, replace spaces with underscores, and add a Date.now () timestamp () as the filename.
// It then uses the MIME type dictionary constant to resolve the appropriate file extension;
// We then export the fully configured multer item, pass it our constant storage, and tell it that we will only handle image file downloads.

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');