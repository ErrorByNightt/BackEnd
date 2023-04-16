const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8080;
const io = require('socket.io')(server,{cors: {origin: "*"}});

//app.engine('ejs', require('ejs').renderFile);
app.set("view engine", "ejs");

//Route
app.get("/home", (req,res) => {
    res.render("home");
});

server.listen(port, ()=>{
    console.log('app listening on port',port);
});

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id); 

    socket.on("message", (data) => {
        socket.broadcast.emit('message', data)
    });
});