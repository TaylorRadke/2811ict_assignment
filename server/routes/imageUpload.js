const formidable = require('formidable');

module.exports = function(app,path,frm){
    app.post('/api/user/image',function(req,res){
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
    })
}