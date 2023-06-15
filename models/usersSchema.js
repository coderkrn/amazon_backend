const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secKey = process.env.KEY;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('not valid email address')
            }
        }
    },
    mobile: {
        type: String,
        require: true,
        unique: true,
        maxlength: 10
    },
    password: {
        type: String,
        require: true,
        minilength: 6
    },
    cpassword: {
        type: String,
        require: true,
        minilength: 6
    },
    tokens: [
        {
            token: {
                type: String,
                require: true,
            }
        }
    ],
    carts: Array
});

// Password hasing

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next();
})

// Token genrate process

userSchema.methods.genrateAuthToken = async function(){
    try {
        let authToken = jwt.sign({_id: this._id,}, secKey)
        this.tokens = this.tokens.concat({token: authToken})
        await this.save();
        return authToken;
    } catch (error) {
        console.log(error.message)
    }
}


// add to cart data 

userSchema.methods.addCartData = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts
    } catch (error) {
        console.log(error.message)
    }
}

const USER = new mongoose.model('USER', userSchema);
module.exports = USER;