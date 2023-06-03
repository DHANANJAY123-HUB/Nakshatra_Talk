const express = require('express'); 
const router = express.Router();
const expertModel = require('../models/expertModel');
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({  
    destination: function(req, file, cb){ 
        cb(null,'uploads/')
    }, 
    filename: function(req, file, cb) { 
        let ext = path.extname(file.originalname)
        cb(null,Date.now()+ext) 
    } 
});

const upload_image = multer({
    storage: storage,
    fileFilter: function(req,file,callback){
        if(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
    ){
        callback(null,true)
    }else{
        console.log('only  png , jpg & jpeg file supported')
        callback(null,false)
    }

   },
   limits:{
    filesize:1024 * 1024 * 2
   }
});


router.get('/sign_up', (req, res,next)=>{
  res.render('sign_up',{'output':''});
});

router.get('/sign_in', (req, res,next)=>{
  res.render('sign_in',{'output':''}); 
});

router.get('/login', (req, res,next)=>{
  expertModel.get_verify_phone_login(req.body).then((result)=>{
    res.render('verify_phone_login',{'result':result[0]});
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

 
router.get('/forgetpwd', (req, res,next)=>{
  res.render('forgetpwd');
}); 

router.get('/verify_phone', (req, res,next)=>{
 expertModel.get_verify_phone(req.body).then((result)=>{
    res.render('verify_phone',{'result':result[0]});
      
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});
 
router.get('/thanks', (req, res,next)=>{
  res.render('thanks');
});

router.get('/skil', (req, res,next)=>{
 expertModel.get_skil(req.body).then((result)=>{
 res.render('skil',{'result':result[0]});
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/otherskill', (req, res,next)=>{
  expertModel.get_otherskill(req.body).then((result)=>{
 res.render('otherskill',{'result':result[0]});
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/assignment', (req, res,next)=>{
 expertModel.get_assignment(req.body).then((result)=>{
 res.render('assignment',{'result':result[0]});
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/locked_screen', (req, res,next)=>{
  res.render('locked_screen');
});

router.get('/dashboard', (req, res,next)=>{
  res.render('dashboard');
});

router.get('/live', (req, res,next)=>{
  res.render('live');
});

router.get('/set_rate', (req, res,next)=>{
  res.render('set_rate',{'output':''});
});

router.get('/support', (req, res,next)=>{
  res.render('support',{'output':''});
});

router.get('/user_profile', (req, res,next)=>{
  res.render('user_profile',{'output':''});
});

router.get('/report', (req, res,next)=>{
  res.render('report',{'output':''});
});

router.get('/change_password', (req, res,next)=>{
  res.render('change_password');
});

router.post('/sign_up', (req,res,next)=>{
  expertModel.register_user(req.body).then((result2)=>{
   console.log(req.body)
  
      if(result2.length==0){
  
         res.redirect('/expert/verify_phone'/*,{'result2':result2,'output':'user register successfully..'}*/);
      
      }else{
      
        res.render('sign_up',{'result2':result2,'output':'mobile_no already exit,please enter new mobile_no..'}) 
        
      }    
        //res.render('verify_phone',{'output':msg});
        //res.redirect('/expert/verify_phone') 

         /* res.json({
            result:result,
            msg:msg,
            
          })*/
    }).catch((err)=>{
    res.render({message:err.message})
    //console.log(err)
  })
});

router.post('/verify_phone/:id', (req, res,next)=>{
  expertModel.verify_otp(req.body,req.params).then((result)=>{
   var new_id = parseInt(req.params.id);

      
    if(result.length==0){
      res.render('verify_phone',{'output':'Invalid otp please enter valid output..'});
    }else{
      req.id = result[0]._id,
      req.otp = result[0].otp

      if(result[0]._id == req.id && result[0].otp == req.otp){
        //var id = result[0]._id
         res.redirect('/expert/skil')
      }else{
        res.redirect('/expert/verify_phone')    
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/resend_otp/:id', (req,res,next)=>{
  expertModel.resend_otp(req.params).then((result)=>{
      var new_id = parseInt(req.params.id);
      
      if(result){
          //response = 'true',
         // msg = 'admin successfully register'
        res.redirect('/expert/verify_phone') 
      
      }else{
          // response = 'false',
         // msg = 'mobile_no already exit,please enter new mobile_no'
       // res.render('verify_phone',{'output':'otp not generated..'}) 
        
      }    
        //res.render('verify_phone',{'output':msg});
        //res.redirect('/expert/verify_phone') 

         /* res.json({
            result:response,
            msg:msg,
            data:result
            
          })*/
    }).catch((err)=>{
    res.render({message:err.message})
    //console.log(err)
  })
});

router.get('/resend_otp_login/:id', (req,res,next)=>{
  expertModel.resend_otp_login(req.params).then((result)=>{
      var new_id = parseInt(req.params.id);
      
      if(result){
          //response = 'true',
         // msg = 'admin successfully register'
        res.redirect('/expert/login') 
      
      }else{
          // response = 'false',
         // msg = 'mobile_no already exit,please enter new mobile_no'
       // res.render('verify_phone',{'output':'otp not generated..'}) 
        
      }    
        //res.render('verify_phone',{'output':msg});
        //res.redirect('/expert/verify_phone') 

         /* res.json({
            result:response,
            msg:msg,
            data:result
            
          })*/
    }).catch((err)=>{
    res.render({message:err.message})
    //console.log(err)
  })
});

router.post('/skil/:id',upload_image.single('profile_pic'),(req, res,next)=>{
  expertModel.skil_details(req.body,req.params,req.file.filename).then((result)=>{
    
   var new_id = parseInt(req.params.id);
   var img = req.file.filename;
      
    if(result.length==0){
      res.render('skil',{'output':'record not found..'});
    }else{
      req.id = result[0]._id

      if(result[0]._id == req.id){
        //res.render('otherskill',{'output':'data added successfully..'})
        res.redirect('/expert/otherskill')
      }else{
          
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.post('/otherskill/:id', (req, res,next)=>{
  expertModel.otherskill_details(req.body,req.params).then((result)=>{
    
   var new_id = parseInt(req.params.id);

      
    if(result.length==0){
      res.render('otherskill',{'output':'record not found..'});
    }else{
      req.id = result[0]._id

      if(result[0]._id == req.id){
        //res.render('otherskill',{'output':'data added successfully..'})
        res.redirect('/expert/assignment')
      }else{
          
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
}); 

router.post('/assignment/:id', (req, res,next)=>{
  expertModel.assignment_details(req.body,req.params).then((result)=>{
    
   var new_id = parseInt(req.params.id);

      
    if(result.length==0){
      res.render('assignment',{'output':'record not found..'});
    }else{
      req.id = result[0]._id

      if(result[0]._id == req.id){
       // res.render('thanks',{'output':'data added successfully..'})
       res.redirect('/expert/thanks')
      }else{
          
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.post('/sign_in', (req, res,next)=>{
  //var OTP = Math.floor(1000 + Math.random() * 9000);
  expertModel.user_login(req.body).then((result)=>{
       
   if(result.length==0){
     
      res.render('sign_in',{'output':'record not found..'});
            
    }else{
      req.mobile_no = result[0].mobile_no

      if(result[0].mobile_no == req.mobile_no){
            
        res.redirect('/expert/login')
           
      }else{
        
        res.redirect('/expert/sign_in')    
      }
    }
  }).catch((err)=>{
    res.render({message:err.message})
  })
});


router.post('/login/:id', (req, res,next)=>{
  expertModel.login_otp(req.body,req.params).then((result)=>{
   
    var new_id = parseInt(req.params.id);
  
    if(result.length==0){
       //res.render('verify_phone_login',{'output':'invalid otp..'});
     res.redirect('/expert/login')
    }else{
      req.id = result[0]._id,
      req.otp = result[0].otp

      if(result[0]._id == req.id && result[0].otp == req.otp){
         res.redirect('/expert/dashboard')
      }else{
        res.redirect('/expert/login')    
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/call_details', (req, res,next)=>{
 // res.render('call_details');
 expertModel.audio_call_details(req.body).then((result)=>{
      res.render('call_details',{'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/video_call_details', (req, res,next)=>{
 // res.render('call_details');
 expertModel.video_call_details(req.body).then((result)=>{
      res.render('call_details',{'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.post('/set_rate/:id', (req, res,next)=>{
  expertModel.set_rate(req.body,req.params).then((result)=>{
     
     var new_id = parseInt(req.params.id);  
   
    if(result.length==0){
     
      res.render('set_rate',{'output':'record not found..'});
            
    }else{
      req._id = result[0]._id

      if(req._id = result[0]._id){
            
        res.render('set_rate',{'output':'data add successfully..'})
           
      }else{
        
            
      }
    }
  }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.post('/support/:id', (req, res,next)=>{
  expertModel.support(req.body,req.params).then((result)=>{
     
     var new_id = parseInt(req.params.id);  
   
    if(result.length==0){
     res.render('support',{'output':'data does not added..'});
    }else{
      req._id = result[0]._id

      if(req._id = result[0]._id){
          res.render('support',{'output':'data add successfully..'})
      }else{
        
            
      }     
    }
  }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.post('/user_profile/:id', (req, res,next)=>{
  expertModel.user_profile(req.body,req.params).then((result)=>{
     
     var new_id = parseInt(req.params.id);  
     
    if(result.length==0){
     res.render('user_profile',{'output':'data does not added..'});
    }else{
      req._id = result[0]._id

      if(req._id = result[0]._id){
          res.render('user_profile',{'output':'data add successfully..'})
      }else{
        
            
      }     
    }
  }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.get('/payment', (req, res,next)=>{
 expertModel.payment(req.body).then((result)=>{
      res.render('payment',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.post('/report/:id', (req, res,next)=>{
  expertModel.report(req.body,req.params).then((result)=>{
     
     var new_id = parseInt(req.params.id);  
   
    if(result.length==0){
     res.render('report',{'output':'data does not added..'});
    }else{
      req._id = result[0]._id

      if(req._id = result[0]._id){
          res.render('report',{'output':'data add successfully..'})
      }else{
        
            
      }     
    }
  }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.get('/waitlist', (req, res,next)=>{
  expertModel.waitlist(req.body).then((result)=>{
      res.render('waitlist',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/review', (req, res,next)=>{
  expertModel.review(req.body).then((result)=>{
      res.render('review',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/earning', (req, res,next)=>{
 expertModel.earing(req.body).then((result)=>{
      res.render('earing',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/follower', (req, res,next)=>{
  expertModel.follower(req.body).then((result)=>{
      res.render('follower',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/remove_follower/:id', (req, res,next)=>{
  expertModel.remove_follower(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='follower successfully deleted',
                res.redirect('/expert/follower') 
            }
          res.render('follower',{'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/approve_follower/:id', (req, res,next)=>{
  expertModel.approve_follower(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='follower successfully approved',
                res.redirect('/expert/waitlist') 
            }
          res.render('waitlist',{'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});


module.exports = router;