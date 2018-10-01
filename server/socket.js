module.exports = function(app,io,dbo){

    io.on('connection',function(socket){
        var channel;
        var group;
        var user;
        var roomChannel;
        
        function getMessages(){
            dbo.collection("channels").findOne({$and:[{"group_name":group},{"channel_name":channel}]},function(err,data){
                if (err) throw err;
               
                else {
                    io.to(roomChannel).emit("messages",{"messages":data.messages});
                    io.to(roomChannel).emit("message",{"message":{"text":user+" joined the channel.","type":"announcement"}});
                }
            }) 
        }
    
        function addMessage(message){
            dbo.collection("channels").updateOne({$and:[{"channel_name":channel},{"group_name":group}]},
            {
                $push:{"messages":message}
            })
        }

        socket.on('join',function(room){
            channel = room.channel;
            group = room.group;
            roomChannel = group+"_"+channel;
            user = room.user;
            socket.join(roomChannel);
            getMessages();
        });

        socket.on('leave',function(){
            io.to(roomChannel).emit("message",{"message":{"text":user + " left the channel","type":"announcement"}});
            socket.leave(roomChannel);
        });

        socket.on("message",function(message){
            addMessage(message);
            io.to(roomChannel).emit("message",{"message":message});
        })

        socket.on("new_update",function(){
            io.emit("updated");
        })
    });

    
}