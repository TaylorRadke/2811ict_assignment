module.exports = function(app,io,dbo){

    io.on('connection',function(socket){
        var channel;
        var group;
        var user;
        var roomChannel;

        function getMessages(){
            dbo.collection("channels").findOne({$and:[{"group_name":group},{"channel_name":channel}]},function(err,data){
                if (err) throw err;
                else io.to(group+"_"+channel).emit("messages",{"messages":data.messages});
            }) 
        }
    
        function addMessage(message){
            dbo.collection("channels").updateOne({$and:[{"channel_name":channel},{"group_name":group}]},
            {
                $push:{"messages":message}
            })
        }

        socket.in(roomChannel).on("add-message",function(message){
            addMessage(message);
            getMessages();
        });
        
        socket.on('join',function(room){
            channel = room.channel;
            group = room.group;
            roomChannel = group+"_"+channel;
            user = room.user;

            socket.join(roomChannel);
            addMessage({"text":user + " joined the channel.","type":"announcement"});
            getMessages()
        });

        socket.on('leave',function(){
            addMessage({"text":user + " left the channel"});
            socket.leave(roomChannel);
        });

        socket.on("message",function(message){
            addMessage(message);
            io.to(roomChannel).emit("newMessage",{"message":message});
        })
    });

    
}