module.exports = function(app,io){
    io.on('connection',function(socket){
        

        socket.on('disconnect',function(){
            
        })

        socket.on("add-message",function(message){
            io.emit('add-message',{"text":message});
        })       
    })
}