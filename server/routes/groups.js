module.exports = function(app,dbo){

    //Create a new group
    app.post('/api/groups',function(req,res){
        var group = req.body.group;
        var groupExists = false;

        dbo.collection("groups").findOne({"group_name":group},function(err,result){
            if (err) throw err;
            else{
                if (result == null){
                    dbo.collection("groups").insertOne({
                        "group_name":group,
                        "users":[]
                    });
                }else{
                    groupExists = true;
                }
                res.send({"group":group,"created":!groupExists});
            }
        })
    })

    //Get a list of groups with all users and channels
    app.get('/api/groups',function(req,res){
        dbo.collection("groups").find().toArray(function(err,result){
            if (err) throw err;
            else {
                res.send({"groups":result});
            }
        })
    
    })

     //get a list of all users in a group
    app.get('/api/:group/users',function(req,res){
        var group = req.params.group;

        dbo.collection("groups").findOne({"group_name":group},function(err,result){
            if (err) throw err;
            else{
                res.send({"group":group,"users":result.users});
            }
        })
    })

    //add a user to the group
    app.post('/api/groups/users',function(req,res){
        var username = req.body.username;
        var group = req.body.group;
        var success = false;
        dbo.collection("groups").findOne({$and:[{"users":username},{"group_name":group}]},function(err,result){
            if (err) throw err;
            else {
                if (result == null){
                    
                    success = true;
                    dbo.collection("groups").updateOne({"group_name":group},{
                        $push:{
                            "users":username}
                    });
                }
                
                res.send({"group":group,"user":username, 'user_added_to_group':success});
            }
        })

    })

    //delete a group
    app.delete('/api/groups/:group',function(req,res){
        var group = req.params.group;
        var groupDeleted = false;

        dbo.collection("groups").deleteOne({"group_name":group},function(err,result){
            if (err) throw err;
            else {
                res.send({"group":group,"deleted":Boolean(result.deletedCount)});
            }
        })
    })

    //delete a user in a group
    app.delete('/api/groups/:group/:user',function(req,res){
        var group = req.params.group;
        var userToRemove  = req.params.user;
        var userHasBeenRemoved = false;
        
        dbo.collection("groups").updateOne({"group_name":group},{
            $pull:{"users":userToRemove}
        },function(err,result){
            if (err) throw err;
            
            if (result.modifiedCount){
                userHasBeenRemoved = true;
            }
            res.send({"group":group,"user":userToRemove,"user_removed":userHasBeenRemoved});
        })
    });
};
