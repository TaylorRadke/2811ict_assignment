module.exports = function(app,path){
    // //Wild card route for if the user enters an invalid url for server, serves frontend
    app.all('*',function(req,res){
        res.sendFile(path.join(__dirname,"../../app-chat/dist/app-chat/index.html"));
    });
}