const {body} = require("express-validator");
const path = require("path");

module.exports = [

    body("image")
        .custom((value,{req}) =>{
            let extensions = [".jpg",".png",".jpeg",".gif"]

            if(!req.file){
                throw new Error("required")
            }

            if(!extensions.includes(path.extname(req.file.originalname))){
                throw new Error("format error")
            }

            return true
        }),

    body("title")
        .notEmpty().withMessage("required")
        .isLength({max : 255}).withMessage("max charecter exceeded"),

    body("rating")
        .notEmpty().withMessage("required")
        .isInt({min : 1,max : 5}).withMessage("format error"),

    body("creationDate")
        .isDate().withMessage("format error"),
        
    body("genderId")
        .notEmpty().withMessage("required")
        .isInt().withMessage("format error")

    
]