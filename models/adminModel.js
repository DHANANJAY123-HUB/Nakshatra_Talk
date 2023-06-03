const db = require('./connection');
const mongoose = require('mongoose'); 
const ObjectId = require('mongoose').Types.ObjectId;
 
function adminModel() {  

	this.register_user=(userDetails)=>{
		
		return new Promise((resolve,reject)=>{
			db.collection('admin_user').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				//err: reject(err) : resolve(result)
				if(err){
					reject(err)
				}else{
					var _id;
					var otp = Math.floor(1000 + Math.random() * 9000);
					var flag=0

					if(result.length==0){
						_id=1
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
					userDetails.role="admin"
					userDetails.current_date= new Date()
					userDetails.otp=otp.toString()

					if(flag)
					{
						resolve(0)
					}
					else
					{
						db.collection('admin_user').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(1);
						 if(err1){
						   	reject(err1)
						   }
						   else
						   {
						   	db.collection('admin_user').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
						   		err?reject(err):resolve(result)
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
			db.collection('admin_user').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.verify_otp=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('admin_user').find({'_id':ObjectId(new_id),'otp':userDetails.otp}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
				/*if(err){
					reject(err)
				}else{
					  db.collection('admin_user').updateOne({'_id':ObjectId(new_id)},{$set:{'form_status':"1"}},(err1,result1)=>{
				        err ? reject(err1) : resolve(result1);
			        })
				}
				resolve(result)*/
			})
		})
	}

	this.resend_otp=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('admin_user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  var otp = Math.floor(1000 + Math.random() * 9000);
					  db.collection('admin_user').updateOne({'_id':ObjectId(new_id)},{$set:{'otp':otp.toString()}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        	db.collection('admin_user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
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
			db.collection('admin_user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					  var otp = Math.floor(1000 + Math.random() * 9000);
					  db.collection('admin_user').updateOne({'_id':ObjectId(new_id)},{$set:{'otp':otp.toString()}},(err1,result1)=>{
				        //err1 ? reject(err1) : resolve(result1);
				        if(err1){
				        	reject(err1)
				        }else{
				        	db.collection('admin_user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
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

	this.get_verify_phone_admin_login=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			var data = {'current_date': -1}
			db.collection('admin_user').find({}).sort(data).limit(1).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	this.user_login=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('admin_user').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					var otp = Math.floor(1000 + Math.random() * 9000);
					db.collection('admin_user').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'otp':otp.toString(),'current_date':new Date()}},(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1)
						if(err1){
							reject(err1)
						}else{
						    db.collection('admin_user').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
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
			db.collection('admin_user').find({'_id':ObjectId(new_id),'otp':userDetails.otp}).toArray((err,result)=>{
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

	this.user_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)
			})
		})
	}
	
	this.add_blog=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
			var currentdate = new Date(); 
			var datetime =  currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + "T"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
	        db.collection('admin_blog_list').insertOne({'image':img ,'title':userDetails.title,'description':userDetails.description,'current_date': datetime},(err,result)=>{
			    err ? reject(err) : resolve(result);
			})
		})
	}

	this.user_view=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})
	}

	this.delete_user=(new_id)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('user').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		       resolve(result)
		    })
		})
    }

    this.expert_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)
			})
		})
	}

	this.expert_view=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})
	}

	this.delete_expert=(new_id)=>{
		return new Promise((resolve,reject)=>{
				db.collection('astrologer').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('astrologer').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		       resolve(result)
		    })
		})
    }

    this.category_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('category_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)
			})
		})
	}

	this.manage_category_status=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('category_list').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			if(userDetails.s=='1'){
				db.collection('category_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'category_status':0}},(err1,result1)=>{
					err1 ? reject(err1) : resolve(result1);
				})
			}else if(userDetails.s=='0'){
				db.collection('category_list').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'category_status':1}},(err2,result2)=>{
					err2 ? reject(err2) : resolve(result2);
				})
			}else{
				
			}
		   }
		   resolve(result)
		  })  
		})	
	}

	this.add_category=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
	        db.collection('category_list').insertOne({'image':img ,'category_name':userDetails.category_name,'category_status':0,'current_date': new Date()},(err,result)=>{
			    err ? reject(err) : resolve(result);
			})
		})
	}

	this.about=(userDetails)=>{
		return new Promise((resolve,reject)=>{
	        db.collection('about_us').insertOne({'title':userDetails.title,'description':userDetails.description,'current_date': new Date()},(err,result)=>{
			    err ? reject(err) : resolve(result);
			})
		})
	}

	this.privacy_policy=(userDetails)=>{
		return new Promise((resolve,reject)=>{
	        db.collection('privacy_policy').insertOne({'title':userDetails.title,'description':userDetails.description,'current_date': new Date()},(err,result)=>{
			    err ? reject(err) : resolve(result);
			})
		})
	}

	this.terms=(userDetails)=>{
		return new Promise((resolve,reject)=>{
	        db.collection('terms_and_condition').insertOne({'title':userDetails.title,'description':userDetails.description,'current_date': new Date()},(err,result)=>{
			    err ? reject(err) : resolve(result);
			})
		})
	}

	this.blog_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('admin_blog_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)
			})
		})
	}

	this.review_list=(userDetails)=>{
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
            //  { $match: { astrologer_id: ObjectId(userDetails.astrologer_id)} },
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

	this.delete_review=(new_id)=>{
		return new Promise((resolve,reject)=>{
				db.collection('astrologer_review_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('astrologer_review_list').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		       resolve(result)
		    })
		})
    }

    this.add_news=(userDetails,img)=>{
		return new Promise((resolve,reject)=>{
	        db.collection('news_list').insertOne({'image':img ,'title':userDetails.title,'description':userDetails.description,'current_date': new Date()},(err,result)=>{
			    err ? reject(err) : resolve(result);
			})
		})
	}

	this.news_list=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('news_list').find({}).toArray((err,result)=>{
			  err?reject(err):resolve(result)
			})
		})
	}

	this.delete_news=(new_id)=>{
		return new Promise((resolve,reject)=>{
				db.collection('news_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			        db.collection('news_list').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				        err1 ? reject(err1) : resolve(result1);
			        })
		        }
		       resolve(result)
		    })
		})
    }

}

module.exports=new adminModel()