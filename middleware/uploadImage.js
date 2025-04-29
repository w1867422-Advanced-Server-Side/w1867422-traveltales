const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>
        cb(null, path.join(__dirname,'../public/uploads')),
    filename: (req,file,cb)=>{
        const ext = path.extname(file.originalname);
        cb(null, `img-${Date.now()}${ext}`);
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: 5*1024*1024, files:5 },
    fileFilter: (req,file,cb)=>{
        /^image\//.test(file.mimetype)
            ? cb(null,true)
            : cb(new Error('Only images allowed'));
    }
});