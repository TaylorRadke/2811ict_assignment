module.exports = function(app,io){
    app.get("/chat",function(){
        io.on('connection',function(socket){
            console.log("user connected");

            io.on('disconnect',function(){
                console.log("user disconnected");
            })
            res.send(socket);
        })
    })
}