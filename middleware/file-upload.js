const multer = require('multer');
const uuid = require('uuid/v1');

const MIME_TYPE = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png'
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE[file.mimetype];
      cb(null, `${uuid()}.${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE[file.mimetype];
    const error = isValid ? null : new Error('Invalid Image type');

    cb(error, isValid);
  }
});


module.exports = fileUpload;
