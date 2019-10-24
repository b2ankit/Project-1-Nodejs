//Require express dependencies
var express = require('express');


//Require jsonwebtoken
var jwt = require('jsonwebtoken');

//Require node localStorage npm
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//Require module of student from student.js file
var studentModel = require('../modules/student');

//Require login module of Students
var singupModel=require('../modules/signup');

//creat a object of route
var router = express.Router();

//query for find result from collection
var student=studentModel.find({});

/* Defining Middleware .........*/

function checkLoginUser(req,res,next){
  var usertkn = localStorage.getItem('userToken');
  try{
    jwt.verify(usertkn,'LoginToken');
  }
  catch(err){
    res.redirect('/');
  }
  next();
}







// start routing.... 

router.get('/',function(req,res,next){
  res.render('index',{title:'Student Records', username:''});
})


router.get('/show',checkLoginUser, function(req, res, next) {

  //execute object student to fetch data
  student.exec(function(err,data){
      if(err) throw err;   //throw err if occur
        res.render('show', { title: 'Student Records',records:data,showmsg:''}); //render data for ejs page
      
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
        var id = data.id;

        //start the token
        var token = jwt.sign({userId:id},'LoginToken');

        //save signin Token in local Storage
        localStorage.setItem('userToken',token);

        //Save login username in Local Storage
        localStorage.setItem('loginUser',user);
        // res.render('index',{title:'Student Records',username:user})
        res.redirect('/');
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
    var msg = 'Sign Up Done Plzz login'
    res.render('login', { title: 'student Records',msg:msg});
  })
})


router.get('/insert',checkLoginUser,function(req,res,next){

  res.render('insert',{title:'Student Records'})
})



router.post('/insert',checkLoginUser,function(req,res,next){
  var studentDetails = new studentModel({
    name: req.body.name,           //take value from ejs view from
    email:req.body.email,
    class:req.body.class,
    gender:req.body.gender,
    contact:req.body.contact, 

  });

    studentDetails.save(function(err,res1){
      if(err) throw err;
      student.exec(function(err,data){
        res.render('show',{title:'Student Records',records:data,showmsg:'Record inserted Sucessfully'});
      })
      
    })


})


//router for search
router.post('/search',checkLoginUser,function(req,res,next){
  var searchname = req.body.name;
  console.log(searchname);
  var filterstudent = studentModel.find({name:searchname});
  filterstudent.exec(function(err,data){
    if(err) throw err;
    res.render('show', { title: 'Student Records',records:data,showmsg:''});
  })
})


//route for delete
router.get('/delete/:id',checkLoginUser,function(req,res,next){
  var id = req.params.id;
  var del=studentModel.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err;
    student.exec(function(err,data){
      if(err) throw err;
      res.render('show', { title: 'Student Records',records:data,showmsg:''});
    });
  })

});




//route to edit .js page
router.get('/edit/:id',checkLoginUser, function(req, res, next) {

  var id = req.params.id;
  var edit = studentModel.findById(id);

//execute object student to fetch data
    edit.exec(function(err,data){
    if(err) throw err;   //throw err if occur
      res.render('edit', { title: 'Edit Student Records',records:data}); //render data for ejs page
    
});

});

//route to update
router.post('/update',checkLoginUser, function(req, res, next) {

  
  var update = studentModel.findByIdAndUpdate(req.body.id,{
    name: req.body.name,           //take value from ejs view from
    email:req.body.email,
    class:req.body.class,
    gender:req.body.gender,
    contact:req.body.contact,
  });

//execute object student to fetch data
    update.exec(function(err,data){
    if(err) throw err;   //throw err if occur
    student.exec(function(err,data){
      if(err) throw err;   //throw err if occur
        res.render('show', { title: 'Student Records',records:data, showmsg:'Data Updated Sucessfully'}); //render data for ejs page
      
  });
});

});



module.exports = router;
