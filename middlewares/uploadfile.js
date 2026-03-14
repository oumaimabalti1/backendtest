const multer = require("multer");
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'public', 'images');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext)
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_\-]/g, '');
        
        let fileName = `${Date.now()}_${baseName}${ext}`;
        console.log('Saving file:', fileName, 'to:', uploadPath);
        cb(null, fileName);
    }
});

var uploadfile = multer({ storage: storage });
module.exports = uploadfile;