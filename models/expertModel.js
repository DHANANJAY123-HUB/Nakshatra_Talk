const db = require('./connection');
const mongoose = require('mongoose'); 
const ObjectId = require('mongoose').Types.ObjectId;
 
function expertModel() {  
   this.register_user=(userDetails)=>{
		
	 	return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				//err: reject(err) : resolve(result)
				if(err){
					reject(err)
				}else{
					var _id;
					var otp = Math.floor(1000 + Math.random() * 9000);
					var flag=0

					if(result.length==0){
						user_id=1
					}else{   
					
						var max_id=result[0]._id

						for(let row of result)
						{

						 if(row._id>max_id)
						 	max_id=row._id
						
						 if(row.mobile_no==userDetails.mobile_no)
						 	flag=1							 	
						 	
						}
						user_id=max_id+1  	
					}
					//userDetails.user_id=user_id
					userDetails.form_status=0
					userDetails.role="astrologer"
					userDetails.current_date= new Date()
					userDetails.otp=otp.toString()

					if(flag)
					{
						resolve(0)
					}
					else
					{
						db.collection('astrologer').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(1);
						 if(err1){
						   	reject(err1)
						   }
						   else
						   {
						   	db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err2,result2)=>{
						   		err2?reject(err2):resolve(result2)
						   	})
						   }
						   resolve(result1)
					 	})	
					}
				}
				resolve(result)
			})
			
		})	
	}

	this.get_verify_phone=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var data = {'current_date': -1}
			db.collection('astrologer').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.verify_otp=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id),'otp':userDetails.otp}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'form_status':"1"}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
				}
				resolve(result)
			})
		})
	}

    this.resend_otp=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  var otp = Math.floor(1000 + Math.random() * 9000);
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'otp':otp.toString()}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        	db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				                err ? reject(err) :resolve(result)
				            })
				        }
				        resolve(result1)
			        })
				}
				//resolve(result)
			})
		})
	}

	this.resend_otp_login=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  var otp = Math.floor(1000 + Math.random() * 9000);
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'otp':otp.toString()}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        	db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				                err ? reject(err) :resolve(result)
				            })
				        }
				        resolve(result1)
			        })
				}
				//resolve(result)
			})
		})
	}

	this.get_skil=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var data = {'current_date': -1}
			db.collection('astrologer').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.skil_details=(userDetails,new_id,img)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'form_status':"2",'profile_pic':img,'gender':userDetails.gender,'dob':userDetails.dob,'total_experiance':userDetails.total_experiance,'primary_skill':userDetails.primary_skill,'all_skill':userDetails.all_skill,'hours_contribute':userDetails.hours_contribute,'hear_about':userDetails.hear_about,'online_platform':userDetails.online_platform}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
				}
				resolve(result)
			})
		})
	}

	this.get_otherskill=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var data = {'current_date': -1}
			db.collection('astrologer').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.otherskill_details=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'form_status':"3",'onboard':userDetails.onboard,'interview_time':userDetails.interview_time,'live_city':userDetails.live_city,'business_source':userDetails.business_source,'highest_qualification':userDetails.highest_qualification,'degree_diploma':userDetails.degree_diploma,'college_name':userDetails.college_name,'astrologer_learing':userDetails.astrologer_learing,'instagram_link':userDetails.instagram_link,'facebook_link':userDetails.facebook_link,'linkedin_link':userDetails.linkedin_link,'youtube_link':userDetails.youtube_link,'website_link':userDetails.website_link,'minimum_earning':userDetails.minimum_earning,'maximum_earning':userDetails.maximum_earning,'refer':userDetails.refer}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
				}
				resolve(result)
			})
		})
	}

	this.get_assignment=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var data = {'current_date': -1}
			db.collection('astrologer').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.assignment_details=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'form_status':"4",'live_countries':userDetails.live_countries,'working_details':userDetails.working_details,'qualities':userDetails.qualities,'challenge':userDetails.challenge,'some_question':userDetails.some_question}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
				}
				resolve(result)
			})
		})
	}

	this.get_verify_phone_login=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var data = {'current_date': -1}
			db.collection('astrologer').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.user_login=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					var otp = Math.floor(1000 + Math.random() * 9000);
					db.collection('astrologer').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'otp':otp.toString(),'current_date':new Date()}},(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1)
						if(err1){
							reject(err1)
						}else{
							db.collection('astrologer').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				                err ? reject(err) :resolve(result)
				            })
						}
						//resolve(result1)
					})
				}
				//resolve(result)
			})
		})
	}

	this.login_otp=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id),'otp':userDetails.otp}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
				/*if(err){
					reject(err)
				}else{
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'form_status':"1"}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
				}
				resolve(result)*/
			})
		})
	}

	this.audio_call_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('audio_call_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.video_call_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('video_call_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.set_rate=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_set_rate').find({'astrologer_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(result.length==0){
					db.collection('astrologer_set_rate').insertOne({'astrologer_id':mongoose.Types.ObjectId(new_id),'audio_rate':userDetails.audio_rate,'video_rate':userDetails.video_rate,'chat_rate':userDetails.chat_rate,'current_date': new Date()},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})
				}else{
					  db.collection('astrologer_set_rate').updateOne({'astrologer_id':ObjectId(new_id)},{$set:{'audio_rate':userDetails.audio_rate,'video_rate':userDetails.video_rate,'chat_rate':userDetails.chat_rate,'current_date': new Date()}},(err2,result2)=>{
				        err2 ? reject(err2) : resolve(result2);
			        })
				}
				resolve(result)
			})
		})
	}

	this.support=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_support_list').find({'astrologer_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(result.length==0){
					db.collection('astrologer_support_list').insertOne({'astrologer_id':mongoose.Types.ObjectId(new_id),'email':userDetails.tag,'email':userDetails.tag,'current_date': new Date()},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})
				}else{
					  db.collection('astrologer_support_list').updateOne({'astrologer_id':ObjectId(new_id)},{$set:{'email':userDetails.email,'tag':userDetails.tag,'current_date': new Date()}},(err2,result2)=>{
				        err2 ? reject(err2) : resolve(result2);
			        })
				}
				resolve(result)
			})
		})
	}

	this.user_profile=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  db.collection('astrologer').updateOne({'_id':ObjectId(new_id)},{$set:{'name':userDetails.name,'email':userDetails.email,'mobile_no':userDetails.mobile_no,'address':userDetails.address,'city':userDetails.city,'state':userDetails.state,'country':userDetails.country,'about':userDetails.about,'aadhar_no':userDetails.aadhar_no,'pan_no':userDetails.pan_no,'address_proof_no':userDetails.address_proof_no,'current_date': new Date()}},(err2,result2)=>{
				        err2 ? reject(err2) : resolve(result2);
			        })
				}
				resolve(result)
			})
		})
	}

	this.payment=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_payment_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.report=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_report_list').find({'astrologer_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(result.length==0){
					db.collection('astrologer_report_list').insertOne({'astrologer_id':mongoose.Types.ObjectId(new_id),'email':userDetails.email,'report':userDetails.report,'current_date': new Date()},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})
				}else{
					  db.collection('astrologer_report_list').updateOne({'astrologer_id':ObjectId(new_id)},{$set:{'email':userDetails.email,'report':userDetails.report,'current_date': new Date()}},(err2,result2)=>{
				        err2 ? reject(err2) : resolve(result2);
			        })
				}
				resolve(result)
			})
		})
	}

	this.waitlist=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)
			  if(err){
				  reject(err)
                }else{
         	    var user_id = result.map(function(i) {
                  return i.user_id;
                });
                db.collection('astrologer_follow_list').aggregate([
              //{ $match: { astrologer_id: ObjectId(userDetails.astrologer_id),'follow_status':'1'} },
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

	this.review=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_review_list').find({}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)
			  if(err){
				  reject(err)
                }else{
         	    var user_id = result.map(function(i) {
                  return i.user_id;
                });
                db.collection('astrologer_review_list').aggregate([
             // { $match: { astrologer_id: ObjectId(userDetails.astrologer_id),'follow_status':'1'} },
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

	this.earing=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_payment_list').find({'type':'credit'}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.follower=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)
			  if(err){
				  reject(err)
                }else{
         	    var user_id = result.map(function(i) {
                  return i.user_id;
                });
                db.collection('astrologer_follow_list').aggregate([
             // { $match: { astrologer_id: ObjectId(userDetails.astrologer_id),'follow_status':'1'} },
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

	this.remove_follower=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('astrologer_follow_list').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }

    this.approve_follower=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('astrologer_follow_list').updateOne({'_id':ObjectId(new_id)},{$set:{'follow_status':'2'}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }
}

module.exports=new expertModel()