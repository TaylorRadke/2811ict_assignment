module.exports = function(app,io,dbo){
    io.on('connection',function(socket){
        var channel;
        var group;
        var user;
        var roomChannel;
        socket.on("add-message",function(message){
            addMessage(channel,group,message);
            getMessages(channel,group);
        });
        
        socket.on('join',function(room){
            channel = room.channel;
            group = room.group;
            roomChannel = group+"_"+channel;
            user = room.user;
            console.log("["+roomChannel+"] " + user + " has joined.");
            socket.join(channel);
            getMessages(channel,group);
        });

        socket.on('leave',function(){
            console.log("["+roomChannel+"] "+ user + " left the channel.");
            socket.leave(roomChannel);
        });
    });

    function getMessages(channel,group){
        dbo.collection("channels").findOne({$and:[{"group_name":group},{"channel_name":channel}]},function(err,data){
            if (err) throw err;
            //io.to(roomChannel).emit("messages",data.messages);
        })
    }

    function addMessage(channel,group,message){
        dbo.collection("channels").updateOne({$and:[{"channel_name":channel},{"group_name":group}]},
    {
        $push:{"messages":message}
    })
    }
    
}