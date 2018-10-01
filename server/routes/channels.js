module.exports = function(app,dbo){
    
    //returns a list of channels in a specified group
    app.get('/api/:group/channels',function(req,res){

        var group = req.params.group;
        var channels = [];
        dbo.collection("channels").find({"group_name":group}).toArray(function(err,data){
            if (err) throw err;
            else{
                data.forEach(function(element){
                    channels.push(element.channel_name);
                });
                res.send({"group":group,"channels":channels});
                
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
                        "users":[],
                        "messages":[]
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
        userAdded = false;
        dbo.collection("channels").findOne({$and:[{"group_name":group},{"channel_name":channel},{"users":username}]},
        function(err,result){
            if (err) throw err;
            else{
                if (result == null){
                    dbo.collection("channels").updateOne({"group_name":group,"channel_name":channel},
                    {
                        $push:
                        {
                            "users":username
                        }});
                        userAdded = true;
                }
                res.send({"group":group,"channel":channel,"user":username,"user_added":userAdded});
            }
        })
    })

    //delete a user from a channel
    app.delete('/api/:group/:channel/:user',function(req,res){
        var group = req.params.group;
        var channel = req.params.channel;
        var user = req.params.user;
        var userDeleted = false;

        dbo.collection("channels").updateOne(
            {$and:[{"channel_name":channel},{"group_name":group}]},
            {$pull:{"users":user}},function(err,result){
                if (err) throw err;
                else{
                    res.send({"group":group,"channel":channel,"user":user,"user_removed":Boolean(result.modifiedCount)});
                }
        });
    })

    //delete a channel
    app.delete('/api/:group/:channel',function(req,res){
        var group = req.params.group;
        var channel= req.params.channel;
        var channel_deleted = false;

        dbo.collection("channels").deleteOne({"group_name":group,"channel_name":channel},function(err,result){
            if (err) throw err;
            else{
                if (result.deletedCount) channel_deleted = true;

                res.send({"group":group,"channel":channel,"channel_deleted":channel_deleted});
            }
        });
    })

    //Get a list of channels a user is in for all groups
    app.get('/api/groups/:user/channels',function(req,res){
        var username = req.params.user;
        var userInChannels = [];

        dbo.collection("channels").find().toArray(function(err,data){
            if (err) throw err;
            else{
                data.forEach(function(element){
                    element.users.forEach(function(user){
                        if (username == user){
                            userInChannels.push(element.group_name);
                        }
                    })
                });
                
                res.send({"user":username,"groups":userInChannels});
            }
        })
    });
}   