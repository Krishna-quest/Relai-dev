const express = require("express");
const router = express.Router();
const ServiceProviderSchema = require("../../models/service_providers");
const ServiceProviderOtherDetailsSchema = require("../../models/service_providers_other_details");
const ServiceProviderEducationSchema = require("../../models/service_provider_education");
const ServiceProviderEmploymentHistorySchema = require("../../models/service_provider_employment_history");
const ServiceProviderLanguageSchema = require("../../models/service_provider_languages");
const ServiceProviderPlanSchema = require("../../models/service_provider_plan");
const ServiceProviderPortfolioSchema = require("../../models/service_provider_portfolio");
const ServiceProviderReferenceSchema = require("../../models/service_provider_reference");
const ServiceProviderRolesSchema = require("../../models/service_provider_roles");
const PlanSchema = require("../../models/plan");
const ServiceProviderPersonalDetailsSchema = require("../../models/service_provider_personal_details");
const ServiceProviderIndemnityDetailsSchema = require("../../models/service_provider_indemnity_details");
const validateProfChangePasswordInput = require('../../Validation/change-password-professional');


const isEmpty = require('../../Validation/is-empty');


const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

var nodemailer = require('nodemailer');
const http = require('http');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var dateTime = require('node-datetime');

// Load Input Validation
const validateServiceProviderRegisterInput = require('../../Validation/service_provider_signup');
const validateServiceProviderSigninInput = require('../../Validation/service_provider_signin');
const { where } = require("../../models/service_provider_employment_history");


////const { service_provider_register, service_provider_signin, service_provider_personal_details, service_provider_other_details, service_provider_Indemnity_details, service_provider_Roles, service_provider_education, service_provider_employment_history, service_provider_language, service_provider_plan, service_provider_portfolio, service_provider_reference, pricing_plan } = require("../../controllers/service_providers");


//router.post("/service_provider_register", service_provider_register);
//router.post("/service_provider_personal_details", service_provider_personal_details);
//router.post("/service_provider_other_details", service_provider_other_details);
//router.post("/service_provider_indemnity_details", service_provider_Indemnity_details);
//router.post("/service_provider_roles", service_provider_Roles);
//router.post("/service_provider_education", service_provider_education);
//router.post("/service_provider_employment_history", service_provider_employment_history);
//router.post("/service_provider_language", service_provider_language);
//router.post("/service_provider_plan", service_provider_plan);
//router.post("/service_provider_portfolio", service_provider_portfolio);
//router.post("/service_provider_reference", service_provider_reference);
//router.post("/service_provider_signin", service_provider_signin);
//router.post("/pricing_plan", pricing_plan);







/* -------------------------------------------------------------------------------------------------
POST : service_provider_register post api is responsible for submitting signup-service-provider form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_register", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  var service_provider = null;
  console.log("req.body is : ", req.body);
  const { errors, isValid } = validateServiceProviderRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    console.log("errors is ", errors);
    // req.flash('err_msg', errors.confirmPassword);
    // return res.redirect('/signup-service-provider')
    console.log('errosss:', errors)
    if (errors.confirmPassword) {
      res.send({
        message: errors.confirmPassword,
        status: false
      })
    } else {
      res.send({
        message: errors.sps_email_id,
        status: false
      })
    }
  }

  ServiceProviderSchema.findOne({ sps_email_id: req.body.sps_email_id }).then(serviceProviders => {
    if (serviceProviders) {
      errors.sps_email_id = 'Email already exists';
      console.log("error is :", errors);
      // req.flash('err_msg', errors.sps_email_id);
      // return res.redirect('/signup-service-provider');
      res.send({
        message: errors.sps_email_id,
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

      const newServiceProvider = new ServiceProviderSchema({
        sps_unique_code: "sp-" + uuidv4(),
        sps_firstname: req.body.sps_firstname,
        sps_lastname: req.body.sps_lastname,
        sps_fullname: req.body.sps_firstname + ' ' + req.body.sps_lastname,
        sps_email_id: req.body.sps_email_id,
        sps_phone_number: req.body.sps_phone_number,
        sps_address: req.body.sps_address,
        sps_country_id: req.body.country,
        sps_city: req.body.city,
        sps_state: req.body.state,
        sps_password: req.body.sps_password,
        sps_role_name: req.body.sps_role_name,
        sps_experience: req.body.sps_experience,
        sps_otp: otp,
        sps_otp_expie_time: otp_expire,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newServiceProvider.sps_password, salt, (err, hash) => {
          if (err) throw err;
          newServiceProvider.sps_password = hash;
          newServiceProvider
            .save()
            .then(serviceProviders => {
              console.log("service_provider is", serviceProviders);
              //calling Otp verfication
              // otp_verification(req, otp);
              req.session.success = true,
                // req.session._id = doc.user_id;
                req.session.user_id = serviceProviders._id,
                req.session.name = serviceProviders.sps_firstname + ' ' + serviceProviders.sps_lastname,
                req.session.sps_firstname = serviceProviders.sps_firstname,
                req.session.sps_lastname = serviceProviders.sps_lastname,
                req.session.sps_address = serviceProviders.sps_address,
                req.session.email = serviceProviders.sps_email_id,
                req.session.role = serviceProviders.sps_role_name,
                req.session.is_user_logged_in = true,
                //   req.flash('service_provider', serviceProviders);
                // res.redirect("/signup-professionals-profile")
                res.send({
                  serviceProviders: serviceProviders,
                  message: "You have registered sucessfully.",
                  status: true,

                })

            })
            .catch(err => {
              console.log(err)
              // req.flash('err_msg', 'You have entered wrong email or password please try again.');
              // res.redirect('/signup-service-provider');
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


/* -------------------------------------------------------------------------------------------------
POST : service_provider_personal_details post api is responsible for submitting signup-professionals-profile form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_personal_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("user_id is:", req.session.user_id);

  const serviceProviderPersonalDetails = new ServiceProviderPersonalDetailsSchema({
    spods_service_provider_id: req.session.user_id, //storing service_provider_id
    spods_surname: req.body.spods_surname,
    spods_fornames: req.body.spods_fornames,
    spods_preferred_title: req.body.spods_preferred_title,
    spods_former_surnames: req.body.spods_former_surnames,
    spods_address: req.body.spods_address,
    spods_dob: req.body.spods_dob,
    spods_nationality: req.body.spods_nationality,
    spods_postcode: req.body.spods_postcode,
    spods_home_telephone_number: req.body.spods_home_telephone_number,
    spods_postcode_covered: req.body.spods_postcode_covered,
    spods_start_working_time: req.body.start_working_time,
  });
  serviceProviderPersonalDetails
    .save()
    .then(serviceProviders => {
      console.log("server res is : ", serviceProviders);
      // res.redirect("/signup-professionals-profile-2")
      res.send({
        message: 'Personal-details sumitted successfully,please continue....',
        status: true,
      })

    })
    .catch(err => {
      console.log(err)
      res.send({
        message: 'Something went wrong please try after some time!',
        status: false
      })
      //req.flash('err_msg', 'Something went wrong please try after some time!');
      //res.redirect('/signup-professionals-profile');
    });
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_other_details post api is responsible for submitting signup-professionals-profile-2 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_other_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.spods_option_criminal_convictions == 'yes' && req.body.spods_details_of_convictions == "") {
    //req.flash('err_msg', '.');
    //return res.redirect('/signup-professionals-profile-2')
    res.send({
      message: "Please enter criminal convictions details",
      status: false,
      redirectpage: false,
      redirect: ''
    })
  }
  else {
    const serviceProviderOtherDetails = new ServiceProviderOtherDetailsSchema({
      spods_service_provider_id: req.session.user_id, //storing service_provider_id
      spods_option_work_permit_for_uk: req.body.spods_option_work_permit_for_uk,
      spods_option_criminal_convictions: req.body.spods_option_criminal_convictions,
      spods_option_uk_driving_licence: req.body.spods_option_uk_driving_licence,
      spods_details_of_convictions: req.body.spods_details_of_convictions,
      spods_professional_body: req.body.spods_professional_body,
      spods_date_registered: req.body.spods_date_registered,
      spods_membership_number: req.body.spods_membership_number,
      spods_membership_no_date_registered: req.body.spods_membership_no_date_registered,
      spods_other_relevant_qualification: req.body.spods_other_relevant_qualification
    });
    serviceProviderOtherDetails
      .save()
      .then(serviceProviders => {
        console.log("server response is ;", serviceProviders);
        // res.redirect("/signup-professionals-profile-3")
        res.send({
          message: "Other-details submitted successfully, please continue...",
          status: true
        })
      })
      .catch(err => {
        console.log(err)
        //req.flash('err_msg', 'Something went wrong please try after some time');
        //res.redirect('/signup-professionals-profile-2');
        res.send({
          message: "something went wrong please try after some time!",
          status: false,
          redirectpage: false,
          redirect: ''
        })
      });
  }
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_education post api is responsible for submitting signup-professionals-profile-3 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_education", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.education_id) {

    ServiceProviderEducationSchema.updateOne({ 'spes_service_provider_id': req.session.user_id, '_id': req.body.education_id }, {
      $set: {
        spes_university_school_name: req.body.spes_university_school_name,
        spes_qualification_obtained: req.body.spes_qualification_obtained,
        spes_from_date: req.body.spes_from_date,
        spes_to_date: req.body.spes_to_date,
      }
    }, { upsert: true }, function (err) {
      if (err) {
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
      } else {
        res.send({
          status: true,
          action: 'update',
          success_msg: 'Education updated successfully'
        });
      }
    })


  } else {

    const serviceProviderEducation = new ServiceProviderEducationSchema({
      spes_service_provider_id: req.session.user_id,
      spes_university_school_name: req.body.spes_university_school_name,
      spes_qualification_obtained: req.body.spes_qualification_obtained,
      spes_from_date: req.body.spes_from_date,
      spes_to_date: req.body.spes_to_date,
    });
    serviceProviderEducation
      .save()
      .then(serviceProviders => {
        console.log("server response is: ", serviceProviders);
        res.send({
          educationDetail: serviceProviders,
          status: true,
          success_msg: 'Education added successfully',
          action: 'add'
        });
      })
      .catch(err => {
        console.log(err)
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });

      });

  }

});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_employment_history post api is responsible for submitting signup-professionals-profile-4 from data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_employment_history", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  var obj = {
    spehs_name_of_employer: req.body.spehs_name_of_employer,
    spehs_job_title: req.body.spehs_job_title,
    spehs_job_description: req.body.spehs_job_description,
    spehs_reason_for_leaving: req.body.spehs_reason_for_leaving,
    spehs_from_date: req.body.spehs_from_date,
    spehs_to_date: req.body.spehs_to_date
  }
  if (req.body.employment_id) {
    ServiceProviderEmploymentHistorySchema.updateOne({ 'spehs_service_provider_id': req.session.user_id, '_id': req.body.employment_id }, { $set: obj }, { upsert: true }, function (err) {
      if (err) {
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
      } else {
        res.send({
          status: true,
          action: 'update',
          success_msg: 'Employment History updated successfully'
        });
      }
    })
  } else {
    const serviceProviderEmploymentHistory = new ServiceProviderEmploymentHistorySchema({
      //rs_service_provider_id /*Need to store same sp_id while registering */
      spehs_service_provider_id: req.session.user_id,
      spehs_name_of_employer: req.body.spehs_name_of_employer,
      spehs_job_title: req.body.spehs_job_title,
      spehs_job_description: req.body.spehs_job_description,
      spehs_reason_for_leaving: req.body.spehs_reason_for_leaving,
      spehs_from_date: req.body.spehs_from_date,
      spehs_to_date: req.body.spehs_to_date
    });
    serviceProviderEmploymentHistory
      .save()
      .then(serviceProviders => {
        console.log("server response is", serviceProviders);
        //res.redirect("/signup-professionals-profile-5")
        // res.send({
        //   employmentDetail: serviceProviders,
        //   status: true
        // });
        res.send({
          employmentDetail: serviceProviders,
          status: true,
          success_msg: 'Employment History added successfully',
          action: 'add'
        });
      })
      .catch(err => {
        console.log(err)
        // req.flash('err_msg', 'Something went wrong please try after some time');
        //res.redirect('/signup-professionals-profile-4');
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
      });
  }
});
router.post("/edit-service_provider_employment_history", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let data = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'employment-edit') {
    data = await ServiceProviderEmploymentHistorySchema.findOne({ _id: req.body.emp_historyId });
  }
  if (data) {
    console.log("server response is success: ", data);
    res.send({
      data: data,
      message: 'Update Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", data);
    res.send({
      data: data,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});
router.post("/delete-service_provider_employment_history", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let deleteData = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'employment-delete') {
    deleteData = await ServiceProviderEmploymentHistorySchema.deleteOne({ _id: req.body.emp_historyId });
  }
  if (deleteData) {
    console.log("server response is success: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Deleted Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});
/* -------------------------------------------------------------------------------------------------
POST : service_provider_reference post api is responsible for submitting signup-professionals-profile-5 from data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_reference", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if(req.body.ref_id){
   console.log('edit able')
   const serviceProviderReference = {
    //rs_service_provider_id //TODO:*Need to store same sp_id while registering */
    rs_service_provider_id: req.session.user_id,
    rs_reference_type: req.body.rs_reference_type,
    rs_reference_job_title: req.body.rs_reference_job_title,
    rs_reference_organisation: req.body.rs_reference_organisation,
    rs_reference_postal_code: req.body.rs_reference_postal_code,
    rs_reference_address: req.body.rs_reference_address,
    rs_reference_telephonenumber: req.body.rs_reference_telephonenumber,
    rs_reference_emailid: req.body.rs_reference_emailid,
    rs_option_obtain_reference: req.body.rs_option_obtain_reference,
    rs_reference_relationship: req.body.rs_reference_relationship,
    rs_reference_fullname: req.body.rs_reference_fullname
  }
  ServiceProviderReferenceSchema
      .updateOne(serviceProviderReference).where({_id:req.body.ref_id})
      .then(serviceProviders => {
        
        console.log("server response is:", serviceProviders);
        
        res.send({
          message: "Reference-details Update successfully",
          status: true,
          redirect :'/service-provider/dashboard-professional',
          action:'edit'
        })
      })
      .catch(err => {
        console.log(err)
        
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
  
      });
  }else{
    console.log('add able');
    
    const serviceProviderReference = new ServiceProviderReferenceSchema({
      //rs_service_provider_id //TODO:*Need to store same sp_id while registering */
      rs_service_provider_id: req.session.user_id,
      rs_reference_type: req.body.rs_reference_type,
      rs_reference_job_title: req.body.rs_reference_job_title,
      rs_reference_organisation: req.body.rs_reference_organisation,
      rs_reference_postal_code: req.body.rs_reference_postal_code,
      rs_reference_address: req.body.rs_reference_address,
      rs_reference_telephonenumber: req.body.rs_reference_telephonenumber,
      rs_reference_emailid: req.body.rs_reference_emailid,
      rs_option_obtain_reference: req.body.rs_option_obtain_reference,
      rs_reference_relationship: req.body.rs_reference_relationship,
      rs_reference_fullname: req.body.rs_reference_fullname
    });
  
    serviceProviderReference
      .save()
      .then(serviceProviders => {
        
        console.log("server response is:", serviceProviders);
        
        res.send({
          message: "Reference-details submitted successfully, please continue...",
          status: true,
          action:'add'
        })
      })
      .catch(err => {
        console.log(err)
        
        res.send({
          err_msg: 'Something went wrong please try after some time',
          status: false
        });
  
      });
  }
  
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_indemnity_details post api is responsible for submitting signup-professionals-profile-6 form data 
------------------------------------------------------------------------------------------------- */


router.post("/service_provider_indemnity_details", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired

  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  console.log("req.body.spods_option_pl_claims is ", req.body.spods_option_pl_claims);
  console.log("req.body.spods_pl_claim_details is ", req.body.spods_pl_claim_details);
  if (req.body.spods_option_pl_claims === "yes" && req.body.spods_pl_claim_details === '') {
    //req.flash("err_msg", "Please Enter PI claim details!");
    //res.redirect('/signup-professionals-profile-6');
    console.log("req.body.spods_option_pl_claims is ", req.body.spods_option_pl_claims);
    res.send({
      message: "Please enter PI claim details",
      status: false,
      redirectpage: false,
      redirect: ''
    })
  } else {
    const serviceProviderIndemnityDetails = new ServiceProviderIndemnityDetailsSchema({
      spods_service_provider_id: req.session.user_id,
      spods_option_pl_claims: req.body.spods_option_pl_claims,
      spods_pl_claim_details: req.body.spods_pl_claim_details,
      spods_option_pl_cover: req.body.spods_option_pl_cover,
      spods_name_insurer: req.body.spods_name_insurer,
      spods_broker_details: req.body.spods_broker_details,
      spods_level_of_cover: req.body.spods_level_of_cover,
      spods_renewal_date: req.body.spods_renewal_date,

    });
    serviceProviderIndemnityDetails
      .save()
      .then(serviceProviders => {
        console.log("server response is:", serviceProviders);
        res.send({
          message: "Indemnity-Details submitted successfully.please continue...",
          status: true,
        })
        //res.redirect("/signup-professionals-profile-7")
      })
      .catch(err => {
        console.log(err)
        res.send({
          message: "Something went wrong please try after some time ",
          status: false,
        })
        //req.flash('err_msg', 'Something went wrong please try after some time');
        //res.redirect('/signup-professionals-profile-6');
      });
  }
});


/* -------------------------------------------------------------------------------------------------
POST : service_provider_language post api is responsible for submitting signup-professionals-profile-7 form data 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_language", (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  var flag = true;
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  for (var i in req.body.spls_language) {
    const serviceProviderLanguage = new ServiceProviderLanguageSchema({
      //spls_service_provider_id /*Need to store same sp_id while registering */
      spls_service_provider_id: req.session.user_id,
      spls_language: req.body.spls_language[i],
      spls_language_proficiency_level: req.body.spls_language_proficiency_level[i]
    });
    console.log("input request is:", i, serviceProviderLanguage);
    serviceProviderLanguage
      .save()
      .then(serviceProviders => {
        console.log("server response is :", serviceProviders);
        flag = true;
        //res.redirect("/portfolio")
        // res.send({
        //   message: "language-details submitted successfully.please continue...",
        //   status: true,
        // });

      })
      .catch(err => {
        console.log(err)
        //req.flash('err_msg', 'Something went wrong please try again later.');
        //res.redirect('/signup-professionals-profile-7');
        res.send({
          message: "Something went wrong please try again later.",
          status: false,
        });
      });
  }
  if (flag == true) {
    res.send({
      message: "language-details submitted successfully.please continue...",
      status: true,
    });
  }
});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_sign post api is used for login service_provider account 
------------------------------------------------------------------------------------------------- */

router.post("/service_provider_signin",
  (req, res) => {
    var err_msg = null;
    var success_msg = null;
    //TODO:need to add condition if session is expired

    const sps_email_id = req.body.sps_email_id;
    const sps_password = req.body.sps_password;

    const { errors, isValid } = validateServiceProviderSigninInput(req.body);

    // Check Validation
    if (!isValid) {
      // req.flash('err_msg', "please enter valid emailid and password")
      // return res.redirect('/signin-professional');
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
      ServiceProviderSchema.findOne({ sps_email_id }).then(service_provider => {
        // Check for Customer
        if (!service_provider) {
          console.log("service provider not found");
          errors.sps_email_id = 'service provider not found';
          //req.flash('err_msg', errors.cus_email_id);
          //return res.redirect('/signin');
          res.send({
            message: "Service provider not found",
            status: false,
            redirectpage: false,
            redirect: ''
          })
        }
        // else if (service_provider.sps_email_verification_status == 'no') {

        //   console.log("Sending Otp if user email not verified");
        //   otp_send(req, service_provider);
        //   res.send({
        //     message: "Please verify  OTP first",
        //     status: false,
        //     redirectpage: true,
        //     redirect: "/otp-professional?email=" + sps_email_id
        //     //redirect to OTP
        //   })
        //}}
        else {
          // Check Password
          bcrypt.compare(sps_password, service_provider.sps_password).then(isMatch => {
            if (isMatch) {
              //enableing session variable
              // req.session._id = doc.user_id;
              req.session.success = true
              req.session.user_id = service_provider._id;
              req.session.name = service_provider.sps_firstname + '' + service_provider.sps_lastname;
              req.session.sps_firstname = service_provider.sps_firstname;
              req.session.sps_lastname = service_provider.sps_lastname;
              req.session.sps_address = service_provider.sps_address;
              req.session.email = service_provider.sps_email_id;
              req.session.role = service_provider.sps_role_name;
              req.session.is_user_logged_in = true;

              // service_provider Matched
              const payload = { id: service_provider.id, sps_fullname: service_provider.sps_firstname + '' + service_provider.sps_lastname, sps_email_id: service_provider.sps_email_id }; // Create JWT Payload

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
              console.log("Signin Successfully");
              // res.redirect('/dashboard-professional')
              res.send({
                message: "Signin successfully, we are processing please wait...",
                status: true
              })

            } else {
              console.log("password incorrect");
              // errors.sps_password = 'Password incorrect';
              // console.log("Password incorrect");
              // req.flash("err_msg", errors.sps_password);
              // return res.redirect('/signin-professional');
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


//Sending otp for email verifictaion while registering user
function otp_send(req, Service_provider) {
  console.log("Service provider Data :", Service_provider);

  var now = new Date();
  now.setMinutes(now.getMinutes() + 03); // timestamp
  now = new Date(now); // Date object

  var otp_expire = now
  console.log("otp_expire time is", now);
  var otp = generateOTP();
  console.log(" Generated OTP is ", otp);

  ServiceProviderSchema.updateOne({
    'sps_email_id': Service_provider.sps_email_id
  }, {
    $set: {
      sps_otp: otp,
      sps_otp_expie_time: otp_expire
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
        to: Service_provider.sps_email_id,
        from: keys.user4,
        subject: 'OTP verification from Relai',

        text: 'Dear \n' + Service_provider.sps_fullname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + Service_provider.sps_email_id + '\n\n' +

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

/* -------------------------------------------------------------------------------------------------
GET : Logout API  
------------------------------------------------------------------------------------------------- */
router.get('/sp_logout', function (req, res) {
  console.log("logout");
  var test = req.session.is_user_logged_in;
  if (test == true) {
    req.session.destroy(function (err) {
      if (err) {
        return err;
      } else {
        return res.redirect('/signin-professional');
      }
    });
  }
});

/* -------------------------------------------------------------------------------------------------
POST : forget-password-professional  api is used for sending Password on user gmail 
------------------------------------------------------------------------------------------------- */
router.post('/forget-password-professional', function (req, res) {
  console.log("req.body is :", req.body);
  ServiceProviderSchema.find({
    'sps_email_id': req.body.sps_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      // console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      // res.redirect('/forget-password-professional');
      res.send({
        message: 'Please enter registered Email address.',
        status: false
      })
    } else {

      if (result != '' && result != null) {
        //generating 6 digit password hash
        new_pass = Math.random().toString(36).slice(-6);
        var hashPassword = "";
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_pass, salt, (err, hash) => {
            if (err) throw err;
            hashPassword = hash;

            ServiceProviderSchema.updateOne({
              'sps_email_id': req.body.sps_email_id
            }, {
              $set: {
                sps_password: hashPassword
              }
            }, {
              upsert: true
            }, function (err) {
              if (err) {
                // console.log("err is :", err);
                // req.flash('err_msg', 'Something went wrong.');
                // res.redirect('/forget-password-professional')
                console.log('Error is :', err);
                res.send({
                  message: 'Something went wrong please contact to support team..',
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
                  to: req.body.sps_email_id,
                  from: keys.user4,
                  subject: 'Relai Forget Password',

                  text: 'Dear ServiceProvider,' + '\n\n' + 'New Password from Relai.\n\n' +
                    'Password: ' + new_pass + '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n' + 'Here is the change password link: http://' + req.headers.host + '/signin-professional' + '\n\n' +
                    'Thanks and Regards,' + '\n' + 'Relai Team' + '\n\n',

                };
                smtpTransport.sendMail(mailOptions, function (err) {
                  if (err) {
                    console.log('email sending failed and error is :', err);
                    res.send({
                      message: 'Something went wrong please contact to support team..',
                      status: false
                    })
                    //  console.log('err_msg is :', err); req.flash('err_msg', 'Something went wrong.please connect support team'); res.redirect('/forget-password-professional') 
                  } else {
                    // req.flash('success_msg', 'Password has been sent successfully to your registered email, please check your mail...');
                    // res.redirect('/signin-professional')
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
        // req.flash('err_msg', 'Please enter registered Email address.');
        // res.redirect('/forget-password-professional');
        res.send({
          message: 'Please enter registered Email address.',
          status: false
        })
      }

    }
  });
});



/* -------------------------------------------------------------------------------------------------
POST : service_provider_delete_action post api
------------------------------------------------------------------------------------------------- */

router.post("/delete-professional-basic-details", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let deleteData = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'education-delete') {
    deleteData = await ServiceProviderEducationSchema.deleteOne({ _id: req.body.eduId });
  }
  if (deleteData) {
    console.log("server response is success: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Deleted Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", deleteData);
    res.send({
      deleteData: deleteData,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});

/* -------------------------------------------------------------------------------------------------
POST : service_provider_edit_action post api
------------------------------------------------------------------------------------------------- */

router.post("/edit-professional-basic-details", async (req, res) => {
  var err_msg = null;
  var success_msg = null;
  //TODO:need to add condition is session is expired
  let data = '';
  console.log("req.body is : ", req.body);
  console.log("req.session.user_id is ", req.session.user_id);
  if (req.body.action == 'education-edit') {
    data = await ServiceProviderEducationSchema.findOne({ _id: req.body.eduId });
  }
  if (data) {
    console.log("server response is success: ", data);
    res.send({
      data: data,
      message: 'Update Successfully !!',
      status: true
    });
  } else {
    console.log("server response is error: ", data);
    res.send({
      data: data,
      message: 'Something going wrong please try again !!',
      status: false
    });
  }

});



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


router.post('/resend-otp-link2', function (req, res) {
  console.log("Sending otp link to registered email-id", req.body.email);
  ServiceProviderSchema.find({
    'sps_email_id': req.body.email,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Service Provider Not Found.',
        status: false
      })
    }
    else {

      if (result != '' && result != null) {
        console.log("Service Provider results is :", result[0].sps_otp);
        var now = new Date();
        now.setMinutes(now.getMinutes() + 03); // timestamp
        now = new Date(now); // Date object

        var otp_expire = now
        console.log("otp_expire time is", now);
        var otp = generateOTP();
        console.log(" Generated OTP is ", otp);

        ServiceProviderSchema.updateOne({
          'sps_email_id': req.body.email
        }, {
          $set: {
            sps_otp: otp,
            sps_otp_expie_time: otp_expire
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

              text: 'Dear \n' + result[0].sps_firstname + result[0].sps_lastname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + req.body.email + '\n\n' +

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
        console.log("Service Provider Data not found");
        res.send({
          message: 'Service Provider Data not found.',
          status: false
        })
      }
    }
  });

});





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
    to: req.body.sps_email_id,
    from: keys.user4,
    subject: 'OTP verification from Relai',

    text: 'Dear \n' + req.body.sps_firstname + ' ' + req.body.sps_lastname + '\n\n' + 'your OTP for email-validation is  \n' + otp + '\n\n' + 'We suggest you to please hit given url and submit otp:\n' + ' http://' + req.headers.host + '/otp?email=' + req.body.sps_email_id + '\n\n' +

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

/*********OTP Verification for ServiceProvider****************/
router.post('/otp_verfication2', function (req, res) {
  console.log("req.body is :", req.body);
  var otp1 = req.body.otp1;
  var otp2 = req.body.otp2;
  var otp3 = req.body.otp3;
  var otp4 = req.body.otp4;
  var otp = otp1 + otp2 + otp3 + otp4;
  console.log("getting otp from form data", otp);

  ServiceProviderSchema.find({
    'sps_email_id': req.body.sps_email_id,
    //'cus_email_verification_status': 'yes'
  }, function (err, result) {
    if (err) {
      console.log('err', err);
      // req.flash('err_msg', 'Please enter registered Email address.');
      //res.redirect('/forget-password');
      res.send({
        message: 'Service Provider Not Found.',
        status: false
      })
    }
    else {

      if (result != '' && result != null) {
        console.log("Service Provider results is :", result[0].sps_otp);
        console.log("OTP is ", otp);
        if (parseInt(result[0].sps_otp) === parseInt(otp)) {

          ServiceProviderSchema.updateOne({
            'sps_email_id': req.body.sps_email_id
          }, {
            $set: {
              sps_email_verification_status: 'yes'
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
        console.log("Service Provider Data not found");
        res.send({
          message: 'Service Provider Data not found.',
          status: false
        })
      }
    }
  });
});

//***************** post changes password **************//
router.post('/professional-change-password', function (req, res) {
  console.log("calling change password API", req.body);
  var user_id = req.session.user_id;
  const { errors, isValid } = validateProfChangePasswordInput(req.body);

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
        message: errors.sps_password,
        status: false,
        validationType: 'length'
      })
    }
    //return; // res.redirect('/change-Password');
  } else {
    // Find Customer by 
    ServiceProviderSchema.findOne({ _id: req.session.user_id }).then(sp => {
      bcrypt.compare(req.body.oldPassword, sp.sps_password).then(isMatch => {
        if (isMatch) {
          //enableing session variable
          var hashPassword = "";
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.sps_password, salt, (err, hash) => {
              if (err) throw err;
              hashPassword = hash;
              ServiceProviderSchema.updateOne({
                '_id': req.session.user_id
              }, {
                $set: {
                  sps_password: hashPassword
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
                  // return;
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




module.exports = router;
