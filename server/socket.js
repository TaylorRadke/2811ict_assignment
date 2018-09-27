module.exports = function(app,io){
    io.on('connection',function(socket){
        console.log("user connected");

        socket.on('disconnect',function(){
            console.log("user disconnected");
        })

        socket.on("add-message",function(message){
            io.emit('add-message',{"text":message});
        })       
    })
}