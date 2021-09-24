const db = require("../database/models");
const fs = require("fs");
const path = require("path"); 
const { validationResult } = require("express-validator");

module.exports = {

    list : (req,res) =>{
        db.movies.findAll({
            attributes : [
                "id",
                "image",
                "title",
                "creationDate",
            ]
        }).then(movies =>{
                movies.forEach(movie => {
                    movie.image = `${req.protocol}://${req.get("host")}/movies/${movie.image}`;
                    movie.dataValues.url = `http://${req.get("host")}/movies/${movie.id}`
                    movie.dataValues.id = undefined

                });
                const response = {
                    meta : {
                        status : 200,
                        url : `${req.protocol}://${req.get("host")}${req.originalUrl}`,
                        moviesQuantity : movies.length
                    },
                    movies : movies
                }
                res.status(200).json(response)
            })
    },

    detail : (req,res) =>{
        db.movies.findByPk(req.params.id,{
            include : [
                { association : "gender",},
                { association : "characters", attributes : ["id","image","name"]},
            ]
        }).then(movie =>{
                movie.image = `${req.protocol}://${req.get("host")}/movies/${movie.image}`
                movie.dataValues.genderId = undefined

                movie.gender.image = `${req.protocol}://${req.get("host")}/genders/${movie.gender.image}`;
                
                movie.characters.forEach(character => character.image = `${req.protocol}://${req.get("host")}/characters/${character.image}`)
                movie.dataValues.characters.forEach(character =>{
                    character.dataValues.characterMovie = undefined
                    character.dataValues.url = `${req.protocol}://${req.get("host")}/characters/${character.id}`
                    character.dataValues.id = undefined
                })
                const response = {
                    meta : {
                        status : 200,
                        url : `${req.protocol}://${req.get("host")}${req.originalUrl}`,
                        CharactersQuantity : movie.characters.length
                    },
                    movie : movie
                }

                res.status(200).json(response)
            })
    },

    create : (req,res) =>{
        const errors = validationResult(req);

        if(errors.isEmpty()){
            db.movies.create({
                image : req.file.filename,
                title : req.body.title,
                creationDate : req.body.creationDate,
                rating : +req.body.rating,
                genderId : +req.body.genderId
            }).then(movieCreated =>{
    
                const response = {
                    status : 201,
                    msg : "movie created successfully",
                    url : `${req.protocol}://${req.get("host")}/movies/${movieCreated.id}`
                }
    
                res.status(201).json(response);
            }).catch(err =>{
                fs.unlinkSync(path.join(__dirname,"../uploads/movies/",req.file.filename))
    
                const response = {
                    status : 400,
                    msg : "error when creating the movie",
                    errors : err.errors
                }
    
                res.status(400).json(response);
            })
        }else{
            req.file ? fs.unlinkSync(path.join(__dirname,"..","uploads","movies",req.file.filename)) : null;

            const response = {
                status : 400,
                msg : "error when creating the movie",
                errors : errors.mapped()
            }

            res.status(400).json(response);
        }
    },

    update : (req,res) =>{
        db.movies.update({
            image : req.file ? req.file.filename : null,
            title : req.body.title,
            creationDate : req.body.creationDate,
            qualification : +req.body.qualification,
            genderId : +req.body.genderId
        },{
            where : {
                id : req.params.id
            }
        }).then(movieUpdated =>{
            const response = {
                msg : "movie updated successfully ",
                url : `${req.protocol}://${req.get("host")}/movies/${req.params.id}`
            }

            res.status(200).json(response);
        }).catch(err =>{
            req.file ? fs.unlinkSync(path.join(__dirname,"../uploads/movies/",req.file.filename)) : null

            const response = {
                status : 400,
                msg : "error when updated the movie",
                errors : err.errors.map(error =>{
                    error.original
                })

            }

            res.status(400).json(response);
        })
    },

    destroy : (req,res) =>{
        db.movies.destroy({
            where : {
                id : req.params.id
            }
        }).then(result =>{
            const response = {
                url : `${req.protocol}://${req.get("host")}/movies/${req.params.id}`,
                msg : "movie deleted successfully ",
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