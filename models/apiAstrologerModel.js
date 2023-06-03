const db = require('./connection');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

function apiAstrologerModel() { 

	this.registerUser=(userDetails)=>{
		//console.log(userDetails) 
		return new Promise((resolve,reject)=>{ 
			db.collection('astrologer').find({'mobile_no': userDetails.mobile_no}).toArray((err,result)=>{
	 			if(err){
					reject(err)
				}else{
					var OTP = Math.floor(1000 + Math.random() * 9000);
					var flag=0
                    if(result.length==0){
						_id=1
                    }else{   
					    var max_id=result[0]._id
					    for(let row of result){
					    	if(row._id>max_id)
						 	max_id=row._id
						
						 if(row.mobile_no==userDetails.mobile_no)
						 	flag=1							 	
						 	
						}
						_id=max_id+1  	
					}
					userDetails.otp=OTP.toString()
					userDetails.form_status='0'
					userDetails.role="astrologer"
					userDetails.astrologer_status ='0'
					userDetails.chat_status='0'
					userDetails.call_status='0'
					userDetails.report_status='0'
                    userDetails.current_date= new Date()
					//userDetails.fcm = null
					if(flag)
					{
						resolve(0)
					}
					else
					{
						db.collection('astrologer').insertOne(userDetails,(err1,result1)=>{
						   //err1 ? reject(err1) : resolve(result1);
						   if(err1){
						   	reject(err1)
						   }
						   else
						   {
						   	db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err2,result2)=>{
						   		err2?reject(err2):resolve(result2)
						   	})
						   }
					 	})	
					}
					//resolve(result)
				}	
			})
			
		})	
	}

	this.verify_otp=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(userDetails._id),'otp':userDetails.otp}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					db.collection('astrologer').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'form_status':'1'}},(err1,result1)=>{
				     // err1 ? reject(err1) : resolve(result1);
				        if(err1){
				     	    reject(err1)
				        }else{
				     	    db.collection('astrologer').find({'_id':ObjectId(userDetails._id),'otp':userDetails.otp}).toArray((err,result)=>{
				     	        err ? reject(err) : resolve(result);
				     	    })	
				        }
                    })
				}
				//resolve(result)
			})
		})
	}

	this.resendOTP=(userDetails,OTP)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				//err ? reject(err) : resolve(result);
				if(err){
					reject(err)
				}else{
						
                    db.collection('astrologer').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'otp':OTP.toString()}},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		     resolve(result)
		    })
	   })				
    }

    this.user_skill_details=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				 // err ? reject(err) : resolve(result);
				if(err){
				   reject(err)
				}else{
                    db.collection('astrologer').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'form_status':'2','profile_pic':img,'gender':userDetails.gender,'dob':userDetails.dob,'primary_skill':userDetails.primary_skill,'all_skill':userDetails.all_skill,'category_type':userDetails.category_name,'language':userDetails.language,'experiance_year':userDetails.experiance_year,'hours_daily':userDetails.hours_daily,'hear_about':userDetails.hear_about,'online_plateform':userDetails.online_plateform}},(err1,result1)=>{
				     // err1 ? reject(err1) : resolve(result1);
				        if(err1){
				     	    reject(err1)
				        }else{
				     	    db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				     	        err ? reject(err) : resolve(result);
				     	    })	
				        }
                    })
		        }
		     //resolve(result)
            })
		}) 				
	}

	this.user_other_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
				   reject(err)
				}else{
                    db.collection('astrologer').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'form_status':'3','onboard_details':userDetails.onboard_details,'source_income':userDetails.source_income,'matric_qualification':userDetails.matric_qualification,'degree':userDetails.degree,'matric_qualification':userDetails.matric_qualification,'degree':userDetails.degree,'body_reffer':userDetails.body_reffer,'website_link':userDetails.website_link,'minimum_earning':userDetails.minimum_earning,'maximum_earning':userDetails.maximum_earning,'long_bio':userDetails.long_bio}},(err1,result1)=>{
				      //err1 ? reject(err1) : resolve(result1);
                      if(err1){
				     	    reject(err1)
				        }else{
				     	    db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				     	        err ? reject(err) : resolve(result);
				     	    })	
				        }
                    })
		        }
		     //resolve(result)
            })
		}) 				
	}

	this.user_assignment=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
				   reject(err)
				}else{
                    db.collection('astrologer').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'form_status':'4','user_thoughts':userDetails.user_thoughts,'customer_thoughts':userDetails.customer_thoughts,'user_challange':userDetails.user_challange}},(err1,result1)=>{
				      //err1 ? reject(err1) : resolve(result1);
                      if(err1){
				     	    reject(err1)
				        }else{
				     	    db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				     	        err ? reject(err) : resolve(result);
				     	    })	
				        }
                    })
		        }
		     //resolve(result)
            })
		}) 				
	}

	this.user_login=(userDetails,OTP)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					db.collection('astrologer').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'otp':OTP.toString()}},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})
				}
				resolve(result)
			})
		})
	}

	this.primary_skill_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('primary_skill_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.all_skill_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('all_skill_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.language_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('language_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.audio_call_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('audio_call_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.video_call_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('video_call_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.set_rate=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_set_rate').find({'astrologer_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(result.length==0){
					db.collection('astrologer_set_rate').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'audio_rate':userDetails.audio_rate,'video_rate':userDetails.video_rate,'chat_rate':userDetails.chat_rate},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})
				}else{
					db.collection('astrologer_set_rate').updateOne({'astrologer_id':ObjectId(userDetails.astrologer_id)},{$set:{'audio_rate':userDetails.audio_rate,'video_rate':userDetails.video_rate,'chat_rate':userDetails.chat_rate}},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})
				}
				resolve(result)
			})
		})
	}

	this.astrologer_support=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_support_list').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'email':userDetails.email,'query':userDetails.query},(err,result)=>{
				err ? reject(err) : resolve(result);
			})
				
		})
	}

	this.waiting_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'follow_status':'1'}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)	
			  if(err){
				  reject(err)
                }else{
         	    var user_id = result.map(function(i) {
                  return i.user_id;
                });
                db.collection('astrologer_follow_list').aggregate([
              { $match: { astrologer_id: ObjectId(userDetails.astrologer_id),'follow_status':'1'} },
         		{ $lookup:
         			{
         				from: 'user',
         				localField : 'user_id',
         				foreignField :'_id',
         				as :'user_data'
         			}
         			},
         			{
         			 $unwind: "$user_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "user_data._v": 0,
                    //"user_data._id": 0,
                    // "user_data.name": 0,
                    //"user_data.profile_pic":0,
                    "user_data.mobile_no":0,
                    "user_data.otp":0,
                    "user_data.form_status":0,
                    "user_data.current_address":0,
                    "user_data.role": 0,
                    "user_data.current_date":0,
                    "user_data.email":0,
                    "user_data.gender":0,
                    "user_data.dob":0,
                    "user_data.pob":0,
                    "user_data.tob":0,
                    "user_data.city_state":0,
                    "user_data.pin_code":0,
                  
                    }
                    },
         		
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)

		    })
		})				
	}

	this.approve_follower=(userDetails,OTP)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					db.collection('astrologer_follow_list').updateOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)},{$set:{'follow_status':userDetails.status}},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})
				}
				resolve(result)
			})
		})
	}

	this.approve_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'follow_status':'2'}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)	
			  if(err){
				  reject(err)
                }else{
         	    var user_id = result.map(function(i) {
                  return i.user_id;
                });
                db.collection('astrologer_follow_list').aggregate([
              { $match: { astrologer_id: ObjectId(userDetails.astrologer_id),'follow_status':'2'} },
         		{ $lookup:
         			{
         				from: 'user',
         				localField : 'user_id',
         				foreignField :'_id',
         				as :'user_data'
         			}
         			},
         			{
         			 $unwind: "$user_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "user_data._v": 0,
                    //"user_data._id": 0,
                    // "user_data.name": 0,
                    //"user_data.profile_pic":0,
                    "user_data.mobile_no":0,
                    "user_data.otp":0,
                    "user_data.form_status":0,
                    "user_data.current_address":0,
                    "user_data.role": 0,
                    "user_data.current_date":0,
                    "user_data.email":0,
                    "user_data.gender":0,
                    "user_data.dob":0,
                    "user_data.pob":0,
                    "user_data.tob":0,
                    "user_data.city_state":0,
                    "user_data.pin_code":0,
                  
                    }
                    },
         		
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)

		    })
		})				
	}

	this.update_astrologer_profile=(new_id,userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
				    db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:userDetails/*{'name':userDetails.name}*/},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        });
			        
		        }
		      resolve(result)
		    })
		})
    }

    this.payment_history=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_payment_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.astrologer_report=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_report_list').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'email':userDetails.email,'report':userDetails.report},(err,result)=>{
				err ? reject(err) : resolve(result);
			})
				
		})
	}

	this.astrologer_review_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_review_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)	
			   if(err){
				  reject(err)
                }else{
         	    var user_id = result.map(function(i) {
                  return i.user_id;
                });

                db.collection('astrologer_review_list').aggregate([
              { $match: { astrologer_id: ObjectId(userDetails.astrologer_id)} },
         		{ $lookup:
         			{
         				from: 'user',
         				localField : 'user_id',
         				foreignField :'_id',
         				as :'user_data'
         			}
         			},
         			{
         			 $unwind: "$user_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "user_data._v": 0,
                    "user_data._id": 0,
                    // "user_data.name": 0,
                    "user_data.mobile_no":0,
                    "user_data.otp":0,
                    "user_data.form_status":0,
                    "user_data.current_address":0,
                    "user_data.role": 0,
                    "user_data.current_date":0,
                    "user_data.email":0,
                    "user_data.gender":0,
                    "user_data.dob":0,
                    "user_data.pob":0,
                    "user_data.tob":0,
                    "user_data.city_state":0,
                    "user_data.pin_code":0,
                  
                    }
                    },
         		
                    ]).toArray((err1,result1)=>{
         		        err1 ? reject(err1):resolve(result1)
                    })
         		}
         		//resolve(result)
		    })
		})				
	}

	this.remove_follower=(userDetails,OTP)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					db.collection('astrologer_follow_list').deleteOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})
				}
				resolve(result)
			})
		})
	}

	this.generate_agrora_token=(userDetails,appID,appCertificate,tokenA)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_token_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(result.length==0){
                    db.collection('astrologer_token_list').insertOne({'astrologer_id':mongoose.Types.ObjectId(userDetails.astrologer_id),'app_id':appID,'app_certificate':appCertificate,'channel_name':userDetails.channel_name,'token':tokenA,'total_views':0,'current_date':new Date()},(err1,result1)=>{
			            err1 ? reject(err1) : resolve(result1);
			        }) 
                }else{


                }
                resolve(result)
            })    
		})    
	}

	this.get_astrologer_profile=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.astrologer_chat_status=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('astrologer').find({'_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				//err ? reject(err) : resolve(result); 
				if(err){
					reject(err)
				}else{
					var chat_status;
					if(userDetails.status == '1'){
						chat_status = '1'
					}else if(userDetails.status == '0'){
                         chat_status = '0'
					}else{

					}
				    db.collection('astrologer').updateOne({'_id':ObjectId(userDetails.astrologer_id)},{$set:{'chat_status':chat_status}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
                           db.collection('astrologer').find({'_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				             err ? reject(err) : resolve(result);
				            })
				        }
				        //resolve(result1)
			        });
			        
		        }
		      //resolve(result)
		    })
		})
    }

    this.astrologer_call_status=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('astrologer').find({'_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				//err ? reject(err) : resolve(result); 
				if(err){
					reject(err)
				}else{
					var call_status;
					if(userDetails.status == '1'){
						call_status = '1'
					}else if(userDetails.status == '0'){
                        call_status = '0'
					}else{

					}
				    db.collection('astrologer').updateOne({'_id':ObjectId(userDetails.astrologer_id)},{$set:{'call_status':call_status}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
                           db.collection('astrologer').find({'_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				             err ? reject(err) : resolve(result);
				            })
				        }
				        //resolve(result1)
			        });
			        
		        }
		      //resolve(result)
		    })
		})
    }

    this.astrologer_report_status=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('astrologer').find({'_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				//err ? reject(err) : resolve(result); 
				if(err){
					reject(err)
				}else{
					var report_status;
					if(userDetails.status == '1'){
						report_status = '1'
					}else if(userDetails.status == '0'){
                        report_status = '0'
					}else{

					}
				    db.collection('astrologer').updateOne({'_id':ObjectId(userDetails.astrologer_id)},{$set:{'report_status':report_status}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
                           db.collection('astrologer').find({'_id':ObjectId(userDetails.astrologer_id)}).toArray((err,result)=>{
				             err ? reject(err) : resolve(result);
				            })
				        }
				        //resolve(result1)
			        });
			        
		        }
		      //resolve(result)
		    })
		})
    }

}
module.exports=new apiAstrologerModel()