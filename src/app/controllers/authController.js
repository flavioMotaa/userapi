const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authConfig = require("../../config/auth.json")
const mailer = require("../../modules/mailer");

const User = require("../models/User");

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

Router.post("/register", async (req, res) => {
    //Trollge is waiting
    try {
        if (await User.findOne({email: req.body.email})){
            return res.status(400).send({error: "Email already in use"})
        }

        const user = await User.create(req.body);
        console.log(req.body);
        return res.send({
            user,
            token: generateToken({id: user.id})
        });
    } catch (err) {
        return res.status(400).send({error: "Registering failed carai"+err});
    }
})

Router.post("/authenticate", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");
    if (!user) {
        return res.status(400).send({error: "User not found"});
    }
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: "Wrong password"});
    }

    user.password = undefined;

    res.send({
        user,
        token: generateToken({id: user.id})
    });
})

Router.post("/forgot_password", async (req, res) => {
    const {email} = req.body;

    try {
        let findElectronicMail = await User.findOne({email: email});

        if (findElectronicMail){
            const token = crypto.randomBytes(20).toString("hex");

            let now = new Date();
            now.setHours(now.getHours()+1);

            await User.findByIdAndUpdate(findElectronicMail.id, {
                "$set": {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            })

            mailer.sendMail({
                to: email,
                from: "lilcodeteam2021@gmail.com",
                text: `Esqueceu sua senha?\n toma o token aí\n ${token}`
            })

            res.status(200).send("Token enviado")
        }
    } catch (error) {
        res.status(400).send({error: "Failed to locate user"})
    }
})

Router.post("/reset_password", async (req, res) => {
    const {email, token, password} = req.body;

    try {
        const user = await User.findOne({email}).select("+passwordResetToken passwordResetExpires");

        //ALgumas validações óbvias
        if(!user) {
            return res.status(400).send({error: "User not found"});
        }
        
        if (token !== user.passwordResetToken){
            return res.status(400).send({error: "Not valid token"});
        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            res.status(400).send({error: "Token expired, send token again"});
        }

        user.password = password; //Não precisamos hashear a senha de novo

        await user.save()
        res.send();
    } catch(err) {
        res.status(400).send(err);
    }
})

module.exports = Router;