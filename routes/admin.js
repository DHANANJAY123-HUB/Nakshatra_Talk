const express = require('express'); 
const router = express.Router(); 
const db = require('../models/connection')
const adminModel = require('../models/adminModel') 
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
  res.render('sign_up_admin',{'output':''});
});

router.get('/sign_in', (req, res,next)=>{
  res.render('sign_in_admin',{'output':''});
});

router.get('/login', (req, res,next)=>{
  adminModel.get_verify_phone_admin_login(req.body).then((result)=>{
    res.render('verify_phone_admin_login',{'result':result[0]});
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/verify_phone', (req, res,next)=>{
  //res.render('verify_phone_admin');
  adminModel.get_verify_phone(req.body).then((result)=>{
    
      res.render('verify_phone_admin',{'result':result[0]});
        /*res.json({
            result:"true",
            msg:"data get successfully",
            data:{
              _id:result[0]._id,
              mobile_no:result[0].mobile_no,
             otp: result[0].otp
            }
          })*/
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/forgetpwd', (req, res,next)=>{
  res.render('forgetpwd_admin');
});

router.get('/locked_screen', (req, res,next)=>{
  res.render('locked_screen_admin');
});

router.get('/change_password', (req, res,next)=>{
  res.render('change_password_admin');
});

router.get('/add_category', (req, res,next)=>{
  res.render('add_category_admin');
});

router.get('/add_blog', (req, res,next)=>{
  res.render('add_blog_admin', {'output':''});
});

router.get('/about', (req, res,next)=>{
  res.render('about_admin',{'output':''});
});

router.get('/privacy-policy', (req, res,next)=>{
  res.render('privacy-policy_admin',{'output':''});
});

router.get('/terms', (req, res,next)=>{
  res.render('terms_admin',{'output':''}); 
});

router.get('/add_news', (req, res,next)=>{
  res.render('add_news_admin',{'output':''});
});

router.get('/edit_horoscope', (req, res,next)=>{
  res.render('edit_horoscope_admin');
});

router.post('/sign_up', (req,res,next)=>{
  adminModel.register_user(req.body).then((result)=>{
  
      if(result){
          //response = 'true',
          //msg = 'admin successfully register'
         res.redirect('/admin/verify_phone') 
      
      }else{
          // response = 'false',
          //msg = 'mobile_no already exit,please enter new mobile_no'
        res.render('sign_up_admin',{'output':'mobile_no already exit,please enter new mobile_no..'}) 
        
      }    
        //res.render('verify_phone',{'output':msg});
        //res.redirect('/expert/verify_phone') 

        /*  res.json({
            result:response,
            msg:msg,
            data:result
            
          })*/
    }).catch((err)=>{
    res.render({message:err.message})
    //console.log(err)
  })
});

router.post('/verify_phone/:id', (req, res,next)=>{
  adminModel.verify_otp(req.body,req.params.id).then((result)=>{

   var new_id = parseInt(req.params.id);

      
    if(result.length==0){
       res.redirect('/admin/verify_phone')
     // res.render('verify_phone_admin',{'output':'Invalid otp please enter valid output..'});
    }else{
      req._id = result[0].id

      if(result[0].id == req._id){
        res.redirect('/admin/sign_in')
      }else{
       // res.render('verify_phone_admin',{'output':'Invalid otp please enter valid output..'})    
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});

router.get('/resend_otp/:id', (req,res,next)=>{
  adminModel.resend_otp(req.params).then((result)=>{
      var new_id = parseInt(req.params.id);
      if(result){
          //response = 'true',
         // msg = 'admin successfully register'
        res.redirect('/admin/verify_phone') 
      
      }else{
          // response = 'false',
         // msg = 'mobile_no already exit,please enter new mobile_no'
       // res.render('verify_phone_admin',{'output':'otp not generated..'}) 
        
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
  adminModel.resend_otp_login(req.params).then((result)=>{
      var new_id = parseInt(req.params.id);
      if(result){
          //response = 'true',
         // msg = 'admin successfully register'
        res.redirect('/admin/login') 
      
      }else{
          // response = 'false',
         // msg = 'mobile_no already exit,please enter new mobile_no'
       // res.render('verify_phone_admin',{'output':'otp not generated..'}) 
        
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

router.post('/sign_in', (req, res,next)=>{
  adminModel.user_login(req.body).then((result)=>{
       
    if(result.length==0){
      res.render('sign_in_admin',{'output':'record not found..'});
    }else{
      req.mobile_no = result[0].mobile_no

      if(result[0].mobile_no == req.mobile_no){
            
        res.redirect('/admin/login')
           
      }else{
        
        //res.redirect('/admin/sign_in',{'output':'invalid mobile_no & otp..'})    
      }
    }
  }).catch((err)=>{ 
    res.render({message:err.message})
  })
})

router.post('/login/:id', (req, res,next)=>{
  adminModel.login_otp(req.body,req.params).then((result)=>{
   
    var new_id = parseInt(req.params.id);
  
    if(result.length==0){
       //res.render('verify_phone_login',{'output':'invalid otp..'});
     res.redirect('/admin/login')
    }else{
      req.id = result[0]._id,
      req.otp = result[0].otp

      if(result[0]._id == req.id && result[0].otp == req.otp){
         res.redirect('/admin/dashboard')
      }else{
        res.redirect('/admin/login')    
      }
    }
    
    }).catch((err)=>{
      res.render({message:err.message})
        //console.log(err)
    })
});


router.get('/dashboard', (req, res,next)=>{
  //res.render('index',{'sunm':req.session.sunm});
  
  const user = db.collection('user');
  const astrologer = db.collection('astrologer');
  const today_earning = db.collection('astrologer_payment_list');
  const total_earning = db.collection('astrologer_payment_list');

  
  var start = new Date();
  var end = new Date();
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
   Promise.all([user.countDocuments({}), astrologer.countDocuments({}),today_earning.countDocuments({current_date: {$gte: start, $lt: end}}),total_earning.countDocuments({})]).then((result)=>{
   
    if(result){
        //response ='true',
        // msg ='record found'
    }else{
      //response = 'false',
      //msg =  'record not found'
    } 
   res.render('dashboard_admin',{'total_user':result[0],'total_astrologer':result[1],'today_earning':result[2],'total_earning':result[3]});
          
  }).catch((err)=>{
    res.render({message:err.message})
   // console.log(err)
  })
});

router.get('/user_list', (req, res,next)=>{
  adminModel.user_list(req.body).then((result)=>{
      res.render('user_list_admin',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/user_view/:id', (req, res,next)=>{
  adminModel.user_view(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
        
          }else{
               // result = true,
               // msg ='user successfully show'
            }
          res.render('user_view_admin',{'list':result[0]});

  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/delete_user/:id', (req, res,next)=>{
  adminModel.delete_user(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
                //res.render('user_view_admin');
        
          }else{
               // result = true,
               // msg ='user successfully show'
                res.redirect('/admin/user_list');
            }
         

  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/expert', (req, res,next)=>{
  adminModel.expert_list(req.body).then((result)=>{
      res.render('expert_admin',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/expert_view/:id', (req, res,next)=>{
  adminModel.expert_view(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
        
          }else{
               // result = true,
               // msg ='user successfully show'
            }
          res.render('expert_view_admin',{'list':result[0]});

  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/delete_expert/:id', (req, res,next)=>{
  adminModel.delete_expert(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
                //res.render('user_view_admin');
        
          }else{
               // result = true,
               // msg ='user successfully show'
                res.redirect('/admin/expert');
            }
         

  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/category_list', (req, res,next)=>{
  adminModel.category_list(req.body).then((result)=>{
      res.render('category_list_admin',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/manage_category_status', (req, res, next)=>{
  adminModel.manage_category_status(req.query).then((result)=>{
    console.log(req.query)
    //var new_id = req.query._id;
    //var s = req.query.s;
    if(result.length==0){
                 //result = 'false',
               // msg ='_id invalid...'
        
          }else{
                //result = 'true',
               // msg ='category_status successfully updated',
                res.redirect('/admin/category_list')
            }
          

          res.render('category_list');
         /* res.json({
            //response:result,
            msg:msg,
            data:result
          })  */
  }).catch((err)=>{
     res.json({message:err.message})
     //console.log(err)
  })
});

router.post('/add_category',upload_image.single('image'),(req,res,next)=>{
  adminModel.add_category(req.body,req.file.filename).then((result)=>{
    console.log(req.file)
      var img = req.file.filename;
      if(result){
  
         res.render('add_category_admin',{'output':'blog add successfully..'});
           /*res.json({
            result:'true',
            msg:'file uploaded successfully',
            
          })*/
      }else{
      
        res.render('add_category_admin',{'output':'blog does not exist '}) 
        
      }    
       
    }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.post('/about',(req,res,next)=>{
  adminModel.about(req.body).then((result)=>{
   
      if(result){
  
         res.render('about_admin',{'output':'data add successfully.. '});
      }else{
      
        res.render('about_admin',{'output':'data does not exist.. '}) 
        
      }    
       
    }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.post('/privacy-policy',(req,res,next)=>{
  adminModel.privacy_policy(req.body).then((result)=>{
   
      if(result){
  
         res.render('privacy-policy_admin',{'output':'data add successfully.. '});
      }else{
      
        res.render('privacy-policy_admin',{'output':'data does not exist.. '}) 
        
      }    
       
    }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.post('/terms',(req,res,next)=>{
  adminModel.terms(req.body).then((result)=>{
   
      if(result){
  
         res.render('terms_admin',{'output':'data add successfully.. '});
      }else{
      
        res.render('terms_admin',{'output':'data does not exist.. '}) 
        
      }    
       
    }).catch((err)=>{
    res.render({message:err.message})
  })
});



router.post('/add_blog',upload_image.single('image'),(req,res,next)=>{
  adminModel.add_blog(req.body,req.file.filename).then((result)=>{
    console.log(req.file)
      var img = req.file.filename;
      if(result){
  
         res.render('add_blog_admin',{'output':'blog add successfully..'});
      
      }else{
      
        res.render('add_blog_admin',{'output':'blog does not exist '}) 
        
      }    
       
    }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.get('/blog', (req, res,next)=>{
  adminModel.blog_list(req.body).then((result)=>{
      res.render('blog_admin',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/review_list', (req, res,next)=>{
  adminModel.review_list(req.body).then((result)=>{
      res.render('review_list_admin',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/delete_review/:id', (req, res,next)=>{
  adminModel.delete_review(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
                //res.render('user_view_admin');
        
          }else{
               // result = true,
               // msg ='user successfully show'
                res.redirect('/admin/review_list');
            }
         

  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.post('/add_news',upload_image.single('image'),(req,res,next)=>{
  adminModel.add_news(req.body,req.file.filename).then((result)=>{
      var img = req.file.filename;
      if(result){
  
         res.render('add_news_admin',{'output':'blog add successfully..'});
      }else{
      
        res.render('add_news_admin',{'output':'blog does not exist '}) 
      }    
       
    }).catch((err)=>{
    res.render({message:err.message})
  })
});

router.get('/news', (req, res,next)=>{
  adminModel.news_list(req.body).then((result)=>{
      res.render('news_admin',{'list':result});   
   
    }).catch((err)=>{
       res.render({message:err.message});
    })
});

router.get('/delete_news/:id', (req, res,next)=>{
  adminModel.delete_news(req.params).then((result)=>{
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
                //res.render('user_view_admin');
        
          }else{
               // result = true,
               // msg ='user successfully show'
                res.redirect('/admin/news');
            }
         

  }).catch((err)=>{
    res.json({message:err.message})
  })
});



module.exports = router;