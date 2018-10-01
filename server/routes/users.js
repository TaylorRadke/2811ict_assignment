module.exports = function(app,dbo,formidable){
    //Get the permissions of a user
    app.get("/api/:username/permissions",function(req,res){
        var uname = req.params.username;
        dbo.collection("users").findOne({"username":uname},function(err,result){
            if (err) console.log(err);
            res.send({"username":result.username, "permissions":result.permissions});
        });
    })

    //Change the permissions of a user
    app.post("/api/users/permissions",function(req,res){
        var userModifyPermissions = req.body.username;
        var newPermissions = req.body.permissions;
        var updatedPermissions = false;
        dbo.collection("users").updateOne({"username":userModifyPermissions},{
            $set:{"permissions":newPermissions}
        },function(err,result){
            if (err) console.log(err);
            else{
                if (result.modifiedCount){
                    updatedPermissions = true;
                }
                res.send({"user":userModifyPermissions,"permissions":newPermissions,"success":updatedPermissions});
            }
        });   
    })

    //Add a new user
    app.post('/api/users',function(req,res){
        
        var uname = req.body.username;
        var password = req.body.password;
        console.log(password)
        dbo.collection("users").findOne({"username":uname},function(err,result){
            if (err) console.log(err);
            else{
                if (result == null){
                    dbo.collection("users").insertOne({"username":uname,"password":password,"avatar":"generic-avatar.png"},function(err,result){
                        if (err) console.log(err);
                        else res.send({"success":true});
                    });
                }else{
                    res.send({"success":false});
                }
            }
        })

    })

    //Get a list of all users
    app.get('/api/users',function(req,res){
        dbo.collection("users").find({}).toArray(function(err,result){
            if (err) console.log(err);
            var users = [];
            result.forEach(function(element){
                users.push({"username":element.username,"image":element.avatar});
            });
            res.send({"users":users});
        })
    })

    //Login as a user which has been created
    app.post('/api/users/login',function(req,res) {
        var username = req.body.username;
        var password = req.body.password;
        var authLogin = false;
        dbo.collection("users").findOne({"username":username},function(err,result){
            if (err) throw err;
            else{
                if (result != null && result.password == password){
                    authLogin = true;
                }
                res.send({"user":username, "authlogin":authLogin});
                
            }
        })
    })

    //delete a user from the list of users 
    app.delete('/api/users/:username',function(req,res){
        
        var user = req.params.username;
        
       dbo.collection("users").deleteOne({"username":user},function(err,result){
            if (err) throw err;
            else {
                res.send({"ok":Boolean(result.result.n)});
            }
        });
    });

    //upload user avatar(image)
    app.post('/api/user/image/upload',function(req,res){
        var form = new formidable.IncomingForm({uploadDir:'./userImages'});

        form.keepExtensions = true;

        form.on('error',function(err){
            throw err;
            res.send({
                result:"failed",
                data:{},
                numberOfImages:0,
                message:"Cannot upload images. Error is " + err
            });
        })

        form.on('fileBegin',function(name,file){
            file.path = form.uploadDir + '/' + file.name;
        })
        
        form.on('file',function(field,file){
            res.send({
                result:"ok",
                data:{'filename':file.name,'size':file.size},
                message:"upload successful"
            });
        })
        form.parse(req);
    });

    //Add user image name to db
    app.post('/api/user/image/name',function(req,res){
        var username = req.body.username;
        var img_name = req.body.image;

        dbo.collection("users").updateOne({"username":username},{
            $set:{"avatar":img_name}
        },function(err){
            if (err) throw err;
            res.send({"set-image":true});
        })
    })
}