require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const mongoose = require("mongoose");

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })

const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

//importing authentication function to check for the token
const { authenticateToken } = require("./utilities");

//importing Schema
const User = require("./models/user.model");
const Note = require("./models/notes.model")

app.use(express.json());

app.use(cors(
    {
        origin: "*"
    }
));

//create user
app.post("/create-account", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const user = new User({ fullName, email, password });
        await user.save();

        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn : "360000m"
        })
        
        res.status(201).json({message: "User created successfully", user, accessToken});

        
    } catch (error) {
        res.status(500).json({message: "Error creating user"});
    }
})

//Login
app.post("/login", async (req, res)=>{
    try {
        const {email, password} = req.body
        if(!email) { 
            return res.status(400).json({message : "Email is required"})
        }

        if(!password) { 
            return res.status(400).json({message : "Password is required"})
        }

        const userInfo = await User.findOne({ email : email})

        if(!userInfo) {
            return res.status(400).json({message : "User not found"})
        }

        if(userInfo.email == email && userInfo.password == password){
            const user = {user: userInfo} 
            const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn : "360000m"
            })
            return res.json({
                message:  "Login Successful",
                email,
                accessToken
            })
        } else {
            return res.json({
                message : "Invalid Credentials"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
})

//Get user
app.get("/get-user", authenticateToken ,async(req, res)=>{
    const {user} = req.user
    const userId = req.user.user.user._id 

    const isUser = await User.findOne({_id: user._id})

    if(!user){
        return res.sendStatus(401)
    }

    return res.json({
        user: isUser,
        message:  ""
    })
})

//Adding notes 
app.post("/add-note", authenticateToken, async (req,res)=>{
    try {
    const {title, content, image, isFavourite} = req.body
    const userId = req.user.user.user._id // Access nested user ID from auth token
    
    if(!title){
        return res.status(400).json({message : "Title is required"})
    }

    if(!content){
        return res.status(400).json({message : "Content is required"})
    }

    const note = new Note({
        title,
        content,
        image,
        isFavourite,
        userId: userId
    })

    await note.save()
    
    res.status(200).json({note, message : "Note Created Successfully"})

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message : "Internal Server Error"})
    }
})

//Editing notes
app.put("/edit-note/:noteId", authenticateToken, async (req,res)=>{
    try {
        const noteId = req.params.noteId

        const {title, content, image, isFavourite} = req.body
        const userId = req.user.user.user._id 

        if(!title && !content && !image){
            return res.status(400).json({message : "No Changes Provided"})
        }

        const note = await Note.findOne({_id: noteId, userId : userId})

        if(!note) {
            return res.status(404).json({message:  "Note not found"})
        }

        if(title) note.title = title
        if(content) note.content = content
        if(image) note.image = image
        if(isFavourite) note.isFavourite = isFavourite

        await note.save()

        return res.json({
            note,
            message : "Note updated successfully"
        })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message : "Internal Server Error"})
    }
})

//Getting all notes
app.get("/get-all-notes", authenticateToken, async (req,res)=>{
    try {
        const userId = req.user.user.user._id

        const notes = await Note.find({userId : userId})

        return res.json({
            notes,
            message : "All notes retrieved successfully"
        })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message : "Internal Server Error"})
    }
})

//Delete notes
app.delete("/delete-note/:noteId", authenticateToken, async (req,res)=>{
    try {
        const noteId = req.params.noteId
        const userId = req.user.user.user._id

        const note = await Note.findOne({_id: noteId, userId : userId})

        if(!note){
            return res.status(404).json({message : "Note not found"})
        }

        await Note.deleteOne({_id: noteId, userId : userId})

        return res.json({
            message : "Note deleted Successfully"
        })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message : "Internal Server Error"})
    }
})

//Update Favourites
app.put("/update-note-favourite/:noteId", authenticateToken, async (req,res)=>{
    try {
        const noteId = req.params.noteId

        const {isFavourite} = req.body

        const userId = req.user.user.user._id 

        const note = await Note.findOne({_id: noteId, userId : userId})

        if(!note) {
            return res.status(404).json({message:  "Note not found"})
        }

       
        note.isFavourite = isFavourite

        await note.save()

        return res.json({
            note,
            message : "Note updated successfully"
        })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message : "Internal Server Error"})
    }
})

app.listen(8000)

module.exports = app;