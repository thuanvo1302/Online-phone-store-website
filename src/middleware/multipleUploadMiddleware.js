const path = require("path");
const multer = require("multer");

// variable store upload file 
let storage = multer.diskStorage({
    // configuration path destination
    destination: (req, file, callback) => {
        callback(null, path.join(`${__dirname}/../public/images/product`));
    },
    // configuration filename
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg" , "image/webp"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});
var upload = multer({ storage: storage })
module.exports = upload;