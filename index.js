const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { log } = require("console");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.redirect(`/chat/${uuidv4()}`);
  // res.sendFile(__dirname + "/views/index.html")
});

app.get("/chat/:room", function (req, res) {
  // console.log(req.params.room);
  res.render("chat", { roomId: req.params.room });
});

let userName = "";
// let users = 0;
// let room_id = "";


io.on("connection", function (socket) {

    
    

  

  socket.on("join-room", (roomId) => {
    
    socket.join(roomId);
    // users++;

    // socket.to(room_id).emit("totalUsers", users)

    // console.log(roomId);

    // room_id = roomId


    // io.in(roomId).allSockets().then(res=>{

    //     console.log(res.size) 
    //     // console.log(typeof(res.size));
    //     users = res.size;
    //     // socket.to(room_id).emit("totalUsers", users)

    // })
    

    // socket.to(roomId).emit("totalUsers", users);
    // socket.to(roomId).broadcast.emit("totalUsers", users)
    // socket.broadcast.to(roomId).emit("totalUsers", users);
    // socket.to(roomId).emit("totalUsers", users)

    socket.on("newUser", function (data) {
      // socket.to(roomId).broadcast.emit("getMsg", data)
      socket.broadcast.to(roomId).emit("getMsg", data);
      // socket.to(roomId).emit("getMsg", data)

      userName = data.userName;
    });

    // socket.broadcast.emit("newUser" )

    socket.on("sendMsg", function (data) {
      // socket.to(roomId).broadcast.emit("getMsg", data)
      socket.broadcast.to(roomId).emit("getMsg", data);
      // socket.to(roomId).emit("getMsg", data)

      // console.log(data);
    });

    socket.on("disconnect", function (data) {
    //   console.log("User Disconnected");
    //   socket.leave(roomId);

    //   users--;

    //   socket.to(roomId).emit("totalUsers", users)
    //   socket.broadcast.to(roomId).emit("totalUsers", users);
      // socket.broadcast.emit("totalUsers", users)

      // console.log(userName);

      // socket.to(roomId).broadcast.emit("userLeft", {
      //     userName : userName,
      //     message: "Disconnected!"
      // })

      socket.broadcast.to(roomId).emit("userLeft", {
        userName: userName,
        message: "Disconnected!",
      });
    });
  });


  
//   socket.emit("totalUsers", users)

//   console.log(users);
//   console.log(room_id);




  


});

server.listen(3000);
