const socket = io();

const chatboxUl = document.querySelector(".chatbox-ul");
const chatbox = document.querySelector(".chatbox");
const msginp = document.querySelector("#msg");
const form = document.querySelector("form");



socket.emit('join-room', ROOM_ID)

let msgliappend = (user, message, time, position) => {


  if(position === "left"){
    let ting = new Audio("/music/ting.mp3")
    ting.play();
  }



  let msgLi = document.createElement("li");
  let messageContainer = `
    
                <div>
                    <p class="user">${user}</p>
                    <p class="message">
                        ${message}
                    </p>
                    <p class="time">${time}</p>
                </div>

    `;

  msgLi.innerHTML = messageContainer;
  msgLi.classList.add(position);
  chatboxUl.appendChild(msgLi);

  

  chatbox.scrollTo(0, document.querySelector(".chatbox").scrollHeight);


};

// let userName = prompt("Please enter Your Name : ");

let userName;


let LSuserName = localStorage.getItem("userName")

if (LSuserName) {

    userName = LSuserName

}else{

    userName = prompt("Please enter Your Name : ");


    while(userName === null || userName === ""){
        userName = prompt("Please enter Your Name : ");
    }

    
    localStorage.setItem("userName", userName)
}


// console.log(time);

let date = new Date();

let hour = date.getHours();
let minute = date.getMinutes();
let ampm;

if (hour >= 12) {
  ampm = "PM";
  hour = hour - 12;

  if (hour === 0) {
    ampm = "PM";
    hour = 12;
  }

  if (hour < 10) {
    hour = "0" + hour;
  }
} else {
  ampm = "AM";
}

if (minute < 10) {
  minute = "0" + minute;
}

let time = `${hour}:${minute} ${ampm}`;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let date = new Date();

  let hour = date.getHours();
  let minute = date.getMinutes();
  let ampm;

  if (hour >= 12) {
    ampm = "PM";
    hour = hour - 12;

    if (hour === 0) {
      ampm = "PM";
      hour = 12;
    }

    if (hour < 10) {
      hour = "0" + hour;
    }
  } else {
    ampm = "AM";
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  let time = `${hour}:${minute} ${ampm}`;

  let data = {
    userName: userName,
    message: msginp.value,
    time: time,
  };

  msgliappend("You", data.message, data.time, "right");

  socket.emit("sendMsg", data);

  msginp.value = "";
//   window.scrollTo(0, document.body.scrollHeight);
});

socket.on("getMsg", function (data) {
  let ting = new Audio("/music/ting.mp3")

    ting.play();
  

  msgliappend(data.userName, data.message, data.time, "left");
  window.scrollTo(0, document.body.scrollHeight);
});
socket.on("userLeft", function (data) {
  msgliappend(data.userName, data.message, time, "left");
});

socket.emit("newUser", {
  userName: userName,
  message: "Connected!",
  time: time,
});

socket.on("newUser", function (data) {
  msgliappend(data.userName, data.message, data.time, "left");
});

// socket.on("totalUsers", function (data) {
//   let onlineUsers = document.querySelector(".onlineUsers");

//   console.log(data);

//   onlineUsers.innerHTML = `
//     Online Users : ${data}
//     <div class="blink"></div>
//     `;
// });

// msgliappend("Aditya" , "Hello" , "01:30 PM" , "right")
// msgliappend("Aditya" , "Hii" , "01:30 PM" , "right")
