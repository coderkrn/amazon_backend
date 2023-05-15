const express = require('express');
const router = express.Router();
const Products = require('../models/productSchema')
const USER = require('../models/usersSchema')
const bcrypt = require('bcryptjs')
const authenticate = require('../middleware/authenticate')



// Show Products in home page (Get Api)

router.get('/getproducts', async (req, res) => {
    try {
        const productsData = await Products.find();
        // console.log(productsData)
        res.status(201).json(productsData)
    } catch (error) {
        console.log("Error", error.message)
    }
})

// Show Individual Product

router.get('/getproductsone/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const IndividualData = await Products.findOne({ id: id });
        // console.log(IndividualData)
        res.status(201).json(IndividualData)
    } catch (error) {
        res.status(400).json(IndividualData)
        console.log("Error in finding one product api", error.message)
    }
})

// Register Data (Sign up)

router.post('/register', async (req, res) => {
    // console.log(req.body)
    const { name, email, mobile, password, cpassword } = req.body;
    if (!name || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "Fill the all the field" })
        console.log("No data available")
    }
    try {
        const preUser = await USER.findOne({ email: email });
        if (preUser) {
            res.status(422).json({ error: "This is user is already present" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Please enter the same password" })
        } else {
            const finalUser = new USER({
                name, email, mobile, password, cpassword
            });

            // Password hasing process

            const storeData = await finalUser.save();
            // console.log(storeData)
            res.status(201).json(storeData)
        }
    } catch (error) {
        console.log(error.message)
    }
})


// Login user api

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Please fill the data" })
    }
    try {
        const userLogin = await USER.findOne({ email: email })
        // console.log(userLogin)
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)

            // console.log(isMatch)
            // Token genrate
            const token = await userLogin.genrateAuthToken();
            // console.log(token)

            // Genrate cookie
            res.cookie('AmazonWeb', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            })
              console.log("Password matched")
            if (!isMatch) {
                res.status(400).json({ error: "Invalid details" })
                console.log("Password dosen't match")
            } else {
                res.status(201).json(userLogin)
            }
        } else {
            res.status(400).json({ error: "This is dosen't exists" })
        }
    } catch (error) {
        // res.status(400).json({ error: "Please enter valid details" })
        console.log("Please enter valid details")
    }
})


// Adding data into cart

router.post('/addcart/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id })
        // console.log(cart + "cart value")

        const userContact = await USER.findOne({ _id: req.userID })
        // console.log(userContact)

        if (userContact) {
            const cartData = await userContact.addCartData(cart);
            await userContact.save()
            // console.log(cartData)
            res.status(201).json(userContact)
        } else {
            res.status(401).json({ error: "Invalid user in cart" })
        }
    } catch (error) {
        res.status(401).json({ error: "Invalid user in cart !!!" })
    }
})



// Get Card details

router.get('/cartdetails', authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID })
        res.status(201).json(buyuser)
    } catch (error) {
        console.log(error.message, "Got some error in < GET CARD DETAILS >")
    }
})
// Get Valid User

router.get('/validuser', authenticate, async (req, res) => {
    try {
        const validuser = await USER.findOne({ _id: req.userID })
        res.status(201).json(validuser)
    } catch (error) {
        console.log(error.message, "Got some error in < GET CARD DETAILS >")
    }
})

// Remove item fron cart section

router.delete('/remove/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        req.rootUser.carts = req.rootUser.carts.filter((curval) => {
            return curval.id != id;
        });
        req.rootUser.save()
        res.status(201).json(req.rootUser)
        // console.log("Item remove")
    } catch (error) {
        res.status(400).json(req.rootUser)
        console.log("Error while removing items")

    }
})

// Logout Api

router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curlem) => {
            return curlem.token !== req.token
        });
        res.clearCookie("AmazonWeb", { path: "/" });

        req.rootUser.save()
        res.status(201).json(req.rootUser.tokens)
        console.log("User logout successfully")
    } catch (error) {
        console.log("Geting error while logout api")
    }
})
module.exports = router;