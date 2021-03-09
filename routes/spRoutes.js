const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();
const moment = require('moment');
var fs = require('fs');
var auth = require('../config/auth');
var multer = require('multer');

var isCustomer = auth.isCustomer;
var isServiceProvider = auth.isServiceProvider;
var signUpHelper = require('./api/service_provider_helper/signup_helper')
var trackYourProgress = require('./api/service_provider_helper/trackYourProgress')

var propertyProfessinoal = require('./api/service_provider_helper/propertyProfessionalHelper')
var propertyHelper = require('./api/service_provider_helper/sp_propertydetial');
var customerHelper = require('./api/service_provider_helper/customerHelper')

const PropertiesPictureSchema = require("../models/properties_picture");
//const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");
const PropertiesSchema = require("../models/properties");
const PropertyProfessionalSchema = require("../models/property_professional_Schema");
const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");
const ServiceProviderSchema = require("../models/service_providers");
const ServiceProviderPersonalDetailsSchema = require("../models/service_provider_personal_details");
const ServiceProviderEducationSchema = require("../models/service_provider_education");
const ServiceProviderOtherDetailsSchema = require("../models/service_providers_other_details");
const ServiceProviderLanguageSchema = require("../models/service_provider_languages");
const ServiceProviderEmploymentHistorySchema = require('../models/service_provider_employment_history');
const ServiceProviderReferenceSchema = require("../models/service_provider_reference");
const ServiceProviderIndemnityDetailsSchema = require("../models/service_provider_indemnity_details");

app.get('/signup-professionals-profile-5', async (req, res) => {
  console.log('55555555555', req.query)
  if (req.query.editid) {
    let refrenceData = await signUpHelper.getReferenceDetailById(req.query.editid);
    console.log(refrenceData)
    if (refrenceData) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('signup-professionals-profile-5', {
        err_msg, success_msg, layout: false,
        session: req.session,
        refrenceData: refrenceData
      });
    } else {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('signup-professionals-profile-5', {
        err_msg, success_msg, layout: false,
        session: req.session,
        refrenceData: null
      });
    }
  } else {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('signup-professionals-profile-5', {
      err_msg, success_msg, layout: false,
      session: req.session,
      refrenceData: null
    });
  }

  // res.render('signup-professionals-profile-5', {
  //   err_msg, success_msg, layout: false,
  //   session: req.session
  // });
});
app.get('/service-provider/dashboard-professional', isServiceProvider, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = "service-provider/dashboard-professional"
  res.render('service-provider/dashboard-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/otp-professional', function (req, res) {
  console.log("current session is :", req.session);

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('otp-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/service-provider/track-your-progress-professionals', isServiceProvider, async function (req, res) {
  let data = await trackYourProgress.getAllPropertyByUserId(req.session.user_id)
  console.log('data=======', data);
  //console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/track-your-progress-professionals';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/track-your-progress-professionals', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: data
  });
});
// app.post('/service-provider/track-your-progress-professionals', isServiceProvider, async function (req, res) {
//   console.log(req.body);
//   var start=req.body.start
//   var limit=req.body.limit
//   let data = await trackYourProgress.getAllPropertyByUserId1(req.session.user_id,start,limit)
//   console.log('data===========',data)
//   res.send({
//     'data':data
//   })
// })
app.get('/service-provider/property', isServiceProvider, async function (req, res) {
  console.log("current session is  from sp end:", req.session);
  req.session.pagename = 'service-provider/property';
  let propertyArray = []
  PropertiesSchema.find().sort({ _id: -1 }).then(async (data) => {
    if (data) {
      let arr = [];
      //console.log("Property Data is", data);
      for (let img of data) {

        propertyArray.push(data)
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {

          let temp = await result
          //for(let image of result){
          //  let temp = await image
          let customerName = await customerHelper.getCustomerNameByID(img.ps_user_id);
          let customerProfile = await customerHelper.getCustomerImageByID(img.ps_user_id);
          temp.customer_name = await customerName
          temp.customer_profile = await customerProfile
          arr.push(temp)
          // }
          console.log("arr is", arr);
        })
      }

      //data.add(t);
      // console.log("customer_name is ", arr[0].customer_name);
      // console.log('++++++++',arr)
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');

      res.render('service-provider/property', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyData: data,
        propertyImage: arr
      });

    }
  }).catch((err) => {
    console.log(err)
  })

})
// let AllhiredProfeshnoal = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id);
// for (let key of AllhiredProfeshnoal) {
//   let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id);
//   let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
//   propertyData.property_image = await propertyImageData.pps_property_image_name;
//   let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
//   let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
//   propertyData.customer_name = await customerName
//   propertyData.customer_profile = await customerProfile
//   propertyArray.push(propertyData)

// }

//   console.log("propertyIdArray", propertyArray);
//   res.render('service-provider/property', {
//     err_msg, success_msg, layout: false,
//     session: req.session,
//     propertyData: propertyArray,

//   })
// });
app.get('/service-provider/professionals-to-do-list', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/professionals-to-do-list';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professionals-to-do-list', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/myproperties', isServiceProvider, async function (req, res) {
  console.log("", req.session);
  req.session.pagename = 'service-provider/property';
  let propertyArray = []
  let AllhiredProfeshnoal = await propertyProfessinoal.getHiredPropertyProfessional(req.session.user_id);
  for (let key of AllhiredProfeshnoal) {
    let propertyData = await propertyHelper.getPropertyByID(key.pps_property_id);
    let propertyImageData = await propertyHelper.getPropertyImageByID(propertyData._id);
    propertyData.property_image = await propertyImageData.pps_property_image_name;
    let customerName = await customerHelper.getCustomerNameByID(key.pps_user_id);
    let customerProfile = await customerHelper.getCustomerImageByID(key.pps_user_id);
    propertyData.customer_name = await customerName
    propertyData.customer_profile = await customerProfile
    propertyArray.push(propertyData)

  }
  console.log("propertyIdArray", propertyArray);
  res.render('service-provider/myproperties', {
    err_msg, success_msg, layout: false,
    session: req.session,
    propertyData: propertyArray,

  })
});

app.get('/service-provider/myproperties-detail', isServiceProvider, async function (req, res) {


  console.log("", req.session);
  //console.log('data===========',data)
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/property-detail', isServiceProvider, function (req, res) {

  console.log("current session is :", req.session);
  console.log("req.query is :", req.query);
  req.session.pagename = 'service-provider/property';
  PropertiesSchema.find({ _id: req.query.id }).then(async (data) => {
    if (data) {
      let customerName = await customerHelper.getCustomerNameByID(data[0].ps_user_id);
      let customerProfile = await customerHelper.getCustomerImageByID(data[0].ps_user_id);

      let arr = [];
      for (let img of data) {
        await PropertiesPictureSchema.find({ pps_property_id: img._id }).then(async (result) => {
          //let temp = await result
          for (let image of result) {
            let temp = await image
            arr.push(temp)
          }

        })
      }
      //console.log("Data Array is ", data);
      //console.log("customerName ...", customerName)
      // console.log("customerProfile is ......", customerProfile);
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.render('service-provider/property-detail', {
        err_msg, success_msg, layout: false,
        session: req.session,
        propertyDetailData: data,
        propertyImage: arr,
        customerName: customerName,
        customerProfile: customerProfile
      });

      //console.log(serviceProvArray)
    }
  }).catch((err) => {
    console.log(err)
  })


})




//   err_msg = req.flash('err_msg');
//   success_msg = req.flash('success_msg');
//   res.render('service-provider/property-detail', {
//     err_msg, success_msg, layout: false,
//     session: req.session
//   });
// });


app.get('/service-provider/professionals-detail-message', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/complaints-professional-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/complaints-professional-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/complaints-professional', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/complaints-professional', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/service-provider/complaints-professional-detail', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/complaints-professional-detail';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('service-provider/complaints-professional-detail', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/service-provider/professionals-detail-message', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  req.session.pagename = 'service-provider/property';
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('/service-provider/professionals-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/property-detail-submit-proposal', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/property-detail-submit-proposal', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});
app.get('/signup-professionals-profile-4', isServiceProvider, async (req, res) => {
  var service_provider_id = req.session.user_id;
  var all_employe_history = await signUpHelper.getAllEmployeHistory(service_provider_id);
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  req.session.pagename = 'signup-professionals-profile-4';
  res.render('signup-professionals-profile-4', {
    err_msg, success_msg, layout: false,
    session: req.session,
    moment: moment,
    all_employe_history: all_employe_history
  });
});

app.get('/service-provider/myproperties-detail-phaseA', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/myproperties-detail-phaseA', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});

app.get('/service-provider/professional-detail-message', isServiceProvider, function (req, res) {
  console.log("current session is :", req.session);
  err_msg = req.flash('err_msg');
  req.session.pagename = 'service-provider/property';
  success_msg = req.flash('success_msg');
  res.render('service-provider/professional-detail-message', {
    err_msg, success_msg, layout: false,
    session: req.session
  });
});


app.get('/getPersonaldetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderPersonalDetailsSchema.find({ spods_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for personal data is :', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        personalDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});


app.get('/getOtherProfile', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderOtherDetailsSchema.find({ spods_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for other data is :', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        otherDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getEducationdetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderEducationSchema.find({ spes_service_provider_id: req.query.user_id }).sort({ _id: -1 }).then(async (data) => {
    console.log('server response for education data is : ', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        educationDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getEmploymenthistorydetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderEmploymentHistorySchema.find({ spehs_service_provider_id: req.query.user_id }).sort({ _id: -1 }).then(async (data) => {
    console.log('server response for employment history data is : ', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        employmentDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getReferencedetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderReferenceSchema.find({ rs_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for Refernce data is:', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        referenceData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getIdentimitydetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderIndemnityDetailsSchema.find({ spods_service_provider_id: req.query.user_id }).then(async (data) => {
    console.log('server response for Identimity-details data is : ', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        IdemnityDetailsData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});

app.get('/getLanguagedetails', isServiceProvider, async function (req, res) {
  console.log('req.query:', req.query)
  await ServiceProviderLanguageSchema.find({ spls_service_provider_id: req.query.user_id }).sort({ _id: -1 }).then(async (data) => {
    console.log('server response for Language data is:', data)
    if (data) {
      err_msg = req.flash('err_msg');
      success_msg = req.flash('success_msg');
      res.send({
        err_msg, success_msg, layout: false,
        session: req.session,
        languageData: data,
      });
    }
  }).catch((err) => {
    console.log(err)
  })
});


module.exports = app;

