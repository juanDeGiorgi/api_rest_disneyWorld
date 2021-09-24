const express = require("express");
const router = express.Router();
const upload = require("../middlewares/moviesUploads");

const controller = require("../controllers/moviesController");
const validations = require("../validations/movies");

router
    // all movies
    .get("/",controller.list)

    // detail movie
    .get("/:id",controller.detail)

    // create movie
    .post("/",upload.single("image"),validations,controller.create)

    // update movie
    .put("/:id",upload.single("image"),controller.update)

    // delete movie
    .delete("/:id",controller.destroy)
    
module.exports = router;