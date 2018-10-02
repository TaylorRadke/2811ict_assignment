var supertest = require('supertest');  
var chai = require('chai');  
var uuid = require('uuid');  
var app = require('../server/app.js');

global.app = app;  
global.uuid = uuid;  
global.expect = chai.expect;  
global.request = supertest(app); 

describe('Task API Routes',function(){
  // beforeEach(function(done){
  //   app.db.object = {};
  //   app.db.tasks = [{
  //     id : uuid(),
  //     title: "study",
  //     done:false
  //   },{
  //     id : uuid(),
  //     title : "work",
  //     done : true
  //   }];
  //   app.db.write();
  //   done();
  // });

  describe('GET /api/users',function(){
    it("returns list of users",function(done){
      request.get('localhost:3000/api/users')
      .expect(200)
      .end(function(err,res){
        done(err);
      })
    })
  })
})

