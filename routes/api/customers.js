const express = require("express");
const router = express.Router();
const CustomerSchema = require("../../models/customers");
const PropertiesSchema = require("../../models/properties");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

const keys = require('../../config/keys');
const ThridPartKeys = require('../../config/thirdPartyApi');
const auth = require("../../config/auth");
const passport = require("passport");
require("../../config/passport")(passport);
var request = require('request');
var nodemailer = require('nodemailer');
const http = require('http');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');
const path = require('path');
var fs = require('fs');
const multer = require('multer');
const { cust_register, cust_signin } = require("../../controllers/customers");
const ServiceProviderSchema = require("../../models/service_providers");
// Load Input Validation
const validateAddPhase = require('../../Validation/add_phase');
const validateCustomerRegisterInput = require('../../Validation/cust_signup');
const validateCustomerSigninInput = require('../../Validation/cust_signin');
const validateChangePasswordInput = require('../../Validation/change_password');

const DocumentPermissionSchema = require('../../models/document_permission')
const PropertiesPictureSchema = require("../../models/properties_picture");
const PropertiesPlanPictureSchema = require("../../models/properties_plan_picture");
const PropertyProfessionalSchema = require("../../models/property_professional_Schema");
const PropertiesPhaseSchema = require("../../models/property_phase_schema");
const PropertyProfessinoalTaskSchema = require("../../models/property_professional_tasks_Schema");
const { Promise } = require("mongoose");
const { resolve } = require("path");
//router.post("/cust_register", cust_register);
//router.post("/cust_signin", cust_signin);

const CustomerUploadDocsSchema = require("../../models/customer_upload_document");
const ComplaintsSchema = require("../../models/Complaints");
const ComplaintDetailsSchema = require("../../models/complaint_details_model");
const RatingSchema = require("../../models/service_provider_rating_Schema");
const MessageSchema = require("../../models/message");
const addTaskHelper = require("./addTask");
const PropertyHelper = require("./propertyDetail");
const PermisionHelper = require("./permision");
const propertyProfesshionalHelper = require('./propertyProfessionalDetails')
var isCustomer = auth.isCustomer;
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// <<<<<<< HEAD
// router.post('/filterPropertyAdress', (req, res) => {
//   console.log('filterPropertyAdress==', req.body.propertyId)

//   if (req.body.propertyId) {
//     PropertiesSchema.findOne({ _id: req.body.propertyId }).then(async (data) => {
//       if (data) {
//         console.log(data)
// =======
router.get('/test', (req, res) => {
  //var array =[];
  // new Promise((resolve, reject) => {


  PropertiesSchema.find({ ps_user_id: '5ffeaf14cbd60d14a072935e' }).then(async (data) => {
    if (data) {
      var c = 0
      //var array=[]
      // data.forEach((element)=>{
      //  PropertiesPictureSchema.find({pps_property_id:element._id}).then((result)=>{
      //     array.push(result)
      //     console.log(result)
      //   });
      // array.push(allPropertyImage)
      //console.log('allPropertyImage++++++',allPropertyImage)
      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
          let temp = await result
          arr.push(temp)
        })

      }
      console.log('++++++++', arr)

    }

  }).catch((err) => {
    console.log(err)
  })
})


router.post('/filterPropertyAdress', async (req, res) => {
  console.log('iddddd:', req.body.spId)
  if (req.body.spId) {
    let hiredProfeshnoal = await PropertyProfessionalSchema.findOne({ pps_user_id: req.session.user_id, pps_is_active_user_flag: req.session.active_user_login, pps_service_provider_id: req.body.spId });
    console.log('Change AllhiredProfeshnoal', hiredProfeshnoal);
    PropertiesSchema.findOne({ _id: hiredProfeshnoal.pps_property_id }).then(async (data) => {
      if (data) {
        //console.log(data)
        res.json({ data: data });
      }
    }).catch((err) => {
      res.json({ data: '' });
    })
  } else {
    console.log('property id not found')
  }

  if (req.body.propertyId) {
    PropertiesSchema.findOne({ _id: req.body.propertyId }).then(async (data) => {
      if (data) {
        //console.log(data)

        res.json({ data: data });
      }
    }).catch((err) => {
      console.log(err)
    })
  } else {
    console.log('property id not found')
  }
})

function generateOTP() {

  // Declare a digits variable  
  // which stores all digits 
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}


router.post("/cust_register", (req, res) => {
  console.log("rq.body", req.body);
  var err_msg = null;
  var success_msg = null;
  const { errors, isValid } = validateCustomerRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    console.log("server validation error is:", errors);
    //req.flash('err_msg', errors.confirmPassword);
    //return res.redirect('/signup');
    console.log('errosss:', errors)
    if (errors.confirmPassword) {
      res.send({
        message: errors.confirmPassword,
        status: false
      })
    } else {
      res.send({
        message: errors.cus_email_id,
        status: false
      })
    }


  }

  CustomerSchema.findOne({ cus_email_id: req.body.cus_email_id }).then(customers => {
    if (customers) {
      errors.cus_email_id = 'Email already exists';
      console.log('errors is : ', errors);
      //req.flash('err_msg', errors.cus_email_id);
      //res.redirect('/signup');
      res.send({
        message: errors.cus_email_id,
        status: false
      })

    } else {

      var now = new Date();
      now.setMinutes(now.getMinutes() + 03); // timestamp
      now = new Date(now); // Date object

      var otp_expire = now
      console.log("otp_expire time is", now);

      var otp = generateOTP()
      console.log("otp is", otp);


      const newCustomer = new CustomerSchema({
        cus_unique_code: "cust-" + uuidv4(),
        cus_fullname: req.body.cus_firstname + ' ' + req.body.cus_lastname,
        cus_email_id: req.body.cus_email_id,
        cus_phone_number: req.body.cus_phone_number,
        cus_address: req.body.cus_address,
        cus_country_id: req.body.country,
        cus_city: req.body.city,
        cus_state: req.body.state,
        cus_password: req.body.cus_password,
        cus_otp: otp,
        cus_otp_expie_time: otp_expire

      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newCustomer.cus_password, salt, (err, hash) => {
          if (err) throw err;
          newCustomer.cus_password = hash;
          newCustomer
            .save()
            .then(customers => {
              //sending OTP for email verification
              //otp_verification(req, otp);
              //req.flash('success_msg', 'You have register sucessfully.')
              //res.redirect("/signin")
              //Calling Submit token function for assign/createing invite property Object 
              if (req.body.token) {
                console.log("Token is ", req.body.token);
                submit_token(req.body.token, customers._id);
              }
              console.log("registered customers data is ", customers);
              res.send({
                customers: customers,
                // message: "You have registered sucessfully, please check your email to verify your account.",
                message: "You have registered sucessfully.",
                status: true
              })

            })
            .catch(err => {
              console.log(err)
              //req.flash('err_msg', 'Something went wron please try again later.');
              //res.redirect('/signup');
              res.send({
                message: 'Something went wrong please try again later.',
                status: false
              })

            });
        });
      });
    }
  });
});




router.post("/cust_signin", async (req, res) => {
  var err_msg = null;
  var success_msg = null;




  // const payload = { client_id: '2ouoqgb43ev8u5ttf3jpblgobg' }; // Create JWT Payload
  // const keysss = { grant_type: '14dbrro9ethfupco8kcqdhe7a0ajq1irvrc1oc7hrhri5s5v83br' }; // Create JWT Payload

  // // Sign Token
  // jwt.sign(
  //   payload,
  //   keysss.grant_type,
  //   { expiresIn: 3600 },
  //   (err, token) => {

  //     console.log('My tocke:',token)
  //     res.json({
  //       success: true,
  //       token: 'Bearer ' + token
  //     });
  //   }
  // );



  const cus_email_id = req.body.cus_email_id;
  const cus_password = req.body.cus_password;
  const { errors, isValid } = validateCustomerSigninInput(req.body);

  // Check Validation
  if (!isValid) {
    console.log("error is ", errors);
    //req.flash('err_msg', "please enter valid emailid and password")
    // return res.redirect('/signin');
    res.send({
      message: "please enter valid email and password",
      status: false,
      redirectpage: false,
      redirect: ''
    })
  }
  else {
    // Find Customer by 
    CustomerSchema.findOne({ cus_email_id }).then(async customers => {
      // Check for Customer
      if (!customers) {
        errors.cus_email_id = 'Customers not found';
        //req.flash('err_msg', errors.cus_email_id);
        //return res.redirect('/signin');
        res.send({
          message: "Customers not found",
          status: false,
          redirectpage: false,
          redirect: ''
        })
      }

      // else if (customers.cus_email_verification_status == 'no') {

      //   console.log("Sending Otp if user email not verified");
      //   otp_send(req, customers);
      //   res.send({
      //     message: "Please verify  OTP first",
      //     status: false,
      //     redirectpage: true,
      //     redirect: "/otp?email=" + cus_email_id
      //     //redirect to OTP
      //   })
      //}}
      else {
        console.log("console BBBBB");
        // Check Password
        bcrypt.compare(cus_password, customers.cus_password).then(isMatch => {
          if (isMatch) {
            //enableing session variable
            req.session.success = true;
            // req.session._id = doc.user_id;
            req.session.user_id = customers._id;
            req.session.name = customers.cus_fullname;
            req.session.email = customers.cus_email_id;
            req.session.is_user_logged_in = true;
            req.session.active_user_login = "buyer";
            req.session.address = customers.cus_address;
            req.session.city = customers.cus_city;
            req.session.phoneNumber = customers.cus_phone_number;
            req.session.country = customers.cus_country_id;
            //req.session.profilePicture= customer.profile_picture
            if (customers.cus_profile_image_name) {
              req.session.imagename = customers.cus_profile_image_name
            } else {
              req.session.imagename = '';
            }
            console.log("token is", req.body.token);
            if (req.body.token) {
              console.log("Token is ", req.body.token);
              submit_token(req.body.token, customers._id);
            }
            //req.session.isChanged = true
            // Customer Matched
            const payload = { id: customers.id, cus_fullname: customers.cus_fullname, cus_email_id: customers.cus_email_id }; // Create JWT Payload

            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
            // res.redirect('/dashboard')
            res.send({
              message: "Signin successfully, we are processing please wait...",
              status: true
            })

          } else {
            //errors.cus_password = 'Password incorrect';
            //console.log("Password incorrect", errors);
            //req.flash("err_msg", errors.cus_password);
            //return res.redirect('/signin');
            res.send({
              message: "Password incorrect",
              status: false,
              redirectpage: false,
              redirect: ''
            })

          }
        });
      }
    });

  }
});


/* -------------------------------------------------------------------------------------------------
    POST : Customer can add his property.
    ------------------------------------------------------------------------------------------------
    */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "propertiespic") {
      cb(null, 'public/propimg')
    }
    else if (file.fieldname === "planImage") {
      cb(null, 'public/propplanimg');
    }
    else if (file.fieldname === "complaint_file") {
      cb(null, 'public/complaintFile');
    }
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    const Filename = file.originalname
    const FilenameCleaned = Filename.replace(/\s/g, '')
    cb(null, FilenameCleaned.split('.').join('-' + Date.now() + '.'))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).fields(
  [
    {
      name: 'propertiespic', maxCount: 10
    },
    {
      name: 'planImage', maxCount: 10
    },
    {
      name: 'complaint_file', maxCount: 3
    }
  ]
);
function checkFileType(file, cb) {


  if (file.fieldname === "propertiespic" || file.fieldname === "planImage" || file.fieldname === "complaint_file") {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/gif' || file.mimetype === 'application/pdf'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
}
router.post("/add-property", async (req, res) => {
  upload(req, res, async () => {

    // console.log("body:=", req.body);
    // var err_msg = null;
    // var success_msg = null;

    // let PropertySaved = await PropertyHelper.AddNewProperty(req);
    // console.log('PropertySaved========', PropertySaved)
    // if (PropertySaved) {
    //   // console.log("instruction req is", req.body.instruction.length);
    //   // console.log("instruction req is Type", typeof (req.body.instruction));
    //   // console.log("req.session.active_user_login", req.session.active_user_login);
    //   var totalInstruction = 0;
    //   if (req.session.active_user_login == 'renovator') {
    //     totalInstruction = 8;
    //   } else {
    //     totalInstruction = 6;
    //   }
    //   console.log("totalInstruction:", totalInstruction);
    //   if (req.body.instruction.length >= totalInstruction && typeof (req.body.instruction) != 'string') {
    //     req.body.instruction.forEach(async function (instruction, i) {
    //       var user_id = req.session.user_id;
    //       // var propertyId = req.body.propertyId;
    //       var propertyId = PropertySaved._id
    //       //var pps_professional_id = req.body.serviceProviderId;
    //       var pps_phase_name = instruction;
    //       var pps_phase_start_date = req.body.startDate[i]
    //       var pps_phase_end_date = req.body.endDate[i]
    //       var pps_is_active_user_flag = req.session.active_user_login;
    //       let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_phase_name, pps_phase_start_date, pps_phase_end_date, pps_is_active_user_flag);
    //       console.log('addPhaseResponce A:', addPhaseResponce)
    //     })
    //     return res.send({
    //       'success_msg': 'Saved successfully',
    //       'status': true,
    //       'redirect': '/add-task'
    //     });
    //     //res.redirect('/add-property');
    //   } else {
    //     //console.log("server validation error is:", errors);
    //     //req.flash('err_msg', errors.instruction);
    //     return res.send({
    //       'err_msg': 'Please add all phases',
    //       'status': false
    //     });
    //   }

    // }

    //function invite_function(req, saved_property)//need to add invite function
    if (req.body) {
      console.log("body:=", req.body);
      var err_msg = null;
      var success_msg = null;
      let PropertySaved = await PropertyHelper.AddNewProperty(req);
      console.log('PropertySaved========', PropertySaved)
      if (PropertySaved) {
        //sending invite function in add-property
        console.log("sending invitation to professional with token");
        invite_function(req, PropertySaved);
        return res.send({
          'success_msg': ' Your Property Saved successfully Please Wait We Are Prosessing...',
          'status': true,
          'redirect': '/add-property'
        });
        //   var totalInstruction = 0;
        //   if (req.session.active_user_login == 'renovator') {
        //   totalInstruction = 8;
        // } else {
        //   totalInstruction = 6;
        // }
        //console.log("totalInstruction:", totalInstruction);
        // if (req.body.instruction.length >= totalInstruction && typeof (req.body.instruction) != 'string') {
        //   req.body.instruction.forEach(async function (instruction, i) {
        //     var user_id = req.session.user_id;
        //     var propertyId= PropertySaved._id
        //     var pps_phase_name = instruction;
        //     var pps_phase_start_date = req.body.startDate[i]
        //     var pps_phase_end_date = req.body.endDate[i]
        //     var pps_is_active_user_flag = req.session.active_user_login;
        //     let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_phase_name, pps_phase_start_date, pps_phase_end_date, pps_is_active_user_flag);
        //     console.log('addPhaseResponce A:', addPhaseResponce)
        //   })
        //   return res.send({
        //     'success_msg': 'Saved successfully',
        //     'status': true,
        //     'redirect': '/add-task'
        //   });
        // }else {

        //   return res.send({
        //     'err_msg': 'Please add all phases',
        //     'status': false
        //   });
        // }
      } else {
        return res.send({
          'err_msg': 'Something Wrong Try Again ',
          'status': false
        });
      }
    }
  });

});
//=============property add section====================//

router.post("/add-new-property", isCustomer, async (req, res) => {
  upload(req, res, async () => {
    if (req.body) {
      console.log("first form body:=", req.body);
      let PropertySaved = await PropertyHelper.Add_New_Propert(req);
      console.log('PropertySaved========', PropertySaved);
      if (PropertySaved) {
        //sending invite function in add-property
        console.log("sending invitation to professional with token");
        invite_function(req, PropertySaved);
        customer_invitation(req, PropertySaved);
        return res.send({
          'message': ' Your Property Saved plese add property image',
          'status': true,
          'property_id': PropertySaved._id
        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false
        });
      }
    }
  });

});

router.post("/add-new-property-image", isCustomer, async (req, res) => {
  upload(req, res, async () => {
    if (req.body) {
      console.log("second form body:=", req.body);
      console.log("second form file:=", req.files);

      let PropertyImageSaved = await PropertyHelper.add_new_property_image(req);
      // console.log('image saved========', PropertyImageSaved);
      if (PropertyImageSaved) {
        return res.send({
          'message': ' Your Property image Saved plese add property plan image',
          'status': true,

        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false
        });
      }
    }
  });

});

router.post("/add-new-property-plan-image", isCustomer, async (req, res) => {
  upload(req, res, async () => {
    if (req.body) {
      console.log("third form body:=", req.body);
      console.log("third form file:=", req.files);
      let PropertyPlanImageSaved = await PropertyHelper.add_new_property_plan_image(req);
      console.log('plan image saved========', PropertyPlanImageSaved);
      if (PropertyPlanImageSaved) {
        return res.send({
          'message': ' Your Property Add SuccessFully',
          'status': true,
          'redirect': '/mydreamhome'

        });
      } else {
        return res.send({
          'message': 'Something Wrong Try Again ',
          'status': false,
          'redirect': '/add-property'
        });
      }
    }
  });

});

router.get("/get_property_for_chain", isCustomer, async (req, res) => {

  if (req.body) {
    console.log("get chain property body:=", req.session);
    let AllProperty = await PropertyHelper.GetAllProperty(req.session.user_id, req.session.active_user_login);
    console.log('AllProperty========', AllProperty);
    if (AllProperty) {
      return res.send({
        'message': 'Select Property',
        'status': true,
        'data': AllProperty

      });
    } else {
      return res.send({
        'message': 'Something Wrong Try Again ',
        'status': false,
        'redirect': '/add-property'
      });
    }
  }


});

router.get("/get_property_for_chain_inEdit", isCustomer, async (req, res) => {

  if (req.body) {
    //console.log("req.body=============+++++++++$$$$$$$$$",req.body)
    //console.log("req.query============",req.query)

    console.log("edit chain property body:=", req.session);
    let AllProperty = await PropertyHelper.GetAllPropertyInEdit(req.session.user_id, req.session.active_user_login, req.query.property_id);
    console.log('AllProperty wher not own prop========', AllProperty);
    if (AllProperty) {
      return res.send({
        'message': 'Select Property',
        'status': true,
        'data': AllProperty

      });
    } else {
      return res.send({
        'message': 'Something Wrong Try Again ',
        'status': false,
        'redirect': '/add-property'
      });
    }
  }


});
router.post('/Editproperty', isCustomer, async (req, res) => {
  upload(req, res, async () => {
    // console.log("deepak ji--++++++++++++++++++ ", req.body)
    if (req.body.editPropertyId != '') {
      var property_id = req.query.property_id;
      var active_user = req.session.active_user_login;
      req.session.propertyEditId = property_id
      let edit_property_Obj = await PropertyHelper.EditPropertyById(req);
      if (edit_property_Obj) {
        //console.log(edit_property_Obj);
        return res.send({
          'message': 'property edit successfully',
          'status': true,
          'property_id': req.body.editPropertyId
        })
      }


    } else {
      return res.send({
        'message': 'property id not found in edit property',
        'status': false,

      })
    }
  });
});

router.post('/EditpropertyImage', isCustomer, async (req, res) => {
  upload(req, res, async () => {
    //console.log("edit property image body data--++++++++++++++++++ ", req.body);
    //console.log("edit property file data--++++++++++++++++++ ", req.files);
    if (req.files.propertiespic) {
      // console.log("A")
      //let edit_property_img_Obj = await PropertyHelper.EditPropertyImageById(req);
      //if(edit_property_img_Obj){
      //console.log("edit_property_img_Obj",edit_property_img_Obj)
      return res.send({
        'message': 'property image successfully update',
        'status': true,
        'property_id': req.body.property_id,
        'flage': 'A'
      })
      //}
    } else {

      return res.send({
        'message': 'property image successfully update',
        'status': true,
        'property_id': req.body.property_id,
        'flage': 'A'
      })
    }

  });
});
router.post('/EditpropertyPlanImage', isCustomer, async (req, res) => {
  upload(req, res, async () => {
    //console.log("edit property plan image data--++++++++++++++++++ ", req.body,req.files);
    if (req.files.planImage) {
      //console.log("plan A")
      // let edit_property_paln_img_Obj = await PropertyHelper.EditPropertyPlanImageById(req);
      // if(edit_property_paln_img_Obj){
      return res.send({
        'message': 'property successfully update',
        'status': true,
        'redirect': '/mydreamhome',
        'flage': 'A'
      })
      // }
    } else {
      console.log("plan B")
      return res.send({
        'message': 'property successfully update',
        'status': true,
        'redirect': '/mydreamhome',
        'flage': 'A'
      })
    }

  });
});
router.post('/Edit_property_Image', isCustomer, async (req, res) => {
  upload(req, res, async () => {
    console.log("prop req.body", req.body);
    console.log("prop req.file ", req.files);
    if (req.files.propertiespic) {
      console.log("A")
      let edit_property_img_Obj = await PropertyHelper.EditPropertyImageById(req);
      if (edit_property_img_Obj) {
        //console.log("edit_property_img_Obj",edit_property_img_Obj)
        return res.send({
          'message': 'property image successfully update',
          'status': true,
          'property_id': req.body.property_id
        })
      }
    } else {

      return res.send({
        'message': 'property image successfully update',
        'status': true,
        'property_id': req.body.property_id
      })
    }

  });
});
router.post('/Edit_property_Plan_Image', isCustomer, async (req, res) => {
  upload(req, res, async () => {
    console.log("plan req.files: ", req.files);
    console.log("plan req.body: ", req.body);
    if (req.files.planImage) {
      console.log("plan A")
      let edit_property_paln_img_Obj = await PropertyHelper.EditPropertyPlanImageById(req);
      if (edit_property_paln_img_Obj) {
        return res.send({
          'message': 'property successfully update',
          'status': true,
          'redirect': '/mydreamhome'
        })
      }
    } else {
      console.log("plan B")
      return res.send({
        'message': 'property successfully update',
        'status': true,
        'redirect': '/mydreamhome'
      })
    }

  });
});
//=============property add section close====================//
/* -------------------------------------------------------------------------------------------------
GET : fetch or search the service providers data based on name, surname, qualifications,
location, reviews, ratings and quotations.
------------------------------------------------------------------------------------------------- */

router.get("/fetch-service-provider", (req, res) => {
  console.log("fetching service provider data for following req: ", req.body);

  // Find Customer by 
  if (req.body != null) {
    if (req.body.sps_fullname != null) {
      ServiceProviderSchema.find({ sps_fullname: req.body.sps_fullname, }).then(service_provider => {
        // Check for Customer
        if (!service_provider) {
          console.log("Service Provider not found");
          // req.flash('err_msg', 'Service Provider not found');
          // return res.redirect('/professionals');
          return res.status(400).json("Service Provider not found")
        }
        else {
          //req.flash('success_msg', errors.sps_email_id);
          return res.status(200).json(service_provider);
        }

      })
    }
  }
})


/* -------------------------------------------------------------------------------------------------
POST : Forget password for customer portal. it will send 6 digit random password to customer gmail account..
------------------------------------------------------------------------------------------------- */
router.post('/forget-password', function (req, res) {
  console.log("req.body is :", req.body);

  CustomerSchema.find({
    'cus_email_id': req.body.cus_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Please enter registered Email address.',
        status: false
      })
    } else {

      if (result != '' && result != null) {
        new_pass = Math.random().toString(36).slice(-6);
        var hashPassword = "";
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_pass, salt, (err, hash) => {
            if (err) throw err;
            hashPassword = hash;

            CustomerSchema.updateOne({
              'cus_email_id': req.body.cus_email_id
            }, {
              $set: {
                cus_password: hashPassword
              }
            }, {
              upsert: true
            }, function (err) {
              if (err) {
                console.log("err is :", err);
                //req.flash('err_msg', 'Something went wrong.');
                //res.redirect('/forget-password')
                res.send({
                  message: 'Something went wrong.',
                  status: false
                })

              } else {

                var smtpTransport = nodemailer.createTransport({
                  // port: 25,
                  // host: 'localhost',
                  // tls: {
                  //   rejectUnauthorized: false
                  // },
                  //host: 'smtp.gmail.com',
                  //port: 465,
                  //secure: true,
                  service: 'Gmail',
                  auth: {
                    user: keys.user4,
                    pass: keys.pass4,
                  }
                });
                const mailOptions = {
                  to: req.body.cus_email_id,
                  from: keys.user4,
                  subject: 'Relai Forget Password',

                  text: 'Dear Customer,' + '\n\n' + 'New Password from Relai.\n\n' +
                    'Password: ' + new_pass + '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n' + 'Here is the link for signin: https://' + req.headers.host + '/signin' + '\n\n' +
                    'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',

                };
                smtpTransport.sendMail(mailOptions, function (err) {
                  if (err) {
                    console.log('err_msg is :', err);
                    res.send({
                      message: 'Something went wrong please contact to support team..',
                      status: false
                    })
                  } else {
                    // req.flash('success_msg', 'Password has been sent successfully to your registered email, please check your mail...');
                    //res.redirect('/forget-password')
                    res.send({
                      message: 'Password has been sent successfully to your registered email, please check your mail...',
                      status: true
                    })
                  }
                });
              }
            });
          });
        });
      } else {
        //req.flash('err_msg', 'Please enter registered Email address.');
        //res.redirect('/forget-password');
        res.send({
          message: 'Please enter registered Email address.',
          status: false
        })
      }

    }
  });
});


/* -------------------------------------------------------------------------------------------------
GET : Customer logout API
------------------------------------------------------------------------------------------------- */

router.get('/cust_logout', function (req, res) {
  console.log("logout");
  var test = req.session.is_user_logged_in;
  if (test == true) {
    req.session.destroy(function (err) {
      if (err) {
        return err;
      } else {
        return res.redirect('/signin');
      }
    });
  }
});

//@route Get api/customers/current
//@desc Return current user
//@access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
/* -------------------------------------------------------------------------------------------------
POST : Change Permission api for giving Docs read/write permission to existing serviceProvider.
------------------------------------------------------------------------------------------------- */
router.post('/change-permision', async (req, res) => {
  console.log('doc id:', req.body.doc_id)
  console.log('checkFlag:', req.body.checkFlag)
  DocumentPermissionSchema.findOne({ dps_customer_id: req.body.cust_id, dps_service_provider_id: req.body.professionalId, dps_document_id: req.body.doc_id }).then(async (data) => {
    console.log('FindData:', data);
    let permisionFlagDownload = '';
    let permisionFlagView = '';

    if (data) {

      if (req.body.checkFlag === 'viewaction') {
        permisionFlagDownload = data.dps_download_permission;
        permisionFlagView = req.body.viewFlag;
        console.log('view....action...')
      } else {
        permisionFlagView = data.dps_view_permission;
        permisionFlagDownload = req.body.downloadFlag;
        console.log('download....action...')

      }

      console.log('permisionFlagView:', permisionFlagView);
      console.log('permisionFlagDownload:', permisionFlagDownload);


      DocumentPermissionSchema.updateOne({ 'dps_service_provider_id': req.body.professionalId, 'dps_customer_id': req.body.cust_id, 'dps_document_id': req.body.doc_id }, { $set: { dps_view_permission: permisionFlagView, dps_download_permission: permisionFlagDownload, dps_is_active_user_flag: req.session.active_user_login } }, { upsert: true }, function (err) {
        if (err) {
          console.log("err is :", err);
          req.flash('err_msg', 'Something went wrong.');
          //res.redirect('/forget-password')
        } else {
          res.send({
            message: 'Permission Updated !!'
          })
        }
      })

    } else {
      let permissionObject = {
        dps_view_permission: req.body.viewFlag,
        dps_download_permission: req.body.downloadFlag,
        dps_customer_id: req.body.cust_id,
        dps_service_provider_id: req.body.professionalId,
        dps_document_id: req.body.doc_id,
        dps_is_active_user_flag: req.session.active_user_login
      }
      console.log('permissionObject:', permissionObject);
      var docPermissionSave = new DocumentPermissionSchema(permissionObject)
      docPermissionSave.save().then(async (data) => {
        console.log('docPermissionSave:', data)
        res.send({
          message: 'Permission Updated !!'
        })
      }).catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try after some time!');
      });
    }
  });




  // var idArray = req.body.checked_elem.split(",");
  // var idArray_1 = req.body.checked_elem_1.split(",");
  // // DocumentPermissionSchema 
  // console.log("idArray_1 download", idArray_1);
  // console.log("idArray view", idArray);
  // PermisionHelper.changePermision(req.body);
  // var obj = {};
  // idArray.forEach(async function (service_provider_id, i) {
  //   if (service_provider_id && idArray_1[i]) {
  //     console.log('AAAA')
  //     Object.assign(obj,
  //       {
  //         dps_view_permission: "yes",
  //         dps_download_permission: 'yes',
  //         dps_customer_id: req.body.cust_id,
  //         dps_service_provider_id: service_provider_id,
  //         dps_document_id: req.body.id_element,
  //         dps_is_active_user_flag: req.session.active_user_login

  //       });

  //   } else if (service_provider_id) {
  //     console.log('BBBBB')
  //     Object.assign(obj,
  //       {
  //         dps_view_permission: "yes",
  //         dps_download_permission: 'no',
  //         dps_customer_id: req.body.cust_id,
  //         dps_service_provider_id: service_provider_id,
  //         dps_document_id: req.body.id_element,
  //         dps_is_active_user_flag: req.session.active_user_login

  //       });

  //   } else if (idArray_1[i]) {
  //     console.log('CCCCC')
  //     Object.assign(obj,
  //       {
  //         dps_view_permission: "no",
  //         dps_download_permission: 'yes',
  //         dps_customer_id: req.body.cust_id,
  //         dps_service_provider_id: service_provider_id,
  //         dps_document_id: req.body.id_element,
  //         dps_is_active_user_flag: req.session.active_user_login

  //       });

  //   }
  //   console.log('obj', obj)

  //   var docPermissionSave = new DocumentPermissionSchema(obj)
  //   docPermissionSave.save().then(async (data) => {
  //     console.log(data)
  //   }).catch(err => {
  //     console.log(err)
  //     req.flash('err_msg', 'Something went wrong please try after some time!');

  //   });
  // })
})

/* -------------------------------------------------------------------------------------------------
POST : Hire now api is used for hiring professional(service_provider) for particular property.
------------------------------------------------------------------------------------------------- */

router.post("/hire-now", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  if (req.body.propertyId && req.body.serviceProviderId) {
    const hirenow = new PropertyProfessionalSchema({
      pps_user_id: req.body.user_id,
      pps_property_id: req.body.propertyId,
      pps_service_provider_id: req.body.serviceProviderId,
      pps_pofessional_budget: req.body.pps_pofessional_budget,
      pps_exptected_delivery_date: req.body.pps_exptected_delivery_date,
      pps_is_active_user_flag: req.session.active_user_login
      //pps_status: req.body.pps_status,//TODO:we need to save later
    });
    hirenow
      .save()
      .then(async hireprofessional => {
        console.log("server response is :", hireprofessional);
        //res.redirect('/add-task');
        return res.send({
          'success_msg': ' Professional Hired successfully',
          'status': true,
          'redirect': '/professionals-hirenow'
        });
      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try again later.');
      });

  } else {
    //console.log("server validation error is:", errors);
    //req.flash('err_msg', errors.instruction);
    return res.send({
      'err_msg': 'Please add all input fild',
      'status': false
    });
  }
});

// router.post("/hire-now", async (req, res) => {
//   var err_msg = null;
//   var success_msg = null;
//   var totalInstruction = 0;
//   //const { errors, isValid } = validateAddPhase(req.body);
//   console.log("instruction req is", req.body.instruction.length);
//   console.log("instruction req is Type", typeof (req.body.instruction));
//   console.log("req.session.active_user_login", req.session.active_user_login);

//   if (req.session.active_user_login == 'renovator') {
//     totalInstruction = 8;
//   } else {
//     totalInstruction = 6;
//   }
//   console.log("totalInstruction:", totalInstruction);

//   if (req.body.instruction.length >= totalInstruction && typeof (req.body.instruction) != 'string') {
//     req.body.instruction.forEach(async function (instruction, i) {
//       var user_id = req.body.user_id;
//       var propertyId = req.body.propertyId;
//       var pps_professional_id = req.body.serviceProviderId;
//       var pps_phase_name = instruction;
//       var pps_phase_start_date = req.body.startDate[i]
//       var pps_phase_end_date = req.body.endDate[i]
//       var pps_is_active_user_flag = req.session.active_user_login;
//       let addPhaseResponce = await addTaskHelper.save_addPhase(propertyId, pps_professional_id, pps_phase_name, pps_phase_start_date, pps_phase_end_date, pps_is_active_user_flag);
//       console.log('addPhaseResponce A:', addPhaseResponce)
//     })

//     // } else {
//     //   req.flash('err_msg', errors.instruction);
//     //   return res.redirect('/professionals-hirenow');
//     // }

//     const hirenow = new PropertyProfessionalSchema({
//       pps_user_id: req.body.user_id,
//       pps_property_id: req.body.propertyId,
//       pps_service_provider_id: req.body.serviceProviderId,
//       pps_pofessional_budget: req.body.pps_pofessional_budget,
//       pps_exptected_delivery_date: req.body.pps_exptected_delivery_date,
//       pps_is_active_user_flag: req.session.active_user_login
//       //pps_status: req.body.pps_status,//TODO:we need to save later
//     });
//     hirenow
//       .save()
//       .then(async hireprofessional => {
//         console.log("server response is :", hireprofessional);
//         //res.redirect('/add-task');
//         return res.send({
//           'success_msg': 'Saved successfully',
//           'status': true,
//           'redirect': '/add-task'
//         });
//       })
//       .catch(err => {
//         console.log(err)
//         req.flash('err_msg', 'Something went wrong please try again later.');
//       });

//   } else {
//     //console.log("server validation error is:", errors);
//     //req.flash('err_msg', errors.instruction);
//     return res.send({
//       'err_msg': 'Please add all phases',
//       'status': false
//     });
//   }
// });

/* -------------------------------------------------------------------------------------------------
POST : Add Task api is used for adding task(or Phase) details and sharing these details to hired professional.
------------------------------------------------------------------------------------------------- */
router.get("/addTask", async (req, res) => {

  var property_id = req.session.property_id;
  var user_id = req.session.user_id;
  var active_user = req.session.active_user_login;
  var AllProfessional_property_wise = await propertyProfesshionalHelper.Get_all_Professional_by_property(property_id, user_id, active_user);
  console.log("AllProfessional_property_wise", AllProfessional_property_wise)

  return res.send({
    'success_msg': 'professionals list',
    'status': true,
    'data': AllProfessional_property_wise,
    'property_id': req.session.property_id
  });
});

router.post("/addTask_from_Dreamhome_detial_phase", (req, res) => {
  console.log('addTask_from_Dreamhome_detial_phase', req.body);
  if (req.body.ppts_assign_to == '' || req.body.ppts_assign_to == undefined || req.body.ppts_phase_name == '') {
    return res.send({
      'err_msg': 'All Fields Required !!',
      'status': false,
      'redirect': '/professionals-hirenow'
    });


  } else {
    console.log("addTask post:", req.body);
    const newTask = new PropertyProfessinoalTaskSchema({
      ppts_property_id: req.body.ppts_property_id,
      ppts_user_id: req.session.user_id,
      ppts_task_name: req.body.ppts_task_name,
      ppts_assign_to: req.body.ppts_assign_to,
      ppts_due_date: req.body.ppts_due_date,
      ppts_phase_name: req.body.ppts_phase_name,
      ppts_is_active_user_flag: req.session.active_user_login,
      ppts_note: req.body.ppts_note
    });
    newTask
      .save()
      .then(addedTask => {
        console.log("server response is addedTask :", addedTask);
        //res.json({ status: 1, message: 'Task Add Successfully', data: addedTask });
        if (addedTask) {

          return res.send({
            'success_msg': 'Task Add Successfully',
            'status': true,

          });
          // res.redirect("/professionals-hirenow")
        } else {
          return res.send({
            'err_msg': 'Please Add Task',
            'status': false,

          });
        }
      })
      .catch(err => {
        console.log(err)
        req.flash('err_msg', 'Something went wrong please try again later.');
        res.redirect('/professionals-hirenow');
      });
  }
})

router.post("/Add_existing_task_from_Dreamhome_detial_phase", (req, res) => {
  if (req.body.ppts_assign_to == '' || req.body.ppts_assign_to == undefined || req.body.ppts_phase_name == '') {
    return res.send({
      'err_msg': 'All fields are required !!',
      'status': false,
      'redirect': '/professionals-hirenow'
    });
  } else {
    var addedTask = addTaskHelper.add_existing_task(req);
    if (addedTask) {
      return res.send({
        'success_msg': 'Task Add Successfully',
        'status': true,
      });
    } else {
      return res.send({
        'err_msg': 'Please Add Task',
        'status': false,
      });
    }
  }
})
router.post("/addTask", (req, res) => {
  if (req.body.Phase == '' || req.body.Phase == undefined) {
    return res.send({
      'err_msg': 'All fields are required !!',
      'status': false,
      'redirect': '/professionals-hirenow'
    });
  } else {
    console.log("addTask post:", req.body);
    // <<<<<<< HEAD
    //     let taskName = '';
    //     if (req.body.task_name) {
    //       taskName = req.body.task_name;
    //     } else {
    //       taskName = req.body.phase_task_list;
    //     }
    //     console.log('taskNametaskNametaskName:', taskName)
    //     const newTask = new PropertyProfessinoalTaskSchema({
    //       ppts_property_id: req.body.property_id,
    //       ppts_user_id: req.session.user_id,
    //       ppts_task_name: taskName,
    //       ppts_assign_to: req.body.professionalId,
    //       ppts_due_date: req.body.duedate,
    //       //ppts_phase_id: req.body.Phase,
    //       ppts_phase_name: req.body.Phase,
    //       ppts_is_active_user_flag: req.session.active_user_login,
    //       ppts_note: req.body.notes
    //     });
    //     newTask
    //       .save()
    //       .then(addedTask => {
    //         console.log("server response is addedTask :", addedTask);
    //         //res.json({ status: 1, message: 'Task Add Successfully', data: addedTask });
    //         if (addedTask) {

    //console.log('vartype:',typeof(taskName))
    //console.log('taskNametaskNametaskName:',taskName)


    var addedTask = addTaskHelper.add_existing_task_from_btn(req);
    if (addedTask) {
      return res.send({
        'success_msg': 'Task Add Successfully',
        'status': true,
      });
    } else {
      return res.send({
        'err_msg': 'Please Add Task',
        'status': false,
      });
    }

    // const newTask = new PropertyProfessinoalTaskSchema({
    //   ppts_property_id: req.body.property_id,
    //   ppts_user_id: req.session.user_id,
    //   ppts_task_name: taskName,
    //   ppts_assign_to: req.body.professionalId,
    //   ppts_due_date: req.body.duedate,
    //   //ppts_phase_id: req.body.Phase,
    //   ppts_phase_name: req.body.Phase,
    //   ppts_is_active_user_flag: req.session.active_user_login,
    //   ppts_note: req.body.notes
    // });
    // newTask
    //   .save()
    //   .then(addedTask => {
    //     console.log("server response is addedTask :", addedTask);
    //     //res.json({ status: 1, message: 'Task Add Successfully', data: addedTask });
    //     if (addedTask) {

    //       return res.send({
    //         'success_msg': 'Task Add Successfully',
    //         'status': true,
    //         'redirect': '/professionals-hirenow'
    //       });
    //       // res.redirect("/professionals-hirenow")
    //     } else {
    //       return res.send({
    //         'err_msg': 'Please Add Task',
    //         'status': false,
    //         'redirect': '/professionals-hirenow'
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     req.flash('err_msg', 'Something went wrong please try again later.');
    //     res.redirect('/professionals-hirenow');
    //   });
  }
})


/* -------------------------------------------------------------------------------------------------
POST : Raise a complaints api is used for raising a complaints to particular service provider along with note and status.
------------------------------------------------------------------------------------------------- */

// router.post('/raise-a-complaint', (req, res) => {

//   console.log("request coming from server is :", req.body.image);

//   return;

//   const newComplaint = new ComplaintsSchema({
//     //should be mongodb generated id
//     //coms_id :
//     coms_complaint_for: req.body.sevice_provider_id,
//     coms_complaint_code: "C" + uuidv4(),//need to generate in  like C123 auto increment feature
//     coms_property_id: req.body.property_id,
//     coms_user_id: req.body.cust_user_id,
//     //coms_complaint_by: 'customer' //need to check if complaints filed via customer portal or service_provider portal
//     coms_complaint_subject: req.body.coms_complaint_subject,
//     coms_complaint_note: req.body.coms_complaint_note,
//     coms_is_active_user_flag: req.session.active_user_login
//     //coms_complaint_file: req.body.coms_complaint_file,
//   });
//   newComplaint.save().then(complaints => {
//     console.log("Getting respose from db is :", complaints);
//     req.flash('success_msg', 'complaints raise succesfully');
//     //res.redirect("/")
//     res.json({ complaints: complaints, 'message': 'complaint sent successfully' })
//   }).catch(err => {
//     console.log(err)
//     req.flash('err_msg', 'Something went wrong please try again later.');
//     res.redirect('/professionals-hirenow');
//   });
// });

/* -------------------------------------------------------------------------------------------------
POST : message api is used for sending message to service_provider or vice-versa.
------------------------------------------------------------------------------------------------- */
router.post('/message', (req, res) => {
  console.log("Send Message data from client is :", req.body);
  const newMessage = new MessageSchema({
    sms_property_id: req.body.sms_property_id,// storing property_id if its not null
    sms_sender_id: req.body.sms_sender_id,//check if msg comes from customer portal than store customer_Id
    sms_receiver_id: req.body.sms_receiver_id, //recevier_id
    sms_sender_type: req.body.sms_sender_type,
    sms_receiver_type: req.body.sms_receiver_type,
    sms_message: req.body.message,
    sms_msg_Date: req.body.sms_msg_Date,
    sms_read_status: req.body.sms_read_status, //default is unread
    sms_is_active_user_flag: req.session.active_user_login
  })
  newMessage.save().then(message => {
    console.log("getting response form server is :", message);
    res.send({
      msgData: message
    })
    //res.flash('success_msg', 'message forward successfully');
    //res.redirect('/'); //set based on current login if its customer portal then redirect customer_message portal and 
  }).catch(err => {
    console.log(err)
    //req.flash('err_msg', 'Something went wrong please try again later.');
    //res.redirect('/professionals-hirenow');
  });
});

/* -------------------------------------------------------------------------------------------------
Function : invite function is used for sending invite to service_provider via gmail. this function will call while adding new Property in customer Portal
------------------------------------------------------------------------------------------------- */

function invite_function(req, saved_property) {
  console.log("Request getting from server :", req.body);
  const payload = { id: saved_property._id, property_name: saved_property.ps_property_name }; // Create Token Payload

  // Sign Token
  jwt.sign(
    payload,
    keys.secretOrKey,
    { expiresIn: 3600 * 60 * 60 },
    (err, token) => {
      console.log("Sending Secret token along with customer request", token);
      var smtpTransport = nodemailer.createTransport({
        // port: 25,
        // host: 'localhost',
        // tls: {
        //   rejectUnauthorized: false
        // },
        // host: 'smtp.gmail.com',
        // port: 465,
        // secure: true,
        service: 'Gmail',
        auth: {
          user: keys.user4,
          pass: keys.pass4,
        }
      });
      const mailOptions = {
        to: req.body.ps_other_party_emailid,
        from: keys.user4,
        subject: 'Invitaion letter from Relai',

        text: 'Dear \n' + req.body.ps_other_party_fullname + '\n\n' + 'you are invited in Relai plateform.\n\n' +

          'We suggest you to please visit our Relai plateform and create your account \n' + 'Here is the registration link: http://' + req.headers.host + '/signup?email=' + req.body.ps_other_party_emailid + '&token=' + token + '\n\n' +

          'if you already registered please hit given url \n' + ' http://' + req.headers.host + '/signin?email=' + req.body.ps_other_party_emailid + '&token=' + token + '\n\n' +

          'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
          //res.redirect('/add-property')
        } else {
          //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
          // res.redirect('/add-property')
        }
      });
    }
  );
}

function customer_invitation(req, saved_property) {
  console.log("Request getting from server :", req.body);
  console.log("Customer session :", req.session);

  var smtpTransport = nodemailer.createTransport({
    // port: 25,
    // host: 'localhost',
    // tls: {
    //   rejectUnauthorized: false
    // },
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: 'Gmail',
    auth: {
      user: keys.user4,
      pass: keys.pass4,
    }
  });
  const mailOptions = {
    to: req.session.email,
    from: keys.user4,
    subject: 'Invitaion letter from Relai',

    text: 'Dear \n' + req.session.name + '\n\n' + 'you have send successfully invitation to\n' + req.body.ps_other_party_fullname + ' for ' + saved_property.ps_property_name + ' via Relai plateform.\n\n' +

      'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) {
      console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
      //res.redirect('/add-property')
    } else {
      //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
      // res.redirect('/add-property')
    }
  });
}


//Sending otp for email verifictaion while registering user
function otp_verification(req, otp) {
  console.log("Customer Data :", req.body);
  console.log("OTP for customer verification:", otp);

  var smtpTransport = nodemailer.createTransport({
    // port: 25,
    // host: 'localhost',
    // tls: {
    //   rejectUnauthorized: false
    // },
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    service: 'Gmail',
    auth: {
      user: keys.user4,
      pass: keys.pass4,
    }
  });
  const mailOptions = {
    to: req.body.cus_email_id,
    from: keys.user4,
    subject: 'OTP verification from Relai',

    text: 'Dear \n' + req.body.cus_firstname + ' ' + req.body.cus_lastname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + req.body.cus_email_id + '\n\n' +

      'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) {
      console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
      //res.redirect('/add-property')
    } else {
      //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
      // res.redirect('/add-property')
    }
  });
}

//Sending otp for email verifictaion while registering user
function otp_send(req, customer) {
  console.log("Customer Data :", customer);

  var now = new Date();
  now.setMinutes(now.getMinutes() + 03); // timestamp
  now = new Date(now); // Date object

  var otp_expire = now
  console.log("otp_expire time is", now);
  var otp = generateOTP();
  console.log(" Generated OTP is ", otp);

  CustomerSchema.updateOne({
    'cus_email_id': customer.cus_email_id
  }, {
    $set: {
      cus_otp: otp,
      cus_otp_expie_time: otp_expire
    }
  }, {
    upsert: true
  }, function (err) {
    if (err) {
      console.log("err is :", err);
      // res.send({
      //   message: 'Something went wrong.',
      //   status: false
      // })
    } else {
      var smtpTransport = nodemailer.createTransport({
        // port: 25,
        // host: 'localhost',
        // tls: {
        //   rejectUnauthorized: false
        // },
        // host: 'smtp.gmail.com',
        // port: 465,
        // secure: true,
        service: 'Gmail',
        auth: {
          user: keys.user4,
          pass: keys.pass4,
        }
      });
      const mailOptions = {
        to: customer.cus_email_id,
        from: keys.user4,
        subject: 'OTP verification from Relai',

        text: 'Dear \n' + customer.cus_fullname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + customer.cus_email_id + '\n\n' +

          'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
          //console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
          console.log("Something went wrong");

        } else {
          console.log("OTP send Successfully");
          // return true;

        }
      });
    }
  }).catch(err => {
    console.log(err)
  })
};






router.post('/resend-otp-link', function (req, res) {
  console.log("Sending otp link to registered email-id", req.body.email);
  CustomerSchema.find({
    'cus_email_id': req.body.email,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Customer Not Found.',
        status: false
      })
    }
    else {

      if (result != '' && result != null) {
        console.log("customer results is :", result[0].cus_otp);
        var now = new Date();
        now.setMinutes(now.getMinutes() + 03); // timestamp
        now = new Date(now); // Date object

        var otp_expire = now
        console.log("otp_expire time is", now);
        var otp = generateOTP();
        console.log(" Generated OTP is ", otp);

        CustomerSchema.updateOne({
          'cus_email_id': req.body.email
        }, {
          $set: {
            cus_otp: otp,
            cus_otp_expie_time: otp_expire
          }
        }, {
          upsert: true
        }, function (err) {
          if (err) {
            console.log("err is :", err);
            //req.flash('err_msg', 'Something went wrong.');
            //res.redirect('/forget-password')
            res.send({
              message: 'Something went wrong.',
              status: false
            })
          } else {
            var smtpTransport = nodemailer.createTransport({
              // port: 25,
              // host: 'localhost',
              // tls: {
              //   rejectUnauthorized: false
              // },
              // host: 'smtp.gmail.com',
              // port: 465,
              // secure: true,
              service: 'Gmail',
              auth: {
                user: keys.user4,
                pass: keys.pass4,
              }
            });
            const mailOptions = {
              to: req.body.email,
              from: keys.user4,
              subject: 'OTP verification from Relai',

              text: 'Dear \n' + result[0].cus_fullname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + req.body.email + '\n\n' +

                'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              if (err) {
                console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong, please contact to support team');
                //res.redirect('/add-property')
              } else {
                //req.flash('success_msg', 'Invitation link has been sent successfully on intered email id, please check your mail...');
                // res.redirect('/add-property')
                console.log("OTP send Successfully");
                res.send({
                  message: 'OTP Send successfully please check your registered-Email.',
                  status: true
                })
              }
            });

          }
        });


      } else {
        console.log("Customer Data not found");
        res.send({
          message: 'Customer Data not found.',
          status: false
        })
      }
    }
  });

});



router.post('/otp_verfication', function (req, res) {
  console.log("req.body is :", req.body);
  var otp1 = req.body.otp1;
  var otp2 = req.body.otp2;
  var otp3 = req.body.otp3;
  var otp4 = req.body.otp4;
  var otp = otp1 + otp2 + otp3 + otp4;
  console.log("getting otp from form data", otp);

  CustomerSchema.find({
    'cus_email_id': req.body.cus_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Customer Not Found.',
        status: false
      })
    }
    else {

      if (result != '' && result != null) {
        console.log("customer results is :", result[0].cus_otp);
        console.log("OTP is ", otp);
        if (parseInt(result[0].cus_otp) === parseInt(otp)) {

          CustomerSchema.updateOne({
            'cus_email_id': req.body.cus_email_id
          }, {
            $set: {
              cus_email_verification_status: 'yes'
            }
          }, {
            upsert: true
          }, function (err) {
            if (err) {
              console.log("err is :", err);
              //req.flash('err_msg', 'Something went wrong.');
              //res.redirect('/forget-password')
              res.send({
                message: 'Something went wrong.',
                status: false
              })

            } else {

              res.send({
                message: 'OTP verification done successfully.',
                status: true
              })
            }
          });

        } else {
          console.log("please enter valid OTP");
          res.send({
            message: 'OTP verification failed.',
            status: false
          })
        }
      } else {
        console.log("Customer Data not found");
        res.send({
          message: 'Customer Data not found.',
          status: false
        })
      }
    }
  });

});
/* -------------------------------------------------------------------------------------------------
POST : update-customer-profile is used for updating customer profile data 
------------------------------------------------------------------------------------------------- */

router.post('/update-customer-profile', (req, res) => {
  console.log("updating user profile with incoming request :", req.body);

  var user_id = req.session.user_id;
  CustomerSchema.findByIdAndUpdate({ _id: user_id }, { $set: { cus_fullname: req.body.cus_fullname, cus_address: req.body.cus_address, cus_country_id: req.body.cus_country_id, cus_city: req.body.cus_city, cus_phone_number: req.body.cus_phone_number, cus_updated_at: Date.now() } },
    function (err, customers) {
      if (err) {
        console.log("Something went wrong")
      }
      else {
        console.log("result after updating : ", customers);
        //TODO: Want to update session after editprofile

        // req.session._id = doc.user_id;
        // req.session.user_id = customers._id;
        req.session.name = req.body.cus_fullname;
        // req.session.email = customers.cus_email_id;
        // //req.session.is_user_logged_in = true;
        // // req.session.active_user_login = "buyer";
        req.session.address = req.body.cus_address;
        req.session.city = req.body.cus_city;
        req.session.phoneNumber = req.body.cus_phone_number;
        req.session.country = req.body.cus_country_id;
        //req.session.profilePicture= customer.profile_picture
        //req.flash('success_msg', 'Profile updated successfully.');
        //req.session.isChanged();
        console.log("req session is :", req.session);
        req.flash('success_msg', "Profile Uploaded Successfully.");
        res.redirect('/dashboard')
      }
    });
});

router.post('/new-raise-a-complaint', isCustomer, (req, res) => {
  upload(req, res, async () => {
    let newComplaint = '';
    const obj = JSON.parse(JSON.stringify(req.body));
    const files = JSON.parse(JSON.stringify(req.files));
    const ComplaintId = 'C-' + uuidv4().slice(uuidv4().length - 4).toUpperCase();;

    console.log('filesfiles:', files)
    if (Object.keys(files).length === 0) {
      newComplaint = new ComplaintsSchema({
        coms_complaint_for: req.body.coms_complaint_for,
        coms_complaint_help: req.body.coms_complaint_help,
        coms_complaint_code: ComplaintId,//need to generate in  like C123 auto increment feature
        coms_property_id: req.body.property_id,
        coms_user_id: req.body.cust_user_id,
        coms_complaint_subject: req.body.coms_complaint_subject,
        coms_complaint_note: req.body.coms_complaint_note,
        coms_is_active_user_flag: req.session.active_user_login,
        coms_user_name: req.session.name,
        coms_user_profile_img: req.session.imagename
      });

      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: ComplaintId,
        comsd_user_id: req.session.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: '',
        comsd_complaint_filetype: ''
      });

    } else {
      newComplaint = new ComplaintsSchema({
        coms_complaint_for: req.body.coms_complaint_for,
        coms_complaint_help: req.body.coms_complaint_help,
        coms_complaint_code: ComplaintId,//need to generate in  like C123 auto increment feature
        coms_property_id: req.body.property_id,
        coms_user_id: req.body.cust_user_id,
        coms_complaint_subject: req.body.coms_complaint_subject,
        coms_complaint_note: req.body.coms_complaint_note,
        coms_is_active_user_flag: req.session.active_user_login,
        coms_user_name: req.session.name,
        coms_user_profile_img: req.session.imagename,
        coms_complaint_filename: req.files.complaint_file[0].filename,
        coms_complaint_file: {
          data: fs.readFileSync(path.join(__dirname + '../../../public/complaintFile/' + req.files.complaint_file[0].filename)),
          contentType: 'image/png'
        },
        coms_complaint_filetype: req.files.complaint_file[0].mimetype
      });

      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: ComplaintId,
        comsd_user_id: req.body.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: req.files.complaint_file[0].filename,
        comsd_complaint_file: {
          data: fs.readFileSync(path.join(__dirname + '../../../public/complaintFile/' + req.files.complaint_file[0].filename)),
          contentType: 'image/png'
        },
        comsd_complaint_filetype: req.files.complaint_file[0].mimetype
      });

    }
    console.log('newComplaint:', newComplaint)
    newComplaint.save().then(complaints => {
      newComplaintDetails.save().then(complaintsDetails => {
        res.send({ status: true, message: 'You complaint submited successfully, we will review and connect with you soon !!' })
      });
    }).catch(err => {
      console.log(err)
      res.send({ status: false, 'message': 'Something went wrong please try again later.' })
    });
  });

});


router.post('/complaint-details-discussion', isCustomer, (req, res) => {
  upload(req, res, async () => {
    let newComplaintDetails = '';
    const obj = JSON.parse(JSON.stringify(req.body));
    const files = JSON.parse(JSON.stringify(req.files));
    //const ComplaintId = 'C-'+uuidv4().slice(uuidv4().length - 4).toUpperCase();;

    if (Object.keys(files).length === 0) {
      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: req.body.complaintID,
        comsd_user_id: req.session.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: '',
        comsd_complaint_filetype: ''
      });

    } else {
      newComplaintDetails = new ComplaintDetailsSchema({
        comsd_id: req.body.complaintID,
        comsd_user_id: req.session.user_id,
        comsd_complaint_note: req.body.coms_complaint_note,
        comsd_user_name: req.session.name,
        comsd_user_profile_img: req.session.imagename,
        comsd_complaint_filename: req.files.complaint_file[0].filename,
        comsd_complaint_file: {
          data: fs.readFileSync(path.join(__dirname + '../../../public/complaintFile/' + req.files.complaint_file[0].filename)),
          contentType: 'image/png'
        },
        comsd_complaint_filetype: req.files.complaint_file[0].mimetype
      });
    }
    console.log('newComplaintDetails:', newComplaintDetails)
    newComplaintDetails.save().then(complaintsDetails => {
      res.send({ status: true, message: 'You complaint submited successfully, we will review and connect with you soon !!' })
    }).catch(err => {
      console.log(err)
      res.send({ status: false, 'message': 'Something went wrong please try again later.' })
    });
  });
});


router.post('/removeProfesshional', isCustomer, async (req, res) => {
  console.log("remove prof id", req.body.professhional_id, req.session)
  var responce = await propertyProfesshionalHelper.removeProfessionalById(req.body.professhional_id, req.session.property_id)
  if (responce) {
    console.log("remove responce==========", responce)
    return res.send({
      'success_msg': 'Professional Removed successfully..',
      'status': true,
      'id': responce._id
    });
  } else {
    return res.send({
      'err_msg': 'Something Wrong.',
      'status': false,

    });
  }
  console.log("responce:", responce)
})



//***************** post changes password **************//
router.post('/change-password', isCustomer, function (req, res) {
  console.log("calling change password API", req.body);
  var user_id = req.session.user_id;
  const { errors, isValid } = validateChangePasswordInput(req.body);

  // Check Validation
  if (!isValid) {
    console.log("error is ", errors);
    //req.flash('err_msg', errors.confirmPassword);
    if (errors.confirmPassword) {


      res.send({
        message: errors.confirmPassword,
        status: false,
        validationType: 'length'
      })
    } else {
      res.send({
        message: errors.cus_password,
        status: false,
        validationType: 'length'
      })
    }
    return; // res.redirect('/change-Password');
  } else {
    // Find Customer by 
    CustomerSchema.findOne({ _id: req.session.user_id }).then(customers => {
      bcrypt.compare(req.body.oldPassword, customers.cus_password).then(isMatch => {
        if (isMatch) {
          //enableing session variable
          var hashPassword = "";
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.cus_password, salt, (err, hash) => {
              if (err) throw err;
              hashPassword = hash;
              CustomerSchema.updateOne({
                '_id': req.session.user_id
              }, {
                $set: {
                  cus_password: hashPassword
                }
              }, {
                upsert: true
              }, function (err) {
                if (err) {
                  res.send({
                    message: 'Something went wrong please try again.',
                    status: false,
                    validationType: 'server'
                  })

                  //console.log("err is :", err);
                  //req.flash('err_msg', 'Something went wrong.');
                  return;
                } else {
                  //console.log("Password change successfully");
                  //req.flash('success_msg', 'password change successfully');
                  res.send({
                    message: 'Password change successfully.',
                    status: true,
                    validationType: ''
                  })

                }
              });
            });
          });
          req.session.success = true;
        } else {
          //console.log('not matched')
          res.send({
            message: 'Old password wrong please check again.',
            status: false,
            validationType: 'matched'
          })
        }
      });
    });
  }

});

router.post('/complaint-details-discussion-close', isCustomer, (req, res) => {

  let ComplaintCode = req.body.complainCode;
  ComplaintsSchema.updateOne({ 'coms_complaint_code': ComplaintCode }, { $set: { coms_complaint_status: 'completed' } }, { upsert: true }, function (err) {
    if (err) {
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      res.send({ status: true, message: 'Your complaint discussion closed successfully !!' })
    }
  });
});



router.post('/add-feedback', isCustomer, (req, res) => {
  upload(req, res, async () => {
    let RatingObj = '';
    //const ComplaintId = 'C-'+uuidv4().slice(uuidv4().length - 4).toUpperCase();;
    RatingObj = new RatingSchema({
      sprs_service_provider_id: req.body.spr_id,
      sprs_submitted_by: req.session.user_id,
      sprs_submitted_by_name: req.session.name,
      sprs_rating: req.body.rating,
      sprs_review: req.body.feedback_message,
      sprs_submitted_profile_img: req.session.imagename,
      sprs_is_active_user_flag: req.session.active_user_login
    });
    console.log('RatingData:', RatingObj)
    RatingObj.save().then(complaintsDetails => {
      res.send({ status: true, message: 'Thank you for your feedback !!' })
    }).catch(err => {
      console.log(err)
      res.send({ status: false, message: 'Something went wrong please try again later.' })
    });
  });
});



/************ Tagging Property with seller*/
router.post('/refresh', (req, res) => {
  console.log('session is ', req.session.email);

  PropertiesSchema.find({ ps_other_party_emailid: req.session.email, ps_is_active_user_flag: req.session.active_user_login })
    .then(async (data) => {
      if (data) {
        let arr = [];
        console.log("properties Data is :", data);
        for (let img of data) {
          await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {

            let temp = await result
            //for(let image of result){
            //  let temp = await image
            arr.push(temp)
            // }
          })

        }
        // console.log('++++++++',arr)
        res.send({
          message: "Property Added successfully",
          status: true
        })

        err_msg = req.flash('err_msg');
        success_msg = req.flash('success_msg');
        //res.json(data);
        res.render('mydreamhome', {
          err_msg, success_msg, layout: false,
          session: req.session,
          propertyData: data,
          propertyImage: arr

        });

      }
      else {
        res.send({
          message: "there is no property ffound ",
          status: false
        })
      }
    }).catch((err) => {
      console.log(err)
    })
});





router.post("/addTask_from_Dreamhome_detial", (req, res) => {

  console.log("addTask_fromDreamgome=========", req.body)
  if (req.body.Phase == '' || req.body.Phase == undefined || req.body.service_provider_id == '') {
    return res.send({
      'err_msg': 'All fields are required !!',
      'status': false,
      'redirect': '/professionals-hirenow'
    });


  } else {
    console.log("addTask post:", req.body);
    // <<<<<<< HEAD
    //     let taskName = '';
    //     if (req.body.task_name) {
    //       taskName = req.body.task_name;
    //     } else {
    //       taskName = req.body.phase_task_list;
    // =======
    var addedTask = addTaskHelper.add_existing_task_from_btn_dramhome_details(req);
    if (addedTask) {
      return res.send({
        'success_msg': 'Task Add Successfully',
        'status': true,
      });
    } else {
      return res.send({
        'err_msg': 'Please Add Task',
        'status': false,
      });
    }

    // console.log("addTask post:", req.body);
    // let taskName='';
    // if(req.body.task_name){
    //   taskName = req.body.task_name;
    // }else{
    //   taskName = req.body.phase_task_list;
    // }
    // const newTask = new PropertyProfessinoalTaskSchema({
    //   ppts_property_id: req.body.property_id_add_task,
    //   ppts_user_id: req.session.user_id,
    //   ppts_task_name: taskName,
    //   ppts_assign_to: req.body.service_provider_id,
    //   ppts_due_date: req.body.duedate,
    //   //ppts_phase_id: req.body.Phase,
    //   ppts_phase_name: req.body.Phase,
    //   ppts_is_active_user_flag: req.session.active_user_login,
    //   ppts_note: req.body.notes
    // });
    // newTask
    //   .save()
    //   .then(addedTask => {
    //     console.log("server response is addedTask :", addedTask);
    //     //res.json({ status: 1, message: 'Task Add Successfully', data: addedTask });
    //     if (addedTask) {

    //       return res.send({
    //         'success_msg': 'Task Add Successfully',
    //         'status': true,
    //         //'redirect': '/professionals-hirenow'
    //       });
    //       // res.redirect("/professionals-hirenow")
    //     } else {
    //       return res.send({
    //         'err_msg': 'Please Add Task',
    //         'status': false,
    //         //'redirect': '/professionals-hirenow'
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     req.flash('err_msg', 'Something went wrong please try again later.');
    //     res.redirect('/mydreamhome');
    //   });
  }
})


/************* Verifing Sercret Token */
async function submit_token(token, user_id) {
  console.log("secret token is", token);
  //console.log("secret token is", req.session.email);
  var decoded = jwt.verify(token, keys.secretOrKey);
  console.log("decoded string is :", decoded.id);
  PropertiesSchema.findOne({ _id: decoded.id }).then(async (data) => {
    if (data.is_invite_accepted == "no") {
      // let arr = [];

      // for (let img of data) {
      //   await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {

      //     let temp = await result
      //     //for(let image of result){
      //     //  let temp = await image
      //     arr.push(temp)
      //     // }
      //   })
      console.log("property id is user id", decoded.id);
      console.log();
      // }
      PropertiesSchema.updateOne({ '_id': decoded.id }, { $set: { ps_tagged_user_id: user_id, is_invite_accepted: 'yes' } }, { upsert: true }, function (err) {
        if (err) {
          // res.send({ status: false, message: 'Something going wrong please check again !!' })
          console.log('Something going wrong please check again !!'.err);
        } else {
          // res.send({ status: true, message: 'Your Property Added succfully !!' })
          console.log('Your Property Added succfully !!');
        }
      });
    } else {
      console.log("Property already added successfully");
    }
    // console.log('++++++++', arr);

    // add_new_property(data, arr, user_id);


    // err_msg = req.flash('err_msg');
    // success_msg = req.flash('success_msg');
    // res.json(data);
    // res.render('mydreamhome', {
    //   err_msg, success_msg, layout: false,
    //   session: req.session,
    //   propertyData: data,
    //   propertyImage: arr

    // });

    // }
  }).catch((err) => {
    console.log(err)
  })
  // return res.json(decoded);
};

async function add_new_property(propertyData, propertyImage, user_id) {
  //console.log("Property Data is", propertyData);
  //console.log("Property Data is***************", propertyData[0].ps_phase_array);
  var phaseArray = [];
  var chainPropertyIdArray = [];
  var chainPropertyNameArray = [];
  for (var i in propertyData.ps_phase_array) {
    var phaseObj = {
      phase_name: '',
      start_date: '',
      end_date: '',
      phase_status: 'pending',
    };
    phaseObj.phase_name = propertyData[0].ps_phase_array.phase_name[i];
    phaseObj.start_date = propertyData[0].ps_phase_array.start_date[i];
    phaseObj.end_date = propertyData[0].ps_phase_array.end_date[i];
    phaseArray.push(phaseObj);
  }
  var PropertyBoject = {
    ps_unique_code: propertyData[0].ps_unique_code,
    ps_user_id: user_id, //storing customer_ID
    ps_property_name: propertyData[0].ps_property_name,
    ps_property_address: propertyData[0].ps_property_address,
    ps_property_country_id: propertyData[0].ps_property_country_id,
    ps_property_state_id: propertyData[0].ps_property_state_id,
    ps_property_city_id: propertyData[0].ps_property_city_id,
    ps_property_zipcode: propertyData[0].ps_property_zipcode,
    //ps_property_user_as: req.body.ps_property_user_as,
    ps_property_user_as: propertyData[0].ps_property_user_as, //updaing active customer portal buyer/seller/renovator
    ps_other_party_fullname: propertyData[0].ps_other_party_fullname,
    ps_other_party_emailid: propertyData[0].ps_other_party_emailid,
    ps_other_party_invited: propertyData[0].ps_other_party_invited,
    ps_property_area: propertyData[0].ps_property_area,
    ps_property_bedroom: propertyData[0].ps_property_bedroom,
    ps_property_bathroom: propertyData[0].ps_property_bathroom,
    ps_additional_note: propertyData[0].ps_additional_note,
    ps_property_type: propertyData[0].ps_property_type,
    ps_is_active_user_flag: propertyData[0].ps_is_active_user_flag,
    ps_phase_array: phaseArray,
    ps_existing_property: propertyData[0].ps_existing_property,
    ps_chain_property_id: chainPropertyIdArray,
    ps_other_property_type: propertyData[0].ps_other_property_type,
    ps_chain_property_name: chainPropertyNameArray

  };
  if (propertyData[0].property_type == 'Chain') {
    var chain_propnameByid = await PropertiesSchema.findOne({ _id: propertyData[0].ps_chain_property });
    chainPropertyNameArray.push(chain_propnameByid.ps_property_name);
    chainPropertyIdArray.push(propertyData[0].ps_chain_property)
  }
  console.log("Property Object is :", PropertyBoject);
  const newProperty = new PropertiesSchema(PropertyBoject);
  await newProperty.save().then(async (property) => {
    //if (property) {
    //     let responce = await property
    console.log("newly added Property is :", property);
    await add_property_Image(propertyImage, property._id);
    // }
  }).catch((err) => {
    console.log("err response is");
  })
};

async function add_property_Image(propertyImage, propertyId) {
  console.log("saveing PropertyImage is : ", propertyImage[0])
  await propertyImage[0].forEach(element => {
    var obj = {
      pps_property_id: propertyId,
      pps_property_image_name: element.pps_property_image_name,
      pps_is_active_user_flag: element.pps_is_active_user_flag,
      // pps_property_image: {
      //     data: fs.readFileSync(path.join(__dirname + '../../../public/propimg/' + element.filename)),
      //     contentType: 'image/png'
      // }
    }
    PropertiesPictureSchema.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      }
      else {
        item.save().then(async (propertyImageResponce) => {
          console.log("Saved  Image response is", propertyImageResponce);
          // if(propertyImageResponce){
          //     let responce = await propertyImageResponce
          //     resolve(responce);
          // }
        }).catch((err) => {
          // reject(err)
        });
      }
    });
  });

}



router.post('/reapitApi-proprty', (req, res) => {
  console.log('session is ', req.session.email);
  console.log('ThridPartKeys:', ThridPartKeys.REAPIT_API.client_id)
  var options1 = {
    'method': 'POST',
    'url': ThridPartKeys.REAPIT_API.url,
    'headers': {
      'Authorization': ThridPartKeys.REAPIT_API.Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'XSRF-TOKEN=c9ed57ab-b617-4392-99f3-19aeff37a5f7'
    },
    form: {
      'client_id': ThridPartKeys.REAPIT_API.client_id,
      'grant_type': ThridPartKeys.REAPIT_API.grant_type
    }
  };

  request(options1, function (error, response, body) {
    let tokenRes = JSON.parse(body);
    var options = {
      'method': 'GET',
      'url': 'https://platform.reapit.cloud/properties/',
      'headers': {
        'api-version': '2020-01-31',
        'reapit-customer': 'SBOX',
        'Authorization': 'Bearer ' + tokenRes.access_token,
        'Content-Type': 'application/json'
      },
      body: ''
    };
    request(options, function (error, response) {
      if (error) {
        throw new Error(error);
      } else {
        let propertyJson = JSON.parse(response.body);
        let propertyAddress = [];
        let address = '';
        for (let property of propertyJson._embedded) {
          if (property.address.buildingName) {
            address += property.address.buildingName + ' ';
          }
          if (property.address.buildingNumber) {
            address += property.address.buildingNumber + ' ';
          }
          if (property.address.line1) {
            address += property.address.line1 + ' ';
          }
          if (property.address.line2) {
            address += property.address.line2 + ' ';
          }
          if (property.address.line3) {
            address += property.address.line3 + ' ';
          }
          if (property.address.line4) {
            address += property.address.line4 + ' ';
          }
          propertyAddress.push(address);
          address = '';
        }
        return res.send({
          mydatadata: propertyAddress
        });
      }
    });
  })
});



router.post('/reapitApi', (req, res) => {
  let searchText = req.body.searchText;
  console.log('TextVivek:', searchText);
  var options1 = {
    'method': 'POST',
    'url': ThridPartKeys.REAPIT_API.url,
    'headers': {
      'Authorization': ThridPartKeys.REAPIT_API.Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'XSRF-TOKEN=c9ed57ab-b617-4392-99f3-19aeff37a5f7'
    },
    form: {
      'client_id': ThridPartKeys.REAPIT_API.client_id,
      'grant_type': ThridPartKeys.REAPIT_API.grant_type
    }
  };
  request(options1, function (error, response, body) {
    console.log('accessToken:', body)
    let tokenRes = JSON.parse(body);
    console.log('tokenRes:', tokenRes)
    var options = {
      'method': 'GET',
      'url': 'https://platform.reapit.cloud/properties/?address=' + searchText,
      'headers': {
        'api-version': '2020-01-31',
        'reapit-customer': 'SBOX',
        'Authorization': 'Bearer ' + tokenRes.access_token,
        'Content-Type': 'application/json'
      },
      body: ''
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let ddd = JSON.parse(response.body);
      return res.send({
        propertyData: ddd._embedded
      });
    });
  });
});



router.post('/edit_task_submit_form', isCustomer, async (req, res) => {

  console.log("edit task req is:", req.body);

  console.log("Session  is:", req.session);

  var taskDetails = await PropertyProfessinoalTaskSchema.find({ ppts_property_id: req.body.ppts_property_id, ppts_task_name: req.body.ppts_task_name, _id: req.body.task_id, ppts_phase_flag: req.body.ppts_phase_flag });

  console.log("task Details is ", taskDetails);
  console.log("task Details is ", taskDetails[0].ppts_assign_to);
  console.log("req.body.ppts_new_assign_to :", req.body.ppts_new_assign_to);
  console.log("req.body.ppts_assign_to", req.body.ppts_assign_to);
  var t = taskDetails[0].ppts_assign_to;

  const index = t.indexOf(req.body.ppts_assign_to);
  if (index > -1) {
    t.splice(index, 1);
  }
  console.log('index:', index);
  t.insert(index, req.body.ppts_new_assign_to);

  //t.push(req.body.ppts_new_assign_to);
  console.log("task Details is after remove", t);
  //ppts_due_date: req.body.ppts_due_date,ppts_note: req.body.ppts_note
  PropertyProfessinoalTaskSchema.updateOne({ ppts_property_id: req.body.ppts_property_id, ppts_task_name: req.body.ppts_task_name, _id: req.body.task_id }, { $set: { ppts_assign_to: t } }, { upsert: true }, function (err) {


    if (err) {
      // res.json(err);
      console.log(err)
      res.send({ status: false, message: 'Something going wrong please check again !!' })
    } else {
      res.send({ status: true, message: 'Task update successfully !!' })
      console.log("Task update successfully");
    }
  });

});

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

router.get('/gethiredProfessionalist', async (req, res) => {
  console.log("fetching hired professional list for particular task", req.query);

  var taskData = await PropertyProfessinoalTaskSchema.find({ _id: req.query.task_id, ppts_property_id: req.query.ppts_property_id, ppts_phase_name: req.query.ppts_phase_name, ppts_task_name: req.query.ppts_task_name });
  console.log("taskData", taskData);
  if (taskData != null) {

    var professionalArray = [];
    for (let professionalId of taskData) {
      if (professionalId.ppts_is_remove_task == 'no') {
        //console.log("professional List is :", professionalId);
        //add condition for if more than two service provider in professionalid
        for (let profId of professionalId.ppts_assign_to) {
          // console.log('professional ID is', profId);
          var professionalData = await ServiceProviderSchema.findOne({ _id: profId });
          // console.log('professionalData:', professionalData);
          if (professionalData != null) {
            //console.log('Professional Data is coming')
            professionalArray.push(professionalData);
          }
        }
      }
    }
    console.log('professionalArray Arr:', professionalArray);
    // res.json(professionalArray);
    res.send({
      data: professionalArray,
      status: true
    })
  } else {
    res.send({
      message: 'Professional Data not found',
      status: false
    })
  }
});



router.get('/getunhiredProfessionalist', async (req, res) => {
  console.log("fetching unhired professional list for particular task", req.query);

  var taskData = await PropertyProfessinoalTaskSchema.find({ _id: req.query.task_id, ppts_property_id: req.query.ppts_property_id, ppts_phase_name: req.query.ppts_phase_name, ppts_task_name: req.query.ppts_task_name, ppts_phase_flag: req.query.ppts_phase_flag });

  var professionalIDArray = [];
  for (let professionalId of taskData) {
    for (let profId of professionalId.ppts_assign_to) {
      // if(professionalId.ppts_is_remove_task=='no'){
      professionalIDArray.push(profId);
      // }
    }
  }
  console.log("property hired professional data", professionalIDArray);
  console.log();
  console.log(); console.log(); console.log();

  //Now fetching Hired Professional Data for property
  var allhiredProfessionalData = await PropertyProfessionalSchema.find({ pps_property_id: req.query.ppts_property_id, pps_is_active_user_flag: 'buyer' });
  var allhiredProfessionalIDlist = [];
  for (let professionalId of allhiredProfessionalData) {
    allhiredProfessionalIDlist.push(professionalId.pps_service_provider_id.toString());
  }
  console.log('All hired professional for that property', allhiredProfessionalIDlist);
  console.log();
  console.log();

  // console.log("");
  //var unHiredProfessionalList = await compare(allhiredProfessionalIDlist, professionalIDArray);
  var unHiredProfessionalList = allhiredProfessionalIDlist.filter(function (obj) { return professionalIDArray.indexOf(obj) == -1; });
  console.log('final Array is', unHiredProfessionalList);
  console.log();
  console.log();


  //fetching Professional Data
  var unhiredProfessionalHiredData = [];
  for (let professionalId of unHiredProfessionalList) {
    console.log(professionalId);
    var professionalData = await ServiceProviderSchema.findOne({ _id: professionalId });
    console.log('professionalData:', professionalData);
    if (professionalData != null) {
      console.log('Professional Data is coming')
      unhiredProfessionalHiredData.push(professionalData);
    }
  }
  console.log("Professional DATA", unhiredProfessionalHiredData);
  // res.json(unhiredProfessionalHiredData);
  if (unhiredProfessionalHiredData) {
    res.send({
      data: unhiredProfessionalHiredData,
      status: true
    })
  } else {
    res.send({
      message: 'professional not found',
      status: false
    })
  }

});

router.post('/remove_uploaded_document', async(req, res) => {
console.log('remove_uploaded_document api req',req.body);
//CustomerUploadDocsSchema
//DocumentPermissionSchema
if(req.body.document_id!=''&&req.body.document_id!=undefined){
  await DocumentPermissionSchema.findOneAndRemove({dps_document_id:req.body.document_id});
 var is_delete= await CustomerUploadDocsSchema.findOneAndRemove({_id:req.body.document_id});
  if(is_delete){
    return res.send({
      'status':true,
      'message':'Document Remove Successfully..'
    })
  }
}else{
  return res.send({
    'status':false,
    'message':'Something Wrong...'
  })
}
})

module.exports = router;

