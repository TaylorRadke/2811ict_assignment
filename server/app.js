const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const formidable = require('formidable');
const MongoDB = require("mongodb").MongoClient;

//Apply middleware to app
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/images',express.static(path.join(__dirname,'./userImages')));
app.use(express.static(path.join(__dirname,"web")));

MongoDB.connect("mongodb://mongo:27017/app-db",function(err,db){
    if (err) throw err;
    dbo = db.db("app-db");

    require('./routes/users')(app,dbo,formidable);
    require("./routes/groups")(app,dbo);
    require('./routes/channels.js')(app,dbo);
    require('./socket.js')(app,io,dbo);
    
    app.all('/*',function(req,res){
        res.sendFile(path.join(__dirname,"web","index.html"));
    });

    http.listen(3000,function(){
        console.log("Server listening on port 3000");
    });
});


