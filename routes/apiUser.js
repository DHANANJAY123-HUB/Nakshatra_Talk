const express = require('express');
const router = express.Router();
const { body,param,validationResult } = require('express-validator');
const apiUserModel = require('../models/apiUserModel');
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

router.patch('/upload_image',upload_image.single('user_pic'),
    body('_id').isMongoId().withMessage('_id should be required'),(req, res,next) => {
   
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ 
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id, & user_pic..'
        });
    }

    apiUserModel.upload_image(req.body,req.file.filename).then((result)=>{
    
        const img = req.file.filename;

        if(result.length==0){
            res.json({
                result:'false',
                msg:'user pic does not uploaded..',
                //body:result
            })
        }else{
            req._id = result[0]._id
            if(result[0]._id == req._id){         
                res.json({
                    result:'true',
                    msg:'user pic uploaded successfully..',
                })
            }else{

            }
        }
    }).catch((err)=>{
        //console.log(err)
        res.json({message:err.message})
    });
});


router.post('/signup', 
    body('mobile_no').isLength({
     min:10,
     max:10 	
    }).withMessage('mobile_no should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required mobile_no..'
        });
    }
	apiUserModel.registerUser(req.body).then((result)=>{
      
        if(result){
            res.json({
                result:'true',
                msg:'mobile_no registered successfully..',
                //data: result
                data:{
                _id:result[0]._id,
                mobile_no:result[0].mobile_no,
                otp:result[0].otp,
                role:result[0].role,
                current_date:result[0].current_date
                }
           })
        }else{
            res.json({
               result:'true',
        	   msg:'mobile_no already registered please enter new mobile_no..',
               //data:result
               data:{
                _id:result[0]._id,
                mobile_no:result[0].mobile_no,
                otp:result[0].otp,
                role:result[0].role,
                current_date:result[0].current_date
                }

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
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id & otp..'
        });
    }
    apiUserModel.verify_otp(req.body).then((result)=>{
      
        if(result.length==0){
            res.status(400).json({
                result:'false',
                msg:'invalid otp please enter valid otp..'
           })
        }else{
            req._id=result[0]._id,
            req.otp=result[0].otp
            if(result[0]._id==req._id && result[0].otp==req.otp){
                res.status(200).json({
                    result: 'true',
                    msg: 'otp successfully verify..',
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
    
    apiUserModel.resendOTP(req.body,OTP).then((result)=>{
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found',
            })
        }else{

            req.mobile_no = result[0].mobile_no

            if(result[0].mobile_no == req.mobile_no ){
                res.json({
                    result:'true',
                    msg:'otp successfully updated..',
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

router.post('/get_user_profile',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    apiUserModel.get_user_profile(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                    /*data:{
                    _id:result[0]._id,
                    mobile_no:result[0].mobile_no,
                    email:result[0].email,
                    name:result[0].name,
                    role:result[0].role
                }*/

                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

/*router.patch('/update_user_profile_data',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id, gender, dob, tob, pob, current_address, pin_code, city_state..'
        });
    }
    apiUserModel.update_user_profile_data(req.body).then((result)=>{
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
                    msg:'data successfully updated..'
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});*/

router.put('/update_user_profile_data/:id',
    param('id').isMongoId().withMessage('id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required id (in url), name, email, gender, dob, tob, pob, current_address, pin_code, city_state..'
        });
    }
    apiUserModel.update_user_profile_data(req.params,req.body).then((result)=>{
        
        var new_id = parseInt(req.params.id);
        //const img = req.file.filename;
            const isEmpty = value =>
                value === undefined ||
                value === null ||
                value === ""   ||
                (typeof value === "object" && Object.keys(value).length === 0) ||
                (typeof value === "string" && value.trim().length === 0);
           
            const userDetails = {};
            
            Object.keys(req.body).forEach(key => {
                if (!isEmpty(req.body[key])) {
                    userDetails[key] = req.body[key];
                }
            });
        if(result.length==0){
            res.json({
                result:'false',
                msg:'_id not found',
            })
        }else{
            
            req._id = result[0]._id
            
            if(result[0]._id ==req._id ){
                res.json({
                    result:'true',
                    msg:"data successfully updated"
                })
            }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.get('/blog_list', (req,res,next)=>{
    apiUserModel.blog_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
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

router.post('/blog_list_details',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    apiUserModel.blog_list_details(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/news_list', (req,res,next)=>{
    apiUserModel.news_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
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

router.post('/news_list_details',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    apiUserModel.news_list_details(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/client_testimonials_list', (req,res,next)=>{
    apiUserModel.client_testimonials_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
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

router.get('/celebrity_list', (req,res,next)=>{
    apiUserModel.celebrity_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
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

/*router.patch('/update_user_profile',
    body('_id').isMongoId().withMessage('_id should be required'),
    body('name').isLength({
     min:1,
     max:30     
    }).withMessage('name should be required..'),
    body('email').isEmail({}).withMessage('email should be required..'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required(optional parameter) _id, name & email..'
        });
    }
    apiUserModel.update_user_profile(req.body).then((result)=>{
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
                    msg:'data successfully updated..'
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});*/

router.get('/puja_list', (req,res,next)=>{
    apiUserModel.puja_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            //for(var i=0; i < result.length; i++) { 
            res.json({
                result:'true',
                msg:'data get successfully..',
                data:result
                /*data:[{
                    puja_name:result[i].puja_name,
                    image:result[i].image
                }]*/
            });
            //} 
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/puja_list_details',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    apiUserModel.puja_list_details(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/astrologer_list', 
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    
    apiUserModel.astrologer_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id

            if(result[0].user_id == req.user_id){
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

router.post('/astrologer_list_details',
    body('_id').isMongoId().withMessage('_id should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    apiUserModel.astrologer_list_details(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req._id = result[0]._id
        
            if(result[0]._id == req._id){
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result[0]
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/astrologer_block',
    body('astrologer_id').isMongoId().withMessage('astrologer_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('block_status').isLength({
     min:1,
     max:2     
    }).withMessage('name should be required..'),
   /* body('reason').isLength({
     min:1,
     max:300     
    }).withMessage('reason should be required..'),*/(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, user_id, block_status & reason..'
        });
    }

    apiUserModel.astrologer_block(req.body).then((result)=>{
      
      var block_status = req.body.block_status;
       
       if(result.length==0 && block_status == "1"){
            res.json({
                result:'true',
                msg:'astrologer blocked successfully..',
            })
        }else if(result.length==0 && block_status == "0"){
            res.json({
                result:'false',
                msg:'astrologer unblocked successfully..',
            })
        }else{
            req.astrologer_id = result[0].astrologer_id,
            req.user_id = result[0].user_id
        
            if(result[0].astrologer_id == req.astrologer_id && result[0].user_id == req.user_id && block_status == "1"){
                res.json({
                    result:'true',
                    msg:'astrologer blocked successfully..',
                })
            }else{
                res.json({
                    result:'false',
                    msg:'astrologer unblocked successfully..',
                })

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/astrologer_block_list', 
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    
    apiUserModel.astrologer_block_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id

            if(result[0].user_id == req.user_id){
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

router.post('/astrologer_feedback',
    body('user_id').isMongoId().withMessage('_id should be required'),
    body('tag').isLength({
     min:1,
     max:20     
    }).withMessage('tag should be required..'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & tag..'
        });
    }

    apiUserModel.astrologer_feedback(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result){
            res.json({
                result:'true',
                msg:'data added successfully..',
            })
        }else{
            res.json({
                result:'false',
                msg:'data  not added successfully..',
            })
           
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/category_list', (req,res,next)=>{
    apiUserModel.category_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
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

router.get('/all_category_list_data', (req,res,next)=>{
    apiUserModel.all_category_list_data(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
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

router.post('/category_list_details',
    body('category_name').isLength({
     min:1,
     max:20   
    }).withMessage('category_name should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required _id..'
        });
    }

    apiUserModel.category_list_details(req.body).then((result)=>{
       //var new_id = parseInt(req.params.id);
       
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{

            req.category_name = result.category_type
        
            if(result.category_type == req.category_name){
              
                res.json({
                    result:'true',
                    msg:'data get successfully..',
                    data:result
                })
                
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/search',
    body('name').isLength({
       min:1,
       max:20
    }).withMessage('name should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
   if(!errors.isEmpty()) {
       return res.status(400).json({
           result: 'false',
            //errors: errors.array()
           msg:'parameter required name..'
       });
   } 
    apiUserModel.search(req.body).then((result)=>{
       

        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/filter_price', (req,res,next)=>{
    apiUserModel.filter_price(req.body).then((result)=>{
       
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/filter_experiance', (req,res,next)=>{
    apiUserModel.filter_experiance(req.body).then((result)=>{
       
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.post('/filter_gender', 
     body('gender').isLength({
       min:1,
       max:20
    }).withMessage('gender should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
       return res.status(400).json({
           result:'false',
            //errors: errors.array()
           msg:'parameter required gender..'
       });
    }    
    apiUserModel.filter_gender(req.body).then((result)=>{
       
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/filter_rating', (req,res,next)=>{
    apiUserModel.filter_rating(req.body).then((result)=>{
       
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/all_filter', (req,res,next)=>{
    apiUserModel.all_filter(req.body).then((result)=>{

        /*const userDetails = {}
        var experiance_year;
        var price;
        var gender; 
        if (experiance_year) {
           userDetails.experiance_year = experiance_year 
        }
        if (price) {
          userDetails.price = price
        }
        if (gender) {
          userDetails.gender = gender
        }*/
       
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.post('/astrologer_follow', 
    body('astrologer_id').isMongoId().withMessage('_id should be required'),
    body('user_id').isMongoId().withMessage('_id should be required'),
    body('status').isLength({
       min:1,
       max:2
    }).withMessage('status should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result:'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, user_id & status..'
        });
    }
    apiUserModel.astrologer_follow(req.body).then((result)=>{
       
        var status = req.body.status;
        
        if(result.length==0 && status == "1"){
            res.json({
                result:'true',
                msg:'astrologer follow successfully..',
           })
        }else if(result.length==0 && status == "0"){
            res.json({
                result:'false',
                msg:'astrologer unfollow successfully..',
            })
        }else{
            req.astrologer_id = result[0].astrologer_id,
            req.user_id = result[0].user_id

            if(result[0].astrologer_id == req.astrologer_id && result[0].user_id == req.user_id && status == "1"){
                res.json({
                    result:'true',
                    msg: 'astrologer follow successfully..',
                    //data:result
                })
            }else{
                res.json({
                    result:'false',
                    msg: 'astrologer unfollow successfully..'
                })
            }
        }    
    }).catch((err)=>{
        res.json({message:err.message})
        //console.log(err)
    })
});

router.post('/astrologer_follow_list', 
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    
    apiUserModel.astrologer_follow_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result[0].user_id

            if(result[0].user_id == req.user_id){
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

router.post('/astrologer_booking',
    body('astrologer_id').isMongoId().withMessage('user_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
     body('ammount').isLength({
       min:1,
       max:20
    }).withMessage('ammount should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, user_id & ammount..'
        });
    }
    
    apiUserModel.astrologer_booking(req.body).then((result)=>{
   
        if(result){
            res.json({
                result:'true',
                msg:'data add successfully..',
                data:result
            })
        }else{

            res.json({
                result:'false',
                msg:'data does not exist..',
            });   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/astrologer_booking_list', 
    body('user_id').isMongoId().withMessage('user_id should be required'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id..'
        });
    }
    
    apiUserModel.astrologer_booking_list(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req.user_id = result.user_id

            if(result.user_id == req.user_id){
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

router.post('/add_review',
    body('astrologer_id').isMongoId().withMessage('user_id should be required'),
    body('user_id').isMongoId().withMessage('user_id should be required'),
     body('review').isLength({
       min:1,
       max:20
    }).withMessage('ammount should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required astrologer_id, user_id & review..'
        });
    }
    
    apiUserModel.add_review(req.body).then((result)=>{
   
        if(result){
            res.json({
                result:'true',
                msg:'review add successfully..',
                //data:result
            })
        }else{
 
            res.json({
                result:'false',
                msg:'review does not added..',
            });   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.get('/recharge_plan_list', (req,res,next)=>{
    apiUserModel.recharge_plan_list(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/astrologer_live_list', (req,res,next)=>{
    apiUserModel.astrologer_live_list(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found..',
            })
        }else{
         
            res.json({
                result:'true',
                msg:'record get successfully..',
                data:result
            });
           
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.post('/remove_live_astrologer',
    body('token').isLength({
       min:1,
       max:1000
    }).withMessage('token should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required token..'
        });
    }
    
    apiUserModel.remove_live_astrologer(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
                //data:result
            })
        }else{
            req.token = result[0].token

            if(result[0].token == req.token){
                res.json({
                    result:'true',
                    msg:'astrologer remove successfully..',
                });
            }else{

            }   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/add_live_user',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('token').isLength({
       min:1,
       max:1000
    }).withMessage('token should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required  user_id & token..'
        });
    }
    
    apiUserModel.add_live_user(req.body).then((result)=>{
   
        if(result){
            res.json({
                result:'true',
                msg:'user live successfully..',
                //data:result
            })
        }else{
            res.json({
                result:'false',
                 msg:'user does not live..',
            });
               
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/remove_live_user',
    body('user_id').isMongoId().withMessage('user_id should be required'),
    body('token').isLength({
       min:1,
       max:1000
    }).withMessage('token should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id & token..'
        });
    }
    
    apiUserModel.remove_live_user(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
                //data:result
            })
        }else{
            req.user_id = result.user_id,
            req.token = result.token

            if(result.user_id == req.user_id && result.token == req.token){
                res.json({
                    result:'true',
                    msg:'user remove successfully..',
                });
            }else{

            }   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/generate_agrora_token_calling',
    body('user_id').isMongoId().withMessage('user_id should be required..'),
    body('astrologer_id').isMongoId().withMessage('astrologer_id should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, astrologer_id & channel_name..'
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
       
        
        apiUserModel.generate_agrora_token_calling(req.body,appID,appCertificate,tokenA).then((result)=>{
        
        if(result.length==0){
            res.json({
                result: 'true',
                msg :'user live calling(generate token) successfully..',
                //data:result,
                app_id:appID,
                token: tokenA 
            });
        }else{
            req.user_id = result[0].user_id
            
            if(result[0].user_id == req.user_id){
                res.json({
                     result:'false',
                    msg: 'user already join live calling..',
                })
            }else{

            }
        }   
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/receive_calling_astrologer',
    body('token').isLength({
       min:1,
       max:1000
    }).withMessage('token should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required token..'
        });
    }
    
    apiUserModel.receive_calling_astrologer(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
                //data:result
            })
        }else{

            req.token = result[0].token
            
            if(result[0].token == req.token){
                res.json({
                    result:'true',
                    msg:'astrologer receive the call successfully..',
                    data:{
                        user_id:result[0].user_id,
                        astrologer_id:result[0].astrologer_id,
                        receiving_status:result[0].receiving_status
                    }
                });
            }else{

            }    
               
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/disconnect_calling_astrologer',
    body('token').isLength({
       min:1,
       max:1000
    }).withMessage('token should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required token..'
        });
    }
    
    apiUserModel.disconnect_calling_astrologer(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
            })
        }else{
            req.token = result[0].token
            
            if(result[0].token == req.token){
                res.json({
                    result:'true',
                    msg:'astrologer call disconnected..',
                    data:{
                        user_id:result[0].user_id,
                        astrologer_id:result[0].astrologer_id,
                        disconnect_status:result[0].disconnect_status
                    }
                });
            }else{

            }    
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/remove_calling_user',
    body('token').isLength({
       min:1,
       max:1000
    }).withMessage('token should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required token..'
        });
    }
    
    apiUserModel.remove_calling_user(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found..',
                //data:result
            })
        }else{
            req.token = result[0].token

            if(result[0].token == req.token){
                res.json({
                    result:'true',
                    msg:'call remove successfully..',
                    data:result[0]
                });
            }else{

            }   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/recharge_plan',
    body('user_id').isMongoId().withMessage('user_id should be required..'),
    body('ammount').isLength({
       min:1,
       max:30
    }).withMessage('ammount should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, ammount ..'
        });
    }
    
    apiUserModel.recharge_plan(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'true',
                msg:'recharge_plan add successfully..',
                //data:result
            })
        }else{
            req.user_id = result[0].user_id

            if(result[0].user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'recharge_plan update successfully..',
                    //data:result[0]
                });
            }else{

            }   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});

router.post('/add_chat_details',
    body('user_id').isMongoId().withMessage('user_id should be required..'),
    body('full_name').isLength({
       min:1,
       max:30
    }).withMessage('full_name should be required.'),
     body('gender').isLength({
       min:1,
       max:7
    }).withMessage('gender should be required.'),
      body('date_of_birth').isDate({
    format: 'YYYY/MM/DD',
    strictMode:true,
    endDate: 'today'
    //autoclose:true
    }).withMessage('date_of_birth should be required date formate yyyy/mm/dd..'),
     body('time_of_birth').isDate({
    format: 'hh/mm/ss',
    strictMode:true,
    endTime: 'today'
    }).withMessage('time_of_birth should be required date formate yyyy/mm/dd..'),
     body('place_of_birth').isLength({
       min:1,
       max:20
    }).withMessage('place_of_birth should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, ammount ..'
        });
    }
    
    apiUserModel.recharge_plan(req.body).then((result)=>{
   
        if(result.length==0){
            res.json({
                result:'true',
                msg:'recharge_plan add successfully..',
                //data:result
            })
        }else{
            req.user_id = result[0].user_id

            if(result[0].user_id == req.user_id){
                res.json({
                    result:'true',
                    msg:'recharge_plan update successfully..',
                    //data:result[0]
                });
            }else{

            }   
        }       
    }).catch((err)=>{ 
       res.json({message:err.message});
    })
});




module.exports = router;