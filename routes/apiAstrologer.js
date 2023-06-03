const express = require('express');
const router = express.Router(); 
const { body,param, validationResult } = require('express-validator');
const apiAstrologerModel = require('../models/apiAstrologerModel');
const multer = require('multer');
const path = require('path'); 
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token'); 
 
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
    fileFilter: function(req,files,callback){
        if(
        files.mimetype == "image/png" ||
        files.mimetype == "image/jpg" ||
        files.mimetype == "image/jpeg"
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
 

router.post('/signup',
	body('name').isLength({
     min:1, 
     max:30 	
    }).withMessage('mobile_no should be required..'),
    body('email').isEmail({}).withMessage('email should be required..'),
    body('mobile_no').isLength({
     min:10,
     max:10 	
    }).withMessage('mobile_no should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required name, email & mobile_no..'
        });
    }
	apiAstrologerModel.registerUser(req.body).then((result)=>{
      
        if(result){
            res.json({
                result:'true',
                msg:'mobile_no(astrologer) registered successfully..',
                //data:result
                data:{
                _id:result[0]._id,
                name:result[0].name,
                email:result[0].email,
                mobile_no:result[0].mobile_no,
                otp:result[0].otp,
                form_status:result[0].form_status,
                role:result[0].role,
                current_date:result[0].current_date
                }
           })
        }else{
            res.json({
              result: 'false',
        	    msg: 'mobile_no(astrologer) already registered please enter new mobile_no..',
              //data:result
           })
        }    
        //var data = JSON.stringify(result2)
        
           /*res.json({
               result:response,
        	   msg:msg,
               data:result
           }); */
    }).catch((err)=>{
		res.json({message:err.message})
		//console.log(err)
	})
});

router.post('/verify_otp',
    body('_id').isMongoId().withMessage('_id should be required'),
    body('otp').isLength({
     min:1,
     max:4     
    }).withMessage('otp should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id & otp..'
        });
    }
    apiAstrologerModel.verify_otp(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'false',
                msg:'invalid otp please enter valid otp..'
           })
        }else{
            req._id=result[0]._id,
            req.otp=result[0].otp
            if(result[0]._id==req._id && result[0].otp==req.otp){
                res.json({
                    result: 'true',
                    msg: 'otp successfully verify..',
                    //data:result[0],
                     data:{
                      _id:result[0]._id,
                      form_status:result[0].form_status
                    }
                })
            }else{

            }
        }    
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.patch('/resend_otp',
    body('mobile_no').isLength({
        min:10,
        max:10
    }).withMessage('mobile_no should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required mobile_no..'
        });
    }
    var OTP = Math.floor(1000 + Math.random() * 9000);
   
    apiAstrologerModel.resendOTP(req.body,OTP).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

            req.mobile_no = result[0].mobile_no

            if(result[0].mobile_no == req.mobile_no ){
                res.json({
                    result:'true',
                    msg:'OTP successfully updated..',
                    data:{
                      mobile_no:result[0].mobile_no,
                      otp:OTP.toString()
                    }
                })
            }else{

            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/user_skill_details',upload_image.single('profile_pic'),
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id, profile_pic, gender, dob, primary_skill, all_skill, category_name, language, experiance_year, hours_daily, hear_about, online_plateform..'
        });
    }
    apiAstrologerModel.user_skill_details(req.body,req.file.filename).then((result)=>{
       
       const img = req.file.filename;

       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'user profile successfully updated..',
                    //data:result[0],
                    data:{
                      _id:result[0]._id,
                      form_status:result[0].form_status
                    }
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/user_other_details',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id, onboard_details, source_income,matric_qualification, degree, body_reffer, website_link, minimum_earning, maximum_earning, & long_bio..'
        });
    }
    apiAstrologerModel.user_other_details(req.body).then((result)=>{

       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'user profile successfully updated..',
                    //data:result[0],
                    data:{
                      _id:result[0]._id,
                      form_status:result[0].form_status
                    }
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/user_assignment',
    body('_id').isMongoId().withMessage('_id should be required'),
    body('user_thoughts').isLength({
     min:1,
     max:300     
    }).withMessage('reason should be required..'),
    body('customer_thoughts').isLength({
     min:1,
     max:300     
    }).withMessage('reason should be required..'),
     body('user_challange').isLength({
     min:1,
     max:300     
    }).withMessage('reason should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id, user_thoughts, customer_thoughts &  user_challange..'
        });
    }
    apiAstrologerModel.user_assignment(req.body).then((result)=>{

       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'user profile successfully updated..',
                    //data:result[0],
                    data:{
                      _id:result[0]._id,
                      form_status:result[0].form_status
                    }
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/login',
 body('mobile_no').isLength({
     min:10, 
     max:10   
    }).withMessage('mobile_no should be required..'),(req,res,next)=>{
  
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required mobile_no..'
        });
    } 

    var OTP = Math.floor(1000 + Math.random() * 9000);
    apiAstrologerModel.user_login(req.body,OTP).then((result)=>{
          
        if(result.length==0){
      res.json({
          result: 'false',
          msg:'mobile_no invalid please enter vaild mobile_no..',
      })
    }else{
        req.mobile_no = result[0].mobile_no
       
       if(result[0].mobile_no == req.mobile_no){
        res.json({
            result: 'true',
            msg:'user successfully login & generate the otp please verify..',
            data:{
            _id:result[0]._id,
            mobile_no:result[0].mobile_no,
            otp:OTP.toString()
            }
        });
      }else{
    

      }
    }

  }).catch((err)=>{
    res.json({message:err.message})
  })
});


router.get('/primary_skill_list', (req,res,next)=>{
    apiAstrologerModel.primary_skill_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{

            res.json({
                result:'true',
                msg:'dat get successfully..',
                data:result
            }); 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.get('/all_skill_list', (req,res,next)=>{
    apiAstrologerModel.all_skill_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{

            res.json({
                result:'true',
                msg:'data get successfully..',
                data:result
            }); 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.get('/language_list', (req,res,next)=>{
    apiAstrologerModel.language_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{

            res.json({
                result:'true',
                msg:'data get successfully..',
                data:result
            }); 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/audio_call_details', 
    body('astrologer_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
        
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required astrologer_id..'
        });
    }
    apiAstrologerModel.audio_call_details(req.body).then((result)=>{
       
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{

            req.astrologer_id = result.astrologer_id
            
            if(result.astrologer_id == req.astrologer_id){
                res.json({
                    result:'true',
                    msg:'call details get successfully..',
                    data:result
                }); 
           }else{

           }
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.get('/video_call_details', 
    body('astrologer_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required astrologer_id..'
        });
    }
    apiAstrologerModel.video_call_details(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{
            req.astrologer_id = result.astrologer_id
            
            if(result.astrologer_id == req.astrologer_id){
                res.json({
                    result:'true',
                    msg:'call details get successfully..',
                    data:result
                });
            }else{

            } 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/set_rate',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('audio_rate').isLength({
     min:1, 
     max:30     
    }).withMessage('audio_rate should be required..'),
    body('video_rate').isLength({
     min:1,
     max:10     
    }).withMessage('video_rate should be required..'),
    body('chat_rate').isLength({
     min:1,
     max:10     
    }).withMessage('chat_rate should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, audio_rate, video_rate & chat_rate..'
        });
    }
    apiAstrologerModel.set_rate(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'true',
                msg:'data add successfully..',
                //data:result
           })
        }else{
            res.json({
              result: 'true',
                msg: 'data updated successfully..',
           })
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/astrologer_support',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('email').isEmail({}).withMessage('email should be required..'),
    body('query').isLength({
     min:1,
     max:100     
    }).withMessage('tag should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, email, & query..'
        });
    }
    apiAstrologerModel.astrologer_support(req.body).then((result)=>{
      
        if(result){
            res.json({
                result:'true',
                msg:'data add successfully..',
                //data:result
           })
        }else{
            res.json({
              result: 'false',
                msg: 'data dose not added successfully..',
           })
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});
 
router.post('/waiting_list',
    body('astrologer_id').isMongoId().withMessage('_id should be required'), (req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id..'
        });
    }
    apiAstrologerModel.waiting_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{
            req.astrologer_id == result.astrologer_id
            
            if(result.astrologer_id == req.astrologer_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                }); 
            }else{

            }
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    }) 
});



router.post('/approve_follower',
    body('astrologer_id').isMongoId().withMessage('astrologer_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('status').isLength({
     min:1,
     max:10     
    }).withMessage('chat_rate should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, user_id, & status(2)..'
        });
    }
    apiAstrologerModel.approve_follower(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'true',
                msg:'record not found..',
                //data:result
           })
        }else{
            req.astrologer_id = result[0].astrologer_id,
            req.user_id = result[0].user_id
            if(result[0].astrologer_id == req.astrologer_id && result[0].user_id == req.user_id){
                res.json({
                    result: 'true',
                    msg: 'follower approved successfully..',
                })
            } 
        }       
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/approve_list',
    body('astrologer_id').isMongoId().withMessage('_id should be required'), (req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id..'
        });
    }
    apiAstrologerModel.approve_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'data not found..',
            })
        }else{
            req.astrologer_id == result.astrologer_id
            
            if(result.astrologer_id == req.astrologer_id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                }); 
            }else{

            }
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    }) 
});

router.put('/update_astrologer_profile/:id',
    param('id').isMongoId().withMessage('id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required id (in url), name, email, address, city, country, pin_code, aadhar_no, pan_no & address_prof_no..'
        });
    }
    apiAstrologerModel.update_astrologer_profile(req.params,req.body).then((result)=>{
        
        var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            
            req._id = result[0]._id
            
            if(result[0]._id ==req._id ){
                res.json({
                    result:'true',
                    msg:"data updated successfully.."
                })
            }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/payment_history',
  body('astrologer_id').isMongoId().withMessage('astrologer_id should be required'),(req,res,next)=>{
  
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required astrologer_id..'
        });
    } 
    apiAstrologerModel.payment_history(req.body).then((result)=>{
          
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
        
            req.astrologer_id = result[0].astrologer_id
       
            if(result[0].astrologer_id == req.astrologer_id){
                res.json({
                    result: 'true',
                    msg:'pament details get successfully..',
                    data:result
                });
            }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/astrologer_report',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('email').isEmail({}).withMessage('email should be required..'),
    body('report').isLength({
     min:1,
     max:100     
    }).withMessage('tag should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, email, & report..'
        });
    }
    apiAstrologerModel.astrologer_report(req.body).then((result)=>{
      
        if(result){
            res.json({
                result:'true',
                msg:'data add successfully..',
                //data:result
           })
        }else{
            res.json({
              result: 'false',
                msg: 'data dose not added successfully..',
           })
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/astrologer_review_list',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id..'
        });
    }
    apiAstrologerModel.astrologer_review_list(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..'
           })
        }else{

            req.astrologer_id = result.astrolger_id
            
            if(result.astrolger_id == req.astrologer_id){
                res.json({
                    result: 'true',
                    msg: 'data get successfully..',
                    data: result
                   /* data:{
                        _id:result[0]._id,
                        name:result[0].name,
                        review:result[0].review,
                        current_date:result[0].current_date
                    }*/
                })
            }else{

            }
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/remove_follower',
    body('astrologer_id').isMongoId().withMessage('astrologer_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id & user_id..'
        });
    }
    apiAstrologerModel.remove_follower(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'true',
                msg:'record not found..',
           })
        }else{
            req.astrologer_id = result[0].astrologer_id,
            req.user_id = result[0].user_id
            if(result[0].astrologer_id == req.astrologer_id && result[0].user_id == req.user_id){
                res.json({
                    result: 'true',
                    msg: 'follower removed successfully..',
                })
            } 
        }       
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/generate_agrora_token',
    body('astrologer_id').isMongoId().withMessage('user_id should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, channel_name..'
        });
    }

        const appID = 'b13de305bceb4aa1a434b8a295f990dd';
        const appCertificate = '1fc8d838f97541c2b77f50b90919f97f';
        const channelName = req.body.channel_name;
        const uid = 0//2882341273;
        const account = 0//"2882341273";
        const role = 0//RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
        const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
       //const token = tokenA;
       
        
        apiAstrologerModel.generate_agrora_token(req.body,appID,appCertificate,tokenA).then((result)=>{
        
        if(result.length==0){
            res.json({
                result: 'true',
                msg :'astrologer live(generate token) successfully..',
                //data:result,
                app_id:appID,
                token: tokenA 
            });
        }else{
            req.astrologer_id = result[0].astrologer_id
            
            if(result[0].astrologer_id == req.astrologer_id){
                res.json({
                     result:'false',
                    msg: 'astrologer already live..',
                })
            }else{

            }
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/get_astrologer_profile',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req); 
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id(astrologer_id)..'
        });
    }

    apiAstrologerModel.get_astrologer_profile(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    //data:result[0]
                    data:{
                    _id:result[0]._id,
                    name:result[0].name,
                    mobile_no:result[0].mobile_no,
                    email:result[0].email,
                    address:result[0].address,
                    city:result[0].city,
                    country:result[0].country,
                    pin_code:result[0].pin_code,
                    adhar_no:result[0].adhar_no,
                    pan_no:result[0].pan_no,
                    address_prof_no:result[0].address_prof_no,
                    profile_pic:result[0].profile_pic
                }

                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/astrologer_chat_status',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('status').isLength({
     min:1,
     max:3     
    }).withMessage('status should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id & status(on=1,off=0)..'
        });
    }
    apiAstrologerModel.astrologer_chat_status(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..'
           })
        }else{

            req.astrologer_id = result[0].astrolger_id
            
            if(result[0].astrolger_id == req.astrologer_id){
                res.json({
                    result: 'true',
                    msg: 'data get successfully..',
                    //data: result
                    data:{
                        _id:result[0]._id,
                        name:result[0].name,
                        chat_status:result[0].chat_status
                    }
                })
            }else{

            }
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/astrologer_call_status',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('status').isLength({
     min:1,
     max:3     
    }).withMessage('status should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id & status(on=1,off=0)..'
        });
    }
    apiAstrologerModel.astrologer_call_status(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..'
           })
        }else{

            req.astrologer_id = result[0].astrolger_id
            
            if(result[0].astrolger_id == req.astrologer_id){
                res.json({
                    result: 'true',
                    msg: 'data get successfully..',
                    //data: result
                    data:{
                        _id:result[0]._id,
                        name:result[0].name,
                        call_status:result[0].call_status
                    }
                })
            }else{

            }
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/astrologer_report_status',
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('status').isLength({
     min:1,
     max:3     
    }).withMessage('status should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id & status(on=1,off=0)..'
        });
    }
    apiAstrologerModel.astrologer_report_status(req.body).then((result)=>{
      
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..'
           })
        }else{

            req.astrologer_id = result[0].astrolger_id
            
            if(result[0].astrolger_id == req.astrologer_id){
                res.json({
                    result: 'true',
                    msg: 'data get successfully..',
                    //data: result
                    data:{
                        _id:result[0]._id,
                        name:result[0].name,
                        report_status:result[0].report_status
                    }
                })
            }else{

            }
        }    
        
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});





module.exports = router;