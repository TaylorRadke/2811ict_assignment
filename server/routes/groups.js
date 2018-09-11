module.exports = function(app,fs){

    //Create a new group
    app.post('/api/groups',function(req,res){
        var group = req.body.group;

        var groupObj;
        var groupExists = false;

        fs.readFile("./resources/groups.json",'utf-8',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);
            
                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                        groupExists = true;
                    }
                }
                if (!groupExists){
                    var newGroup = {"group":group,"users":[],"channels":[]};
                    groupObj.push(newGroup);
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                }
                res.send({
                    "group":group,
                    "group-exists":groupExists,
                    "success":!groupExists
                });
            }
        });
    })

    //Get a list of groups with all users and channels
    app.get('/api/groups',function(req,res){
        var groupObj;
        fs.readFile('./resources/groups.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                res.send({"groups":groupObj});
                }   
        })
    })

     //get a list of all users in a group
    app.get('/api/:group/users',function(req,res){
        var groupObj;
        var group = req.params.group;
        var users;
        var groupExists = false;

         fs.readFile('./resources/groups.json',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);
                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                        groupExists = true;
                        users = groupObj[i].users;
                    }
                }
                res.send({"group":group,"success":groupExists,"users":users});
             }
        });
    })

    //add a user to the group
    app.post('/api/groups/users',function(req,res){
        var username = req.body.username;
        var group = req.body.group;

        var groupExists = false;
        var userInGroup = false;
        var groupIndex;
        
        fs.readFile('./resources/groups.json',function(err,data){
            if (err) console.log(err);
            else{
                var groupObj = JSON.parse(data);
        
                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                         groupExists = true;
                         groupIndex = i;
                         for (let j = 0; j < groupObj[i].users.length; j++){
                             if (groupObj[i].users[j] == username){
                                 userInGroup = true;
                             }
                         }
                    }
                }

                if (groupExists && !userInGroup){
                    groupObj[groupIndex].users.push(username);
                    
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                }
                res.send({
                    "group":group,
                    "group-exists":groupExists,
                    "user":username,
                    "user-already-in-group":userInGroup,
                    "success":!userInGroup && groupExists
                });
            }
        });
    })

    //delete a group
    app.delete('/api/groups/:group',function(req,res){
        var groupObj;
        var group = req.params.group;
        var groupDeleted = false;
        fs.readFile('./resources/groups.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length; i++){
                    if (groupObj[i].group == group){
                        groupObj.splice(i,1);
                        groupDeleted = true;
                    }
                }
                if (groupDeleted){
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:'utf-8'});
                    res.send({"group":group,"success":true});
                }else{
                    res.send({"group":group,"success":false});
                }
            }
        })
    })

    //delete a user in a group
    app.delete('/api/groups/:group/:user',function(req,res){
        var groupObj;
        var userOfGroup = req.params.group;
        var userToRemove  = req.params.user;
        var userHasBeenRemoved = false;
        
        fs.readFile("./resources/groups.json",function(err,data){
            if (err) console.log(err);

            else{
                groupObj = JSON.parse(data);

                for (let i = 0; i < groupObj.length; i++){
                    //delete a user in the specified group
                    if (groupObj[i].group == userOfGroup){
                        groupExists = true;
                        for (let j = 0; j < groupObj[i].users.length; j++){
                            if (groupObj[i].users[j] == userToRemove){
                                groupObj[i].users.splice(j,1);
                                userHasBeenRemoved = true;
                            }
                        }
                        
                        //delete user in all channels of the group
                        for (let k = 0; k < groupObj[i].channels.length; k++){
                            for (let m = 0; m < groupObj[i].channels[k].users.length; m++){
                                if (groupObj[i].channels[k].users[m] == userToRemove){
                                    groupObj[i].channels[k].users.splice(m,1);
                                    userHasBeenRemoved = true;
                                }
                            }
                        }
                    }
                }

                if(userHasBeenRemoved){
                    fs.writeFile('./resources/groups.json',JSON.stringify(groupObj),{encoding:"utf-8"});
                }

                res.send({"user":userToRemove,"request":"remove","success":userHasBeenRemoved});
             }
        })
    })
};
