require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const User = require("./model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(201).json({"message":"Hello World"});
    console.log("Helloww World");
});


app.put("/update/:id", auth,  async (req, res) =>{
    try{
        const {first_name, last_name, email, password, user_type} = req.body
        if(!(email) && password && first_name && last_name && user_type){
            return res.status(400).json({"message":"request params is not completly"});
        }

        const userAuth = await User.findOne({"token":req.headers['x-access-token']})
        if(userAuth.user_type.toLowerCase()!='admin'){
            return res.status(400).json({"message":"Just Admin can access for this features"});
        }
        
        encryptedPassword = await bcrypt.hash(password, 10);
        
        filter = {_id:req.params.id}
        const newToken = jwt.sign(
            {user_id: req.params.id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn:"2h",
            }
        );

        update = {
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            token:newToken,
        }

        finalUser = await User.findOneAndUpdate(filter, update);
        return res.status(200).json({"message": "success update user"})
    }catch(err){
        return res.status(400).json({"message":err.message});
    }
});


app.delete("/delete/:id",auth, async (req, res) =>{
    const userAuth = await User.findOne({"token":req.headers['x-access-token']})
    if(userAuth.user_type.toLowerCase()!='admin'){
        return res.status(400).json({"message":"Just Admin can access for this features"});
    }

    User.findOneAndDelete({ _id:req.params.id }, function (err, docs) {
        if (err){
            return res.status(400).json({"message":err.message});
        }
        else{
            return res.status(200).json({"message": "success delete user"})
        }
    });
});

app.get("/users", auth, async (req, res) =>{
    req.headers['x-access-token']
    const userAuth = await User.findOne({"token":req.headers['x-access-token']})

    if(userAuth.user_type.toLowerCase()!='admin'){
        return res.status(400).json({"message":"Just Admin can access for this features"});
    }

    User.find({}, function(err, users) {
        var array = [];
    
        users.forEach(function(user) {
           array.push(user);
        });
    
        return res.status(200).json(array);
      });
});

app.get("/user/:id", async(req, res)=>{
    const userAuth = await User.findOne({"token":req.headers['x-access-token']})

    if(!userAuth){
        return res.status(400).json({"message":"You dont have access for this features"});
    }

    User.find({_id:req.params.id}, function(err, user) {
        if(err){
            return res.status(400).json({"message":"user not found"});
        }else{
            return res.status(200).json(user);
        }
    });
});


app.post("/login", async (req, res) =>{
    const {email, password} = req.body;
    if(!(email && password)){
        return res.status(400).json({
            "message":"require email and password attribute"
        })
    }

    const user = await User.findOne({email:email});
    if(user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign(
            { user_id: user._id, email:email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        const refresh_token = jwt.sign(
            { user_id: user._id, email:email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );

        user.token = token;
        user.refresh_token = refresh_token;

        user.save(function(err) {
            if(err) {
                return res.status(400).json({"message": err.message});
            }
            else {
                return res.status(200).json({"token": token, "refresh_token": refresh_token});
            }
        });
        

        return res.status(200).json({"token": user.token, "refresh_token": refresh_token})
    }
    
});

app.get("/refresh/:id", async(req, res) =>{
    const user = await User.findOne({_id:req.params.id});
    if(user){
        const new_token = jwt.sign(
            { user_id: user._id, email:user.email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        const new_refresh_token = jwt.sign(
            { user_id: user._id, email:user.email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );

        user.token = new_token;
        user.refresh_token = new_refresh_token;

        user.save(function(err) {
            if(err) {
                return res.status(400).json({"message": err.message});
            }
            else {
                return res.status(200).json({"token": new_token, "refresh_token": new_refresh_token});
            }
        });
    }else{
        return res.status(400).json({"message": "user not found"});
    }
    
});


app.post("/register", async (req, res) => {
    try{
        const {first_name, last_name, email, password, user_type} = req.body
        if(!(email) && password && first_name && last_name && user_type){
            res.status(400).json({"message":"request params is not completly"});
        }

        const oldUser = await User.findOne({ email });

        if(oldUser){
            return res.status(409).json({"message":"user has been registered"});
        }
        
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            user_type:user_type,
        })

        return res.status(200).json({"message":"Sucessfully created user"})

    }catch(err){
        return res.status(400).json({"message":err.message})

    }
});


module.exports = app;