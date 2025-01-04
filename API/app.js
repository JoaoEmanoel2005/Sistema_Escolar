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

//Rota privada

app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id;

    // Verifica se o ID é válido (adapte conforme a lógica do seu banco)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID inválido' });
    }
    
    try {
        // Buscando o usuário no banco de dados
        const user = await User.findById(id, '-password');
        
        if (!user) {
            // Se o usuário não for encontrado, retorna erro 404
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }
    
        // Se o usuário for encontrado, retorna a resposta com status 200
        res.status(200).json({ msg: "Está funcionando", user });
    
    } catch (error) {
        // Captura qualquer erro inesperado e retorna erro 500
        console.error(error); // Log para depuração
        res.status(500).json({ msg: 'Erro no servidor' });
    }
})

function checkToken(req, res, next){

const authHeader = req.headers['authorization']
const token = authHeader && authHeader.split(" ")[1]

if(!token){
    return res.status(401).json({msg: "Acesso negado"})
}

try{

   const secret = process.env.SECRET
    
jwt.verify(token,secret)

next()

    } catch(error){
        console.log(error)
        res.status(400).json({msg: 'Token invalido'})
    }

}

//Rota para o cadastro do usuario

app.post('/auth/register', async(req, res) => {

const {name, email, password, confirmpassword} = req.body

if (!name){
    return res.status(422).json({msg: 'O nome é obrigatorio' })
}

if (!email){
    return res.status(422).json({msg: 'O email é obrigatorio' })
}

if (!password){
    return res.status(422).json({msg: 'A sennha é obrigatorio' })
}

if (password !== confirmpassword) {
    return res.status(422).json({msg: 'As senhas sao diferentes' })
}

const userExists = await User.findOne({ email: email })

if(userExists){
    return res.status(422).json({msg: 'Este email ja foi cadastrado' })
}

const salt = await bcrypt.genSalt(12)

const passwordHash = await bcrypt.hash(password, salt)

const user = new User({
    name,
    email,
    password: passwordHash,
})

try{

await user.save()

res.status(201).json({msg: 'Usuario criado com sucesso'})

} catch(error){
    console.log(error)
    res.status(500).json({msg: 'Ocorreu um erro no servidor, tente novamente'})
}

})

//Rota para o login do usuario

app.post("/auth/login", async (req, res) =>{

const  {email, password} = req.body

//validando


if (!email){
    return res.status(422).json({msg: 'O email é obrigatorio' })
}

if (!password){
    return res.status(422).json({msg: 'A sennha é obrigatorio' })
}

//verificando se o usuario existe

const user = await User.findOne({ email: email })

if(!user){
    return res.status(404).json({msg: 'Este usuario nao existe' })
}

//verificando se as senhas correspondem

const checkPassword = await bcrypt.compare(password, user.password)

if(!checkPassword){
    return res.status(422).json({ msg: 'Senha invalida'})
}


try{

const secret = process.env.SECRET

const token = jwt.sign({
    id: user._id
}, secret,)

res.status(200).json({msg: "Login efetuado", token})

} catch (error){
    console.log(error)
    res.status(500).json({msg: 'Ocorreu um erro no servidor, tente novamente'})
}

})



//Credencias

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.cewwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {

    app.listen(3000)
    console.log('conectou ao banco')

}).catch((err) => console.log(err))



