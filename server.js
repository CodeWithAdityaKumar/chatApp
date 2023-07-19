const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");
const path = require("path");

app.get("/", function (req, res) {
  // res.redirect(`/${uuidv4()}`)
  res.sendFile(__dirname + "/index.html");
});

// app.get("/:room", function(req,res){
//     res.send(req.params.room)
// })

let users = 0;

io.on("connection", function (socket) {
  users++;

  socket.on("new user", function (name) {
    socket.broadcast.emit("chat message", `${name} connected`);
    socket.broadcast.emit("totalUsers", `Total Users Online : ${users}`);
    socket.emit("totalUsers", `Total Users Online : ${users}`);


    socket.on("disconnect", function(){
        users--;


        socket.broadcast.emit("chat message", `${name} disconnected`);
        socket.emit("totalUsers", `Total Users Online : ${users}`);
        socket.broadcast.emit("totalUsers", `Total Users Online : ${users}`);

    })





  });





  socket.on("chat message", (msg) => {
    io.emit("chat message", `${msg.name} : ${msg.messages}`);
  });

//   socket.on("disconnect", function () {
//     users--;

//     // socket.on("new user", function (name) {
//     //   socket.broadcast.emit("chat message", `${name} disconnected`);
//     // });
//     socket.emit("totalUsers", `Total Users Online : ${users}`);
//     socket.broadcast.emit("totalUsers", `Total Users Online : ${users}`);
//   });
});

http.listen(3000);
