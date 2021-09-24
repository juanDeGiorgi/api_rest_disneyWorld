const db = require("../database/models");

module.exports = {

    list : (req,res) =>{
        db.characters.findAll({
            attributes : ["id","image","name"]
        }).then(characters =>{
                characters.forEach(character => {
                    character.image = `${req.protocol}://${req.get("host")}/characters/${character.image}`;
                    character.dataValues.url = `${req.protocol}://${req.get("host")}/characters/${character.id}`
                    character.dataValues.id = undefined
                });
                const response = {
                    meta : {
                        status : 200,
                        url : `${req.protocol}://${req.get("host")}${req.originalUrl}`,
                        charactersQuantity : characters.length 
                    },
                    characters : characters
                } 
                res.json(response)
            })
    },

    detail : (req,res) =>{
        db.characters.findByPk(req.params.id,{
            include : [
                {association : "movies", attributes : ["id","image","title"]}
            ]
        }).then(character =>{
            character.image = `${req.protocol}://${req.get("host")}/characters/${character.image}`;
            character.movies.forEach(movie => movie.image = `${req.protocol}://${req.get("host")}/movies/${movie.image}`)
            character.dataValues.movies.forEach(movie =>{
                movie.dataValues.characterMovie = undefined
                movie.dataValues.url = `${req.protocol}://${req.get("host")}/movies/${movie.id}`
                movie.dataValues.id = undefined
            })

            const response = {
                meta : {
                    status : 200,
                    url : `${req.protocol}://${req.get("host")}${req.originalUrl}`,
                    moviesQuantity : character.movies.length    
                },
                character : character
            }
            res.json(response)
        })
    },

    create : (req,res) =>{
        db.characters.create({
            image : req.file.filename,
            name : req.body.name,
            age : +req.body.age,
            weight : +req.body.weight,
            history : req.body.history
        }).then(characterCreated =>{

            const response = {
                msg : "character created successfully",
                url : `http://${req.get("host")}/characters/${characterCreated.id}`
            }

            res.status(201).json(response);
        }).catch(err =>{

            const response = {
                msg : "error when creating the character",
                errors : err.errors
            }

            res.status(400).json(response);
        })
    },

    update : (req,res) =>{

    },

    destroy : (req,res) =>{
        db.characters.destroy({
            where : {
                id : req.params.id
            }
        }).then(result =>{
            const response = {
                msg : "movie deleted successfully ",
                url : `http://${req.get("host")}/characters/${req.params.id}`
            }

            res.status(200).json(response);
        }).catch(err =>{

            const response = {
                status : 400,
                msg : "error when deleted the movie",
                errors : err

            }

            res.status(400).json(response);
        })
    },

    search : (req,res) =>{

    }

}