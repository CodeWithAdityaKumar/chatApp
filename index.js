const express = require("express");
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const {v4 : uuidv4} = require("uuid")
const path = require("path");
const { log } = require("console");


app.use(express.static("public"));

app.get("/", function(req,res){
    res.redirect(`/chat/${uuidv4()}`)
    // res.sendFile(__dirname + "/views/index.html")
})


app.get("/chat/:room", function(req,res){
    res.sendFile(__dirname + "/views/index.html")
})

let users = 0
let userName = ""


io.on("connection",function(socket){
    console.log("user connected");

    users++
    console.log(users);

    socket.emit("totalUsers", users)
    socket.broadcast.emit("totalUsers", users)

    socket.on("newUser", function(data){
        socket.broadcast.emit("getMsg", data)

        userName = data.userName

    })

    // socket.broadcast.emit("newUser" )

    

    socket.on("sendMsg", function(data){

        socket.broadcast.emit("getMsg", data)

        // console.log(data);
    })


    socket.on("disconnect", function(data){
        console.log("User Disconnected");

        users--

        socket.emit("totalUsers", users)
        socket.broadcast.emit("totalUsers", users)

        // console.log(userName);

       
            socket.broadcast.emit("userLeft", {
                userName : userName,
                message: "Disconnected!"
            })
    
        
    })
})



server.listen(3000)