const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const formidable = require('formidable');
const MongoDB = require("mongodb").MongoClient;
const URL = "mongodb://localhost:27017/mydb";

//Apply middleware to app
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/images',express.static(path.join(__dirname,'./userImages')));
app.use(express.static(path.join(__dirname,'../app-chat/dist/app-chat/')));


MongoDB.connect(URL,function(err,db){
    if (err) throw err;
    dbo = db.db('Chat_app_db');

    require('./routes/users')(app,dbo,formidable);
    require("./routes/groups")(app,dbo);
    require('./routes/channels.js')(app,dbo);
    require('./socket.js')(app,io,dbo);
    require('./routes/index.js')(app,path);
    http.listen(3000,function(){
        console.log("Server listening on port 3000");
    });
});

module.exports = app;


