const express = require("express");
const router = express.Router();

const upload = require("../middlewares/charatersUploads")
const controller = require("../controllers/charactersController");
const validations = require("../validations/characters");

router
    // all
    .get("/",controller.list)

    // detail
    .get("/:id",controller.detail)

    // create
    .post("/",upload.single("image"),validations,controller.create)

    // update
    .put("/:id",upload.single("image"),validations,controller.update)

    // delete
    .delete("/:id",controller.destroy)
    
module.exports = router;