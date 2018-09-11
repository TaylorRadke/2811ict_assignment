const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Apply middleware to app
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../app-chat/dist/app-chat/')));

//Create the file on server start which writes the initial super user with super user permissions
//If the there is an error such as the file not existing
fs.readFile('./resources/users.json','utf-8',function(err){
    if (err){
        fs.writeFile('./resources/users.json',JSON.stringify([{'username':'super','permissions':"super"}]));
    }
});

//Create the file on server start which writes initial empty array of groups if there is an error
fs.readFile('./resources/groups.json','utf-8',function(err){
    if (err){
        fs.writeFile('./resources/groups.json',JSON.stringify([]),{encoding:'utf-8'});
    }
});

require('./routes/users')(app,fs);
require("./routes/groups")(app,fs);
require('./routes/channels.js')(app,fs);

//Start server on port 3000;
http.listen(3000);

//Wild card route for if the user enters an invalid url for server, serves frontend
app.all('*',function(req,res){
    res.sendFile(path.join(__dirname,"../app-chat/dist/app-chat/index.html"));
})