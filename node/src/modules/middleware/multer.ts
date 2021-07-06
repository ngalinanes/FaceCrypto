const path = require('path');
const multer = require('multer');
const maxSizeUpload = 500000

export const multerI = multer({
    dest: path.join(__dirname, '../../../../assets'),
    limits: {
        fileSize: maxSizeUpload
    }
}).single('avatar');

export const multerImages = multer({
    dest: path.join(__dirname, '../../../../uploads')
}).any('audio');