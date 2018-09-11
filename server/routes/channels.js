module.exports = function(app,fs){
    
    //returns a list of channels in a specified group
    app.get('/api/:group/channels',function(req,res){
        var groupObj;
        var channels;
        var group = req.params.group;
        var groupExists = false;
        console.log(group);

        fs.readFile('./resources/groups.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length;i++){
                    if (groupObj[i].group == group){
                        groupExists = true;
                        channels = groupObj[i].channels;
                    }
                }
                res.send({"group":group,"group-exists":groupExists,"channels":channels});
            }
        });
    })

    //Get a list of users in a channel
    app.get('/api/:group/:channel/users',function(req,res){
        var users;
        var group = req.params.group;
        var channel = req.params.channel;
        var groupExists;
        var channelExists;
        var groupObj;

        fs.readFile('./resources/groups.json',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                        groupExists = true;
                        for (let j = 0; j < groupObj[i].channels.length; j++){
                            if (groupObj[i].channels[j].channel == channel){
                                channelExists = true;
                                users = groupObj[i].channels[j].users;
                            }
                        }
                    }
                }
                res.send({
                    "group":group,
                    "group-exists":groupExists,
                    "channel":channel,
                    "channel-exists":channelExists,
                    "users":users
                });
            }
        });
    })

    //Create a new channel in a group
    app.post('/api/groups/channels',function(req,res){
        var group = req.body.group;
        var channel = req.body.channel;

        var groupExists = false;
        var channelExists = false;
        
        var groupObj;
        var groupIndex;
        var createdChannel = false;

        fs.readFile("./resources/groups.json",function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                        groupExists = true;
                        groupIndex = i;
                        for (let j = 0; j < groupObj[i].channels.length; j++){
                            if (groupObj[i].channels[j].channel == channel){
                                channelExists = true;
                            }
                        }
                    }
                }
                if (groupExists && !channelExists){
                    var newChannel = {"channel":channel,"users":[]}
                    
                    groupObj[groupIndex].channels.push(newChannel);
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                    createdChannel = true;
                }
                res.send({
                    "group":group,
                    "group-exists":groupExists,
                    "channel":channel,
                    "channel-exists":channelExists,
                    "channel-created":createdChannel
                });
            }
        })
    })

    //add a user to a channel
    app.post('/api/groups/channels/users',function(req,res){
        var username = req.body.username;
        var userExists = false;
        var userInChannel = false;

        var group = req.body.group;
        var groupExists = false;
        var groupIndex;

        var channel = req.body.channel;
        var channelExists = false;
        var channelIndex;

        var userObj;
        var groupObj;

        fs.readFile('./resources/users.json',function(err,data){
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);

                for (let i = 0; i < userObj.length; i++){
                    if(userObj[i].username == username){
                        userExists = true;
                    }
                }
                if (userExists){
                    fs.readFile('./resources/groups.json',function(err,data){
                        if (err) console.log(err);
                        else{
                            groupObj = JSON.parse(data);

                            for (let i = 0; i < groupObj.length; i++){
                                if (groupObj[i].group == group){
                                    groupExists = true;
                                    groupIndex = i;
                                    for (let j = 0; j < groupObj[i].channels.length; j++){
                                        if (groupObj[i].channels[j].channel == channel){
                                            channelIndex = j;
                                            channelExists = true;
                                            for (let k = 0; k < groupObj[i].channels[j].users.length; k++){
                                                if (groupObj[i].channels[j].users[k] == username){
                                                    userInChannel = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (!userInChannel){
                                groupObj[groupIndex].channels[channelIndex].users.push(username);

                                fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                            }
                            res.send({
                                "group":group,
                                "group-exists":groupExists,
                                "channel":channel,
                                "channel-exists":channelExists,
                                "user":username,
                                "user-exists":userExists,
                                "user-added-to-channel":!userInChannel
                            });
                        }
                    })
                }
            }
        })



    })

    //delete a user from a channel
    app.delete('/api/:group/:channel/:user',function(req,res){
        var group = req.params.group;
        var groupExists = false;

        var channel = req.params.channel;
        var channelExists = false;

        var user = req.params.user;
        var userDeleted = false;

        var groupObj;

        fs.readFile('./resources/groups.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group = group){
                        groupExists = true;
                        for (let j = 0; j < groupObj[i].channels.length; j++){
                            if (groupObj[i].channels[j].channel == channel){
                                channelExists = true;
                                for (let k = 0; k < groupObj[i].channels[j].users.length; k++){
                                    if (groupObj[i].channels[j].users[k] == user){
                                        groupObj[i].channels[j].users.splice(k,1);
                                        userDeleted = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (userDeleted){
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                }
                res.send({
                    "group":group,
                    "group-exists":groupExists,
                    "channel":channel,
                    "channel-exists":channelExists,
                    "user":user,
                    "user-deleted":userDeleted
                });
            }
        })
    })

    //delete a channel
    app.delete('/api/:group/:channel',function(req,res){
        var group = req.params.group;
        var groupExists = false;

        var channel= req.params.channel;
        var channelExists = false;
        var channelRemoved = false;

        var groupObj;
        
        fs.readFile('./resources/groups.json',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                        groupExists = true;
                        
                        for (let j = 0; j < groupObj[i].channels.length; j++){
                            
                            if (groupObj[i].channels[j].channel == channel){
                                channelExists = true;
                                groupObj[i].channels.splice(j,1);
                                channelRemoved = true;
                            }
                        }
                    }
                }

                if (channelRemoved){
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                }
                
                res.send({
                    "group":group,
                    "group-exists":groupExists,
                    "channel":channel,
                    "channel-exists":channelExists,
                    "channel-removed":channelRemoved
                });
            }
        })
    })

    //Get a list of channels a user is in for all groups
    app.get('/api/groups/:user/channels',function(req,res){
        var username = req.params.user;
        var userExists = false;
        var userInChannels = [];
        var userObj;
        var groupObj;

        fs.readFile('./resources/users.json',function(err,data){
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);
                console.log(username);
                for (let i = 0; i < userObj.length; i++){
                    if (userObj[i].username == username){
                        userExists = true;
                    }
                }

                if (userExists){
                    fs.readFile('./resources/groups.json',function(err,data){
                        if (err) console.log(err);
                        else{
                            groupObj = JSON.parse(data);

                            for (let i = 0; i < groupObj.length; i++){
                                for (let j = 0; j < groupObj[i].channels.length; j++){
                                    for (let k = 0; k < groupObj[i].channels[j].users.length; k++){
                                        if (groupObj[i].channels[j].users[k] == username){
                                            userInChannels.push(groupObj[i]);
                                        }
                                    }
                                }
                            }
                            res.send({
                                "user":username,
                                "groups":userInChannels
                            });
                        }    
                    });
                }
            }
        })

    })
}   