module.exports = function(app,fs){
    //Get the permissions of a user
    app.get("/api/:username/permissions",function(req,res){
        var userObj;
        var permissions;
        var uname = req.params.username;
        var userExists = false;
        fs.readFile('./resources/users.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);
                for (let i = 0; i < userObj.length;i++ ){
                    if(userObj[i].username == uname){
                        userExists = true;
                        permissions = userObj[i].permissions;
                    }
                }
                res.send({"permissions":permissions,"success":userExists});
                
            }
        });
    })

    //Change the permissions of a user
    app.post("/api/users/permissions",function(req,res){
        var userRequestingModify = req.body.fromUser;
        var userModifyPermissions = req.body.changeUser;
        var newPermissions = req.body.permissions;
        var userObj;

        fs.readFile("./resources/users.json",'utf-8',function(err,data){
            var userHasModificationPermissions = false;
            var changedPermissions = false;
            var currPermissions;

            
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);
                
                for (let i = 0; i < userObj.length; i++){
                    if (userObj[i].username == userRequestingModify){
                        if (userObj[i].permissions == "super" || userObj[i].permissions == "group"){
                            userHasModificationPermissions = true;
                        }
                    }
                }

                if (userHasModificationPermissions){
                    for (let i = 0; i < userObj.length; i++){
                        if (userObj[i].username == userModifyPermissions){
                            currPermissions = userObj[i].permissions;
                            userObj[i].permissions = newPermissions;
                            changedPermissions = true;
                        }
                    }

                    if (changedPermissions){
                        fs.writeFile('./resources/users.json',JSON.stringify(userObj),{encoding:'utf-8'});
                        res.send({"username":userModifyPermissions,"permissions":newPermissions,"changed":true});
                    }else{
                        res.send({"username":userModifyPermissions,"permissions":currPermissions,"changed":false});
                    }
                }else{
                    res.send({"username":userRequestingModify,"error":"User does not have permission to modify"});
                }    
            }
        });
    })

    //Add a new user
    app.post('/api/users',function(req,res){
        var userObj;
        var uname = req.body.username;
        var email = req.body.email;
        var userExists = false;
        
        fs.readFile('./resources/users.json','utf-8',function(err,data){
            if (err){
                console.log(err);
            }else{
                
                userObj = JSON.parse(data);
                for (var i = 0; i < userObj.length; i++){
                    if (userObj[i].username == uname){
                        userExists = true;
                    }
                }
                if(!userExists){
                    var newUser = {"email":email,"username":uname};
                    userObj.push(newUser);
                    fs.writeFile("./resources/users.json",JSON.stringify(userObj),{encoding:'utf-8'});
                }
                res.send({
                    "username":uname,
                    "email":email,
                    "success":!userExists
                });
            }
        })
    })

    //Get a list of all users
    app.get('/api/users',function(req,res){
        fs.readFile('./resources/users.json','utf-8',function(err,data){
            var userObj;
            var users= [];
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);

                for (let i = 0; i < userObj.length; i++){
                    users.push(userObj[i].username);
                }

                res.send({"users":users});
            }
        })
    })

    //Login as a user which has been created
    app.post('/api/users/login',function(req,res) {
        var username = req.body.username;
        var userObj;
        var authLogin = false;

        fs.readFile('./resources/users.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);

                for (let i = 0; i < userObj.length; i++){
                    if ((userObj[i].username == username) && (!userObj[i].loggedin || userObj[i].loggedin === "undefined")){
                        userObj[i].loggedin = true;
                        authLogin = true;
                    }
                }
                res.send({"username":username,"authlogin":authLogin});
            }
        })
    })

    //User logout, does not delete user from list of users
    app.post('/api/users/logout',function(req,res){
        var username = req.body.username;
        var userObj;
        var successfulLogout = false;

        fs.readFile('./resources/users.json','utf-8',function(err,data){
            if (err) console.log(err);
            else{
                userObj = JSON.parse(data);

                for (let i = 0; i < userObj.length; i++){
                    if (userObj[i].username == username){
                        successfulLogout = true;
                    }
                }
                res.send({"user":username,"request":"logout","success":successfulLogout});
            }
        });
    })

    //delete a user from the list of users and all groups and channels that the user is in 
    app.delete('/api/users/:username',function(req,res){
        var userExists = false;
        var userObj;
        var groupObj;
        var user = req.params.username;

        fs.readFile('./resources/users.json',function(err,data){
            if (err) console.log(err);
            else{

                userObj = JSON.parse(data);

                for (let i = 0; i < userObj.length; i++){
                    if (userObj[i].username == user){
                        userObj.splice(i,1);
                        userExists = true;
                    }
                }

                if(userExists){
                    fs.writeFile('./resources/users.json',JSON.stringify(userObj),{encoding:'utf-8'});
                    fs.readFile('./resources/groups.json',function(err,data){
                        if (err) console.log(err);
                        else{
                            groupObj = JSON.parse(data);
                            
                            for (let i = 0; i < groupObj.length; i++){
                                for (let j = 0; j < groupObj[i].users.length; j++){
                                    //delete user in groups
                                    if (groupObj[i].users[j] == user){
                                        groupObj[i].users.splice(j,1);
                                    }
                                }
                                for (let k = 0; k < groupObj[i].channels.length; k++){
                                    //delete user in channels
                                    for (let m = 0; m < groupObj[i].channels[k].users.length; m++){
                                        if (groupObj[i].channels[k].users[m] == user ){
                                            groupObj[i].channels[k].users.splice(m,1);
                                        }
                                    }
                                }
                            }
                            fs.writeFile("./resources/groups.json",JSON.stringify(groupObj),{encoding:'utf-8'});
                            res.send({"user":user,"request":"remove","success":true});
                        }
                    });
                }else{
                    res.send({"user":user,"request":"remove","success":false,"error":"user does not exist"});
                }
            }
        })
    })
}