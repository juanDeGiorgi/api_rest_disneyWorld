// module dependencies
const express = require("express");
const router = express.Router();

// module controller
const controller = require("../controllers/moviesController");

// middlewares
const upload = require("../middlewares/moviesUploads");
const validations = require("../validations/movies");

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