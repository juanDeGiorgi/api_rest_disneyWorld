const express = require("express");
const router = express.Router();
const upload = require("../middlewares/charatersUploads")

const controller = require("../controllers/charactersController");

router
    // all characters 
    .get("/",controller.list)

    // detail character
    .get("/:id",controller.detail)

    // create character
    .post("/",upload.single("image"),controller.create)

    // delete character
    .delete("/:id",controller.destroy)
    
module.exports = router;