const db = require("../database/models");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer")
const sendGridTransport = require("nodemailer-sendgrid-transport");
const YOUR_API_KEY = process.env.SENDGRID_KEY;
const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:YOUR_API_KEY
    }
})) 

const jwt = require("jsonwebtoken");

module.exports = {

    register : (req,res) =>{
        const errors = validationResult(req);

        if(errors.isEmpty()){
            db.users.create({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password,12)
            }).then(userCreated =>{
                const response = {
                    status: 200,
                    msg: "registration successfully check your email to see the welcome message",
                }

                transporter.sendMail({
                    to: userCreated.email,
                    from: process.env.SENDGRID_EMAIL,
                    subject: "challenge alkemy backend NodeJs",
                    html: `<h3>Bienvenido!!! gracias por registrarte</h3>
                           <p>gracias por registrarte en mi api para explorar el mundo de disney\napartir de ahora cada ves que quieras usar la api deberas logearte y la api te devolvera un token para que uses en cada peticion</p>
                           <p>este mensaje esta hecho para el challenge de alkemy - juan de giorgi</p>`
                }).then(result =>{
                    console.log(result);
                }).catch(err =>{
                    console.log(err);
                })
             
                res.status(200).json(response);
            }).catch(err =>{
                const response = {
                    status: 500,
                    msg: "internal server error please try letter"
                }
                console.log(err);
                res.status(500).json(response);
            })
        }else{
            const response = {
                status: 400,
                msg: "error when process the registration",
                errors : errors.mapped()
            }
            
            res.status(400).json(response)
        }
    },

    login : (req,res) =>{
        const errors = validationResult(req);

        if(errors.isEmpty()){
            db.users.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user =>{
                if(!user){
                    return Promise.reject()
                }else{
                    const expireToken = 180;
                    const payLoad = {
                        id: user.id,
                        name: user.email
                    }

                    const token = jwt.sign(payLoad,process.env.JWT_SECRET,{expiresIn: expireToken})

                    const response = {
                        status: 200,
                        msg: `welcome ${user.email}`,
                        "expire in" : `${expireToken / 60} min`, 
                        token: token
                    }

                    res.status(200).json(response);
                }
            }).catch(err =>{
                const response = {
                    status: 401,
                    msg: "invalid credentials"
                }

                res.status(401).json(response);
            })
        }else{
            const response = {
                status: 401,
                msg: "invalid credentials"
            }

            res.status(401).json(response);
        }
    }
}