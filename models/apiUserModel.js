const db = require('./connection');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

function apiUserModel() {  
  
	this.registerUser=(userDetails)=>{
		return new Promise((resolve,reject)=>{ 
			
			db.collection('user').find({'mobile_no': userDetails.mobile_no}).toArray((err,result)=>{
	 			//err ? reject(err) : resolve(result);
				var OTP = Math.floor(1000 + Math.random() * 9000);
                    
                if(result.length==0){
                    userDetails.otp=OTP.toString()
					userDetails.role="user"
					userDetails.current_date= new Date()
					
					db.collection('user').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1);
						if(err1){
							reject(err1)
						}else{
							db.collection('user').find({'mobile_no': userDetails.mobile_no}).toArray((err,result)=>{
				                err ? reject(err) : resolve(result);	
					        })
						}
					})
				}else{   
				   db.collection('user').find({'mobile_no': userDetails.mobile_no}).toArray((err,result)=>{
				        err ? reject(err) : resolve(result);	
					})
					
				}
				//resolve(result)
			})
		})	
	}

	this.upload_image=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
					
                    db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_pic':img}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
		        }
		     resolve(result)
		    })
	    })
	}

	this.verify_otp=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id),'otp':userDetails.otp}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.resendOTP=(userDetails,OTP )=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
					
                    db.collection('user').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'otp':OTP.toString()}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
		        }
		     resolve(result)
		    })
	   })				
    }

    this.get_user_profile=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	/*this.update_user_profile_data=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
				   reject(err)
				}else{
                    db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'gender':userDetails.gender,'dob':userDetails.dob,'tob':userDetails.tob,'pob':userDetails.pob,'current_address':userDetails.current_address,'pin_code':userDetails.pin_code,'city_state':userDetails.city_state}},(err1,result1)=>{
				      err1 ? reject(err1) : resolve(result1);
                    })
		        }
		     resolve(result)
            })
		}) 				
	}*/

	this.update_user_profile_data=(new_id,userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
					
					//if(userDetails !== "0"){
						 //db.collection('user').updateOne({'_id':ObjectId(new_id)},{$set:{'name':userDetails.name,'gender':userDetails.gender,'dob':userDetails.dob,'tob':userDetails.tob,'pob':userDetails.pob,'current_address':userDetails.current_address,'pin_code':userDetails.pin_code,'city_state':userDetails.city_state}},{ "upsert" : true },(err1,result1)=>{
			            db.collection('user').updateOne({'_id':ObjectId(new_id)},{$set:userDetails/*{'name':userDetails.name}*/},(err1,result1)=>{
				            err ? reject(err1) : resolve(result1);
			            });
			        //}else{

			        //}
		        }
		      resolve(result)
		    })
		})
    }

    this.blog_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_blog_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.blog_list_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_blog_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.news_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_news_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.news_list_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_news_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.client_testimonials_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('client_testimonials_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.celebrity_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_celebrity_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	/*this.update_user_profile=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
				   reject(err)
				}else{
                    db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'name':userDetails.name,'email':userDetails.email}},(err1,result1)=>{
				      err1 ? reject(err1) : resolve(result1);
                    })
		        }
		       resolve(result)
            })
		})				
	}*/

	this.puja_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_puja_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.puja_list_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_puja_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.astrologer_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_block_list').find({'user_id':ObjectId(userDetails.user_id),'block_status':'1'}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)	
			    if(result.length==0){
				    db.collection('astrologer').find({}).toArray((err1,result1)=>{
			            err1?reject(err1):resolve(result1)	
                    })
                }else{
         	   
         	       var astrologer_id = result.map(function(i) {
                        return i.astrologer_id;
                    });

         	       db.collection('astrologer').find({'_id':{$nin :astrologer_id}}).toArray((err1,result1)=>{
			            err1?reject(err1):resolve(result1)	
                    })
                }
         	    //resolve(result)
		    })

		})				
	}

	this.astrologer_list_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)
			})
		})				
	}

	this.astrologer_block=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_block_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id),}).toArray((err,result)=>{
				if(result.length==0){
				   db.collection('astrologer_block_list').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id),'block_status':userDetails.block_status,'reason':userDetails.reason},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})	
				}else{
                    db.collection('astrologer_block_list').updateOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id),},{$set:{'block_status':userDetails.block_status,'reason':userDetails.reason}},(err2,result2)=>{
				      err2 ? reject(err2) : resolve(result2);
                    })
		        }
		       resolve(result)
            })
		})				
	}

	this.astrologer_block_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_block_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			    if(err){
				  reject(err)
                }else{
         	   var astrologer_id = result.map(function(i) {
                  return i.astrologer_id;
                });
          
          	db.collection('astrologer_block_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id), 'block_status':'1'} },
         		{ $lookup:
         			{
         				from: 'astrologer',
         				localField : 'astrologer_id',
         				foreignField :'_id',
         				as :'astrologer_data'
         			}
         			},
         			{
         			 $unwind: "$astrologer_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "astrologer_data._v": 0,
                    //"astrologer_data._id": 0,
                    // "astrologer_data.name": 0,
                    "astrologer_data.email":0,
                    "astrologer_data.mobile_no":0,
                    "astrologer_data.otp":0,
                    "astrologer_data.form_status":0,
                    //"astrologer_data.role": 0,
                    "astrologer_data.current_date":0,
                    "astrologer_data.all_skill":0,
                    "astrologer_data.dob":0,
                    "astrologer_data.experiance_year":0,
                    "astrologer_data.gender":0,
                    "astrologer_data.hear_about":0,
                    "astrologer_data.hours_daily":0,
                    "astrologer_data.language":0,
                    "astrologer_data.online_plateform":0,
                    "astrologer_data.primary_skill":0,
                    //"astrologer_data.profile_pic":0,
                    "astrologer_data.rating":0,
                    "astrologer_data.body_reffer":0,
                    "astrologer_data.city":0,
                    "astrologer_data.degree":0,
                    "astrologer_data.interview_time":0,
                    "astrologer_data.long_bio":0,
                    "astrologer_data.matric_qualification":0,
                    "astrologer_data.maximum_earning":0,
                    "astrologer_data.minimum_earning":0,
                    "astrologer_data.onboard_details":0,
                    "astrologer_data.source_income":0,
                    "astrologer_data.website_link":0,
                    "astrologer_data.customer_thoughts":0,
                    "astrologer_data.user_challange":0,
                    "astrologer_data.user_thoughts":0,
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

	this.astrologer_feedback=(userDetails)=>{
		return new Promise((resolve,reject)=>{
		    db.collection('user_astrologer_feedback').insertOne({'user_id':ObjectId(userDetails.user_id),'tag':userDetails.tag},(err,result)=>{
				err ? reject(err) : resolve(result);
            })
		})				
	}

	this.category_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('category_list').find({'category_status':1}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.all_category_list_data=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}
 
	this.category_list_details=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'category_type':userDetails.category_name},{$project: {'_id':0}}).toArray((err,result)=>{
			   err?reject(err):resolve(result)	
            })
		})				
	}

	this.search=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'name':userDetails.name}).toArray((err,result)=>{
			   err?reject(err):resolve(result)
			})
		})
	}

	this.filter_price=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var charging_price = {'charging_price': -1}
			db.collection('astrologer').find({}).sort(charging_price).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.filter_experiance=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var experiance_year = {'experiance_year': -1}
			db.collection('astrologer').find({}).sort(experiance_year).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}	

	this.filter_gender=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'gender':userDetails.gender}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}	

	this.filter_rating=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var rating = {'rating': -1}
			db.collection('astrologer').find({}).sort(rating).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.all_filter=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			//var sort_list = {'experiance_year': -1}
			//var experiance_year ={$or: [{'experiance_year': -1},{'experiance_year': 1}]}
			//var order ={$or:  [{'poja_booking': -1},{'poja_booking': 1}]}
			//var rating ={$or: [{'rating': -1},{'rating': -1}]}
			db.collection('astrologer').find({}).sort({'experiance_year': -1,'rating':-1,'order':-1}).toArray((err,result)=>{
				//db.collection('astrologer').find({'astrologer': { $elemMatch: { 'experiance_year': userDetails.experiance_year,'price': userDetails.price, 'gender': userDetails.gender} } }).toArray((err,result)=>{
					//db.collection('astrologer').find(userDetails).toArray((err,result)=>{
			           //err?reject(err):resolve(result)	
		    })
		})				
	}

	this.astrologer_follow=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				if(result.length==0){
				   db.collection('astrologer_follow_list').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id),'follow_status':userDetails.status},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})	
				}else{
                    db.collection('astrologer_follow_list').updateOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)},{$set:{'follow_status':userDetails.status}},(err2,result2)=>{
				      err2 ? reject(err2) : resolve(result2);
                    })
		        }
		       resolve(result)
            })
		})				
	} 

	this.astrologer_follow_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_follow_list').find({'user_id':ObjectId(userDetails.user_id),$or:[{'follow_status':'1'},{'follow_status':'2'}]}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			    if(err){
				  reject(err)
                }else{
         	    var astrologer_id = result.map(function(i) {
                  return i.astrologer_id;
                });
                //var user_id = userDetails.user_id;
               // $or:[{'sender_id':ObjectId(sender_id1)},{'receiver_id':ObjectId(receiver_id1)}]}
          	db.collection('astrologer_follow_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id),$or:[{'follow_status':'1'},{'follow_status':'2'}]} },
         		{ $lookup:
         			{
         				from: 'astrologer',
         				localField : 'astrologer_id',
         				foreignField :'_id',
         				as :'astrologer_data'
         			}
         			},
         			{
         			 $unwind: "$astrologer_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "astrologer_data._v": 0,
                    //"astrologer_data._id": 0,
                    // "astrologer_data.name": 0,
                    "astrologer_data.email":0,
                    "astrologer_data.mobile_no":0,
                    "astrologer_data.otp":0,
                    "astrologer_data.form_status":0,
                    //"astrologer_data.role": 0,
                    "astrologer_data.current_date":0,
                    "astrologer_data.all_skill":0,
                    "astrologer_data.dob":0,
                    //"astrologer_data.experiance_year":0,
                    "astrologer_data.gender":0,
                    "astrologer_data.hear_about":0,
                    "astrologer_data.hours_daily":0,
                    //"astrologer_data.language":0,
                    "astrologer_data.online_plateform":0,
                    //"astrologer_data.primary_skill":0,
                    //"astrologer_data.profile_pic":0,
                    //"astrologer_data.rating":0,
                    "astrologer_data.body_reffer":0,
                    "astrologer_data.city":0,
                    "astrologer_data.degree":0,
                    "astrologer_data.interview_time":0,
                    "astrologer_data.long_bio":0,
                    "astrologer_data.matric_qualification":0,
                    "astrologer_data.maximum_earning":0,
                    "astrologer_data.minimum_earning":0,
                    "astrologer_data.onboard_details":0,
                    "astrologer_data.source_income":0,
                    "astrologer_data.website_link":0,
                    "astrologer_data.customer_thoughts":0,
                    "astrologer_data.user_challange":0,
                    "astrologer_data.user_thoughts":0,
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

	this.astrologer_booking=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_booking_list').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id), 'ammount':parseInt(userDetails.ammount),'current_date':new Date()},(err,result)=>{
			   err ? reject(err) : resolve(result);
			})
		})				
	}

	this.astrologer_booking_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_booking_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			    if(err){
				  reject(err)
                }else{
         	    var astrologer_id = result.map(function(i) {
                  return i.astrologer_id;
                });
     
          
          	db.collection('astrologer_booking_list').aggregate([
              { $match: { user_id: ObjectId(userDetails.user_id)} },
         		{ $lookup:
         			{
         				from: 'astrologer',
         				localField : 'astrologer_id',
         				foreignField :'_id',
         				as :'astrologer_data'
         			}
         			},
         			{
         			 $unwind: "$astrologer_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "astrologer_data._v": 0,
                    //"astrologer_data._id": 0,
                    // "astrologer_data.name": 0,
                    "astrologer_data.email":0,
                    "astrologer_data.mobile_no":0,
                    "astrologer_data.otp":0,
                    "astrologer_data.form_status":0,
                    //"astrologer_data.live_status":0,
                    //"astrologer_data.role": 0,
                    "astrologer_data.current_date":0,
                    "astrologer_data.all_skill":0,
                    "astrologer_data.dob":0,
                    //"astrologer_data.experiance_year":0,
                    "astrologer_data.gender":0,
                    "astrologer_data.hear_about":0,
                    "astrologer_data.hours_daily":0,
                    //"astrologer_data.language":0,
                    "astrologer_data.online_plateform":0,
                    //"astrologer_data.primary_skill":0,
                    //"astrologer_data.profile_pic":0,
                    //"astrologer_data.rating":0,
                    "astrologer_data.body_reffer":0,
                    "astrologer_data.city":0,
                    "astrologer_data.degree":0,
                    "astrologer_data.interview_time":0,
                    "astrologer_data.long_bio":0,
                    "astrologer_data.matric_qualification":0,
                    "astrologer_data.maximum_earning":0,
                    "astrologer_data.minimum_earning":0,
                    "astrologer_data.onboard_details":0,
                    "astrologer_data.source_income":0,
                    "astrologer_data.website_link":0,
                    "astrologer_data.customer_thoughts":0,
                    "astrologer_data.user_challange":0,
                    "astrologer_data.user_thoughts":0,
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

	this.add_review=(userDetails)=>{
		return new Promise((resolve,reject)=>{
            var currentdate = new Date(); 
			var datetime =  currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + "T"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
			db.collection('astrologer_review_list').find({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				if(result.length==0){
				   db.collection('astrologer_review_list').insertOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id),'review':parseInt(userDetails.review),'current_date': datetime},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})	
				}else{
                    db.collection('astrologer_review_list').updateOne({'astrologer_id':ObjectId(userDetails.astrologer_id),'user_id':ObjectId(userDetails.user_id)},{$set:{'review':parseInt(userDetails.review),'current_date': datetime}},(err2,result2)=>{
				      err2 ? reject(err2) : resolve(result2);
                    })
		        }
		       resolve(result)
            })
		})				
	} 

	this.recharge_plan_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_plan_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)	
		    })
		})				
	}

	this.astrologer_live_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_token_list').find({}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)
			  if(err){
			  	reject(err)
			  }else{
			   var astrologer_id = result.map(function(i) {
                  return i.astrologer_id;
                });
     
          
          	db.collection('astrologer_token_list').aggregate([
         		{ $lookup:
         			{
         				from: 'astrologer',
         				localField : 'astrologer_id',
         				foreignField :'_id',
         				as :'astrologer_data'
         			}
         			},
         			{
         			 $unwind: "$astrologer_data"
         			},
                    {
                    $project: {
                    __v: 0,
                    "astrologer_data._v": 0,
                    //"astrologer_data._id": 0,
                    // "astrologer_data.name": 0,
                    "astrologer_data.email":0,
                    "astrologer_data.mobile_no":0,
                    "astrologer_data.otp":0,
                    "astrologer_data.form_status":0,
                    "astrologer_data.live_status":0,
                    "astrologer_data.role": 0,
                    "astrologer_data.current_date":0,
                    "astrologer_data.all_skill":0,
                    "astrologer_data.dob":0,
                    "astrologer_data.experiance_year":0,
                    "astrologer_data.category_type":0,
                    "astrologer_data.gender":0,
                    "astrologer_data.hear_about":0,
                    "astrologer_data.hours_daily":0,
                    "astrologer_data.language":0,
                    "astrologer_data.online_plateform":0,
                    "astrologer_data.primary_skill":0,
                    //"astrologer_data.profile_pic":0,
                    "astrologer_data.rating":0,
                    "astrologer_data.body_reffer":0,
                    "astrologer_data.city":0,
                    "astrologer_data.degree":0,
                    "astrologer_data.interview_time":0,
                    "astrologer_data.long_bio":0,
                    "astrologer_data.matric_qualification":0,
                    "astrologer_data.maximum_earning":0,
                    "astrologer_data.minimum_earning":0,
                    "astrologer_data.onboard_details":0,
                    "astrologer_data.source_income":0,
                    "astrologer_data.website_link":0,
                    "astrologer_data.customer_thoughts":0,
                    "astrologer_data.user_challange":0,
                    "astrologer_data.user_thoughts":0,
                    "astrologer_data.high_qualification":0,
                   // "astrologer_data.charging_price":0,
                    "astrologer_data.description":0,
                    "astrologer_data.review":0,

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
    
    this.remove_live_astrologer=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer_token_list').find({'token':userDetails.token}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)

			    if(err){
			  	   reject(err)
			    }else{
			  	   db.collection('astrologer_token_list').deleteOne({'token':userDetails.token},(err2,result2)=>{
				      //err2 ? reject(err2) : resolve(result2);
				        if(err2){
				        	reject(err2)
				        }else{
				            db.collection('user_live_list').find({'token':userDetails.token}).toArray((err3,result3)=>{
			   		        //err3 ? reject(err3) : resolve(result3);
			   		            if (err3) {
			   	                   reject(err3)
			   	                }else{
			   	        	  
			   	                    db.collection('user_live_list').deleteMany({'token':userDetails.token},(err4,result4)=>{
				                        err4 ? reject(err4) : resolve(result4);
				                    })	
			   	                }  
			   	              resolve(result3)
			   		        })
				        }
				        resolve(result2)
                    })
			    }
			    resolve(result) 
		    })
		})				
	}

	this.add_live_user=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_live_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'token':userDetails.token,'current_date':new Date()},(err,result)=>{
			  // err ? reject(err) : resolve(result);
			    if (err) {
			   	    reject(err)
			    }else{
			   	    db.collection('astrologer_token_list').find({'token':userDetails.token}).toArray((err1,result1)=>{
			   		    //err1 ? reject(err1) : resolve(result1);
			   		   if (err1) {
			   	          reject(err1)
			   	      }else{
			   	        	var total_views = result1[0].total_views;
			   	        	var total_live_views;
			   	        	total_live_views = total_views + 1; 
			   	            db.collection('astrologer_token_list').updateOne({'token':userDetails.token},{$set:{'total_views':total_live_views}},(err1,result1)=>{
				                err1 ? reject(err1) : resolve(result1);
				            })	
			   	        }  
			   	        resolve(result1)
			   		})
                }
			})
		})				
	}

	this.remove_live_user=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_live_list').find({'user_id':ObjectId(userDetails.user_id),'token':userDetails.token}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)

			    if(err){
			  	   reject(err)
			    }else{
			  	   db.collection('user_live_list').deleteOne({'user_id':ObjectId(userDetails.user_id),'token':userDetails.token},(err2,result2)=>{
				      //err2 ? reject(err2) : resolve(result2);
                        if(err2){
			   	            reject(err2)
			            }else{
			   	            db.collection('astrologer_token_list').find({'token':userDetails.token}).toArray((err3,result3)=>{
			   		           //err3 ? reject(err3) : resolve(result3);
			   		            if(err3){
			   	                    reject(err3)
			   	                }else{
			   	        	        var total_views = result3[0].total_views;
			   	        	        console.log(total_views);
			   	        	        var total_live_views;
			   	        	        total_live_views = total_views - 1; 
			   	                    db.collection('astrologer_token_list').updateOne({'token':userDetails.token},{$set:{'total_views':total_live_views}},(err4,result4)=>{
				                        err4 ? reject(err4) : resolve(result4);
				                    })	
			   	                }  
			   	              resolve(result3)
			   		        })
                        }
                         resolve(result2)
                    })
			    }
			    resolve(result)
		    })
		})				
	}

	this.generate_agrora_token_calling=(userDetails,appID,appCertificate,tokenA)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_calling_list').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
			   //err?reject(err):resolve(result)
			   if(result.length==0){
                    db.collection('user_calling_list').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'astrologer_id':mongoose.Types.ObjectId(userDetails.astrologer_id),'app_id':appID,'app_certificate':appCertificate,'channel_name':userDetails.channel_name,'token':tokenA,'disconnect_status':0, 'receiving_status':0,'start_calling':'00:00:00','end_calling':'00:00:00','current_date':new Date()},(err1,result1)=>{
			            err1 ? reject(err1) : resolve(result1);
			        }) 
                }else{


                }
                resolve(result)
            })    
		})    
	}

	this.receive_calling_astrologer=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_calling_list').find({'token':userDetails.token}).toArray((err,result)=>{
			    //err ? reject(err) : resolve(result);
			   	if (err) {
			   	    reject(err)
			   	}else{

			   		var currentdate = new Date(); 
			        var datetime =  currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
			   	    db.collection('user_calling_list').updateOne({'token':userDetails.token},{$set:{'receiving_status':2,'disconnect_status':0,'start_calling':datetime}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        	db.collection('user_calling_list').find({'token':userDetails.token}).toArray((err2,result2)=>{
			                   err2 ? reject(err2) : resolve(result2);
			                })
				        }
				        //resolve(result1)
				    })	
			   	}  
			   //	resolve(result)
			})
        })				
	}

	this.disconnect_calling_astrologer=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_calling_list').find({'token':userDetails.token}).toArray((err,result)=>{
			    //err ? reject(err) : resolve(result);
			   	if (err) {
			   	    reject(err)
			   	}else{

			   	    db.collection('user_calling_list').updateOne({'token':userDetails.token},{$set:{'disconnect_status':1,'receiving_status':0}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				           db.collection('user_calling_list').find({'token':userDetails.token}).toArray((err2,result2)=>{
			                    //err2?reject(err2):resolve(result2)
			                    if(err2){
			                    	reject(err2)
			                    }else{
			                        db.collection('user_calling_list').deleteOne({'token':userDetails.token},(err3,result3)=>{
				                       err3 ? reject(err3) : resolve(result3);
                                    })	
			                    }
			                    resolve(result2)
			                })    
				        }
				        //resolve(result1)
				    })	
			   	}  
			   //resolve(result)
			})
        })				
	}

	this.remove_calling_user=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_calling_list').find({'token':userDetails.token}).toArray((err,result)=>{
			  //err?reject(err):resolve(result)
               if (err) {
			   	    reject(err)
			   	}else{
			   		var start_calling = result[0].start_calling;
			   		console.log(start_calling)
			   		var currentdate = new Date(); 
			        var datetime =  currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds()
                    console.log(datetime)
                    const data = {
                        endTime: datetime,
                        startTime: start_calling
                    };
                    const { endTime, startTime } = data;
                    const endTimeArr = endTime.split(':').map(el => +el);
                    const startTimeArr = startTime.split(':').map(el => +el);
                    const resArr = endTimeArr.map((el, i) => el - startTimeArr[i]);
                    const call_duration = resArr.join(':');
                    console.log(call_duration)
			   	    db.collection('user_calling_list').updateOne({'token':userDetails.token},{$set:{'astrologer_id':mongoose.Types.ObjectId(userDetails.astrologer_id),'receiving_status':2,'disconnect_status':0,'end_calling':datetime,'duration_time':call_duration}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
			  	            reject(err1)
			            }else{
			            	db.collection('user_calling_list').find({'token':userDetails.token}).toArray((err2,result2)=>{
			                    //err2?reject(err2):resolve(result2)
			                     if(err2){
			  	                    reject(err2)
			                    }else{
			                    	db.collection('user_calling_list').deleteOne({'token':userDetails.token},(err3,result3)=>{
				                       err3 ? reject(err3) : resolve(result3);
                                    })
                                }
                               resolve(result2)     
			                })
			  	            /*db.collection('user_calling_list').deleteOne({'token':userDetails.token},(err2,result2)=>{
				                err2 ? reject(err2) : resolve(result2);
                            })*/
			            }
			           // resolve(result1)
			        })	
			   	}  
			   //resolve(result)
		    })
		})				
	}

	this.recharge_plan=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('recharge_plan').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				if(result.length==0){
				   db.collection('recharge_plan').insertOne({'user_id':ObjectId(userDetails.user_id),'ammount':parseInt(userDetails.ammount),'current_date': new Date()},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
					})	
				}else{
					var ammount = result[0].ammount;
					var total_ammount = parseInt(userDetails.ammount) + ammount;
                    db.collection('recharge_plan').updateOne({'user_id':ObjectId(userDetails.user_id)},{$set:{'ammount':parseInt(total_ammount),'current_date': new Date()}},(err2,result2)=>{
				      err2 ? reject(err2) : resolve(result2);
                    })
		        }
		       resolve(result)
            })
		})				
	} 

}

module.exports=new apiUserModel()