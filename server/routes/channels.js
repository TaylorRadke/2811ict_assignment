module.exports = function(app,fs){
    
    //returns a list of channels in a specified group
    app.get('/api/:group/channels',function(req,res){

        var group = req.params.group;
        var channels = [];
        dbo.collection("channels").find({"group_name":group}).toArray(function(err,data){
            if (err) throw err;
            else{
                data.foreach(function(element){
                    channels.push(element.channel_name);
                })
            }
        })
    })

    //Get a list of users in a channel
    app.get('/api/:group/:channel/users',function(req,res){
        
        var group = req.params.group;
        var channel = req.params.channel;

        dbo.collection("channels").findOne({$and:[{"group_name":group},{"channel_name":channel}]},function(err,data){
            if (err) throw err;
            else {
                console.log(data);
                res.send({"group":group,"channel":channel,"users":data.users});
            }
        })
    })

    //Create a new channel in a group
    app.post('/api/groups/channels',function(req,res){
        var group = req.body.group;
        var channel = req.body.channel;
        var createdChannel = false;

        dbo.collection("channels").findOne({$and:[{"group_name":group},{"channel_name":channel}]},function(err,result){
            if (err) throw err;
            else {
                if (result == null){
                    dbo.collection("channels").insertOne({
                        "group_name":group,
                        "channel_name":channel,
                        "users":[]
                    })
                    createdChannel = true;
                }
                res.send({"group":group,"channel":channel,"created_channel":createdChannel});
            }
        })
    })

    //add a user to a channel
    app.post('/api/groups/channels/users',function(req,res){
        var username = req.body.username;
        var group = req.body.group;
        var channel = req.body.channel;

    })

    //delete a user from a channel
    app.delete('/api/:group/:channel/:user',function(req,res){
        var group = req.params.group;
        var channel = req.params.channel;
        var user = req.params.user;
        var userDeleted = false;
    })

    //delete a channel
    app.delete('/api/:group/:channel',function(req,res){
        var group = req.params.group;
        

        var channel= req.params.channel;
    
    })

    //Get a list of channels a user is in for all groups
    app.get('/api/groups/:user/channels',function(req,res){
        var username = req.params.user;
        var userExists = false;
        var userInChannels = [];
    });
}   