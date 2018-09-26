const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoDB = require("mongodb").MongoClient;
const URL = "mongodb://localhost:27017/mydb";

//Apply middleware to app
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname,'../app-chat/dist/app-chat/')));

MongoDB.connect(URL,function(err,db){
    if (err) throw err;
    dbo = db.db('Chat_app_db');
    console.log("Connected to db");
    require('./routes/users')(app,dbo);
    require("./routes/groups")(app,dbo);
    require('./routes/channels.js')(app,dbo);

    //Start server on port 3000;
    http.listen(3000,function(){
        console.log("Server listening on port 3000");
    });
});


//Wild card route for if the user enters an invalid url for server, serves frontend
// app.all('*',function(req,res){
//     res.sendFile(path.join(__dirname,"../app-chat/dist/app-chat/index.html"));
// })