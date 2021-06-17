const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

userSchema.pre("save", async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

module.exports = mongoose.model("usuarios", userSchema);