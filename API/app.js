require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

//models
const User = require('./models/User')

app.get('/', (req, res) => {
    res.status(200).json({msg: 'bem vindo a api'})
})

app.post('/auth/register', async(req, res) => {

const {name, email, password, confirmpassword} = req.body

if (!name){
    return res.status(422).json({msg: 'O nome é obrigatorio' })
}

if (!email){
    return res.status(422).json({msg: 'O email é obrigatorio' })
}

if (!password){
    return res.status(422).json({msg: 'A password é obrigatorio' })
}

})

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.cewwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {

    app.listen(3000)
    console.log('conectou ao banco')

}).catch((err) => console.log(err))



