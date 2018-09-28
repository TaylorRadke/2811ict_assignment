module.exports = function(app,io,dbo){
    io.on('connection',function(socket,namespace){
        var channel;
        var user;
        console.log("user connected");

        socket.on('disconnect',function(){
            console.log("user disconnected");
        })

        socket.on("add-message",function(message){
            console.log("["+channel+"] " + message.user + ": " + message.text);
            //io.to(channel).emit('add-message',{"message":message});
        });
        
        socket.on('join',function(room){
            channel = room.room;
            user = room.user;
            console.log("["+channel+"] " + user + " has joined.");
            socket.join(channel);
        });

        socket.on('leave',function(){
            console.log(user + " left the channel "+ channel);
            socket.leave(channel);
        });
    })
}