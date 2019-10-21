//Require express dependencies
var express = require('express');

//Require module of student from student.js file
var studentModel = require('../modules/student');

//Require login module of Students
var singupModel=require('../modules/signup');

//creat a object of route
var router = express.Router();

//query for find result from collection
var student=studentModel.find({});




// start routing.... 

router.get('/',function(req,res,next){
  res.render('index',{title:'Student Records', username:''});
})


router.get('/show', function(req, res, next) {

  //execute object student to fetch data
  student.exec(function(err,data){
      if(err) throw err;   //throw err if occur
        res.render('show', { title: 'Student Records',records:data}); //render data for ejs page
      
  });
  
});

//route for Login page

router.get('/login',function(req,res,next){

  res.render('login',{title:'Student Records',msg:''})
})

router.post('/login',function(req,res,next){
 
    var email=req.body.email;
    var password=req.body.password;

    var loginFilter = singupModel.findOne({$and:[{email:email},{password:password}]});
    loginFilter.exec(function(err,data){
      if(err)throw err;
      else
      { 
        if(data !==null){
        var user = data.name;
        res.render('index',{title:'Student Records',username:user})
      }
      else{
        var msg = 'Invalid Username/Password' 
        res.render('login',{title:'Student Records',msg:msg})
        
      }
    }
    })
  
})


//route for signup page
router.get('/signup',function(req,res,next){

  res.render('signup',{title:'Student Records'})
})


router.post('/signup',function(req,res,next){
  var signupDetails = new singupModel({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
  })
  signupDetails.save(function(err,res1){
    if(err) throw err;
    res.render('login', { title: 'student Records',msg:''});
  })
})


router.get('/insert',function(req,res,next){

  res.render('insert',{title:'Student Records'})
})



module.exports = router;
