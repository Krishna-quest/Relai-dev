const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const ejs = require('ejs');
const app = express();
const { v4: uuidv4 } = require('uuid');
var Jimp = require('jimp');
var fs = require('fs');
var base64ToImage = require('base64-to-image');
var multer = require('multer');
const ServiceProviderPortfolioSchema = require("../models/service_provider_portfolio");

const CustomerKycSchema = require("../models/customer_kyc");

const PropertiesPictureSchema = require("../models/properties_picture");

const PropertiesPlanPictureSchema = require("../models/properties_plan_picture");
const CustomerUploadDocsSchema = require("../models/customer_upload_document");
const ComplaintsSchema = require("../models/Complaints");
const ComplaintsDetailsSchema = require("../models/complaint_details_model");
const RatingSchema = require("../models/service_provider_rating_Schema");
const CustomerSchema = require("../models/customers");
const DateTime = require('node-datetime/src/datetime');
const TaskUploadDocsSchema = require("../models/task_upload_document");
//** Upload Document Start */

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log('file==', file)
    if (file.fieldname === 'complaint_file') {
      callback(null, "./public/complaintFile");
    } else if (file.fieldname === 'portfolio-docs') {
      callback(null, "./public/portfolioImage");
    }else if(file.fieldname === 'task-document'){
      callback(null, "./public/taskdocument");
    } else {
      callback(null, "./public/upload");
    }

  },
  filename: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    console.log("ext", ext)
    var datetimestamp = Date.now();
    const Filename = file.originalname
    const FilenameCleaned = Filename.replace(/\s/g, '')
    callback(null, FilenameCleaned.split('.').join('-' + Date.now() + '.'));
  }
});
var maxSize = 1000000 * 1000;
var upload = multer({
  storage: Storage,
  limits: {
    fileSize: maxSize
  }
});


// Retriving the image
// app.get('/upload', (req, res) => {
//   ServiceProviderPortfolioSchema.find({}, (err, items) => {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       res.render('app', { items: items });
//     }
//   });
// });

app.post('/upload-profile-pic', upload.single('profile-pic'), (req, res, next) => {
  console.log("updating user profile with incoming request :", req.body);

  var user_id = req.session.user_id;
  var obj = {
    cus_profile_image_name: req.file.filename,
    cus_profile_image: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  console.log("object is :", obj.cus_profile_image_name);
  CustomerSchema.findByIdAndUpdate({ _id: user_id }, { $set: { cus_profile_image_name: obj.cus_profile_image_name, cus_profile_image: obj.cus_profile_image, cus_updated_at: Date.now() } },
    async function (err, customers) {
      if (err) {
        console.log("Something went wrong")
      }
      else {
        console.log('myyyyyyyyyyyyyyyyyyyyyy:', obj.cus_profile_image_name);
        console.log('ffffffffffffffff:', req.session.user_id);


        await ComplaintsDetailsSchema.updateMany({ comsd_user_profile_img: obj.cus_profile_image_name }).where({ comsd_user_id: req.session.user_id }).then(async (comres) => {
          console.log('comrescomres:', comres)
          await RatingSchema.updateMany({ sprs_submitted_profile_img: obj.cus_profile_image_name }).where({ sprs_submitted_by: req.session.user_id }).then(async (ratingres) => {

            console.log('ratingres:', ratingres)
          });

        })

        // ComplaintsDetailsSchema.updateOne({comsd_user_id: req.session.user_id}, { $set: { comsd_user_profile_img: obj.cus_profile_image_name } });
        // console.log("file submitting successfully : ", profile);

        //TODO: Want to update session after editprofile
        req.session.imagename = obj.cus_profile_image_name
        // req.session._id = doc.user_id;
        // req.session.user_id = customers._id;
        // req.session.name = customers.cus_fullname;
        // req.session.email = customers.cus_email_id;
        // //req.session.is_user_logged_in = true;
        // // req.session.active_user_login = "buyer";
        // req.session.address = customers.cus_address;
        // req.session.city = customers.cus_city;
        // req.session.phoneNumber = customers.cus_phone_number;
        // req.session.country = customers.cus_country_id;
        //req.session.profilePicture= customer.profile_picture
        //req.flash('success_msg', 'Profile updated successfully.');
        //req.session.isChanged();
        console.log("req session is :", req.session);
        res.redirect('/dashboard')


      }
    });
});



var signup_helper = require('./api/service_provider_helper/signup_helper')

// Uploading the image
app.post('/upload', upload.array('portfolio-docs', 10), async (req, res, next) => {

  var responce = await signup_helper.savePortpofolio(req);
  console.log("responce", responce)
  if (responce) {
    return res.send({
      'status': true,
      'message': 'Portfolio-docs Uploaded Successfully',


    })
  } else {
    return res.send({
      'status': false,
      'message': 'Something Wrong !!',


    })
  }
});




// Uploading the image
app.post('/upload-kyc-docs', upload.single('kyc-docs'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);
  console.log("req.session.id is", req.session.user_id);
  var obj = {
    cks_document_name: req.file.filename,
    cks_document_file: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  CustomerKycSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "KYC-docs Uploaded Successfully");
      res.redirect('/kyc-professional');
    }
  });
});

// Uploading the image
app.post('/upload-properties-pic', upload.single('properties-pic'), (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  console.log("req is :", req.file);
  var obj = {
    pps_property_image_name: req.file.filename,
    pps_property_image: {
      data: fs.readFileSync(path.join(__dirname + '../../public/upload/' + req.file.filename)),
      contentType: 'image/png'
    }
  }

  PropertiesPictureSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try after some time");
      res.redirect('/add-property');
    }
    else {
      item.save();
      console.log("file Submitted Successfully");
      req.flash('success_msg', "Properties picture Uploaded Successfully");
      res.redirect('/add-property');
    }
  });
});

// Uploading the image
app.post('/upload-new-document', upload.single('task-document'), async (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  var obj = {};
  //console.log("req is :", req.file);
  console.log("body of document=", req.body);
  //add conditions for type of file and set the type of file
  //console.log(".........files.......", req.file.filename)
  var ext = path.extname(req.file.filename);
  //console.log('extextext:', ext)
  var basename = path.basename(req.file.filename, ext);
  //console.log('basename:', basename)
  let ext_type = '';

  if (ext == ".mp4" || ext == ".wmv") {
    ext_type = 'video';
  } else if (ext == ".pdf") {
    ext_type = 'pdf';
  } else if (ext == ".docx") {
    ext_type = 'doc';
  } else if (ext == ".txt") {
    ext_type = 'txt';
  } else {
    ext_type = 'image';
  }
  //let ext_type = (ext == ".mp4") ? "video" : "image";
  console.log('Sizetest:', req.file.size);
  let size = req.file.size / 1024;
  let docs_size = "";
  let docs_size_valid_mb = "";
  let docs_size_valid_kb = "";
  if (size > 1024) {
    size = size / 1024;
    docs_size = size.toFixed(1) + " MB";
    docs_size_valid_mb = size;
  } else {
    docs_size = size.toFixed(1) + " KB"
    docs_size_valid_kb = size;
  }
  //console.log('docs_size:', docs_size);
  //console.log('docs_size sizweeee:', parseInt(size));
  //console.log('docs_size_valid_mb:', parseInt(docs_size_valid_mb));
  //console.log('docs_size_valid_kb:', parseInt(docs_size_valid_kb));
  if (docs_size_valid_mb <= parseInt(10) || docs_size_valid_mb == 'NaN') {
    if (ext_type == 'image') {
      var baseExt = ext.replace(/\./g, "");
      var w_text = new Date().toUTCString()
      var file_hash = path.join(__dirname + '../../public/taskdocument/' + req.file.filename);
      var icon_images = path.join(__dirname + '../../public/images/logo-2.png');
      let icon_image = await Jimp.read(icon_images)
      await Jimp.read(file_hash, async function (err, image) {
        if (err) {
          console.log("jimp error", err);
          res.send(err)
        }

        await icon_image.resize(80, 30);
        await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE, async function (err, font) {
          if (err) {
            console.log("jimp3 error", err);
            res.send(err)
          }
          image.composite(icon_image, (image.bitmap.width - 90), (image.bitmap.height - 45), {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.9
          });
          image.print(font, (image.bitmap.width - 110), (image.bitmap.height - 10), w_text)
          // nova_new.composite(image, 0, 0);
          var d = await image.getBase64Async(Jimp.MIME_PNG)
          var base64Str = d;
          var path = __dirname + '../../public/taskdocument/';
          var optionalObj = { 'fileName': basename, 'type': baseExt };
          base64ToImage(base64Str, path, optionalObj);

          console.log("file extension is", { ext_type, ext })
          
          if(req.body.tuds_task_id){
            console.log('A')
            obj={
            cuds_phase_flag:req.body.cuds_phase_flag,
            cuds_task_id:req.body.tuds_task_id,
            cuds_phase_name: req.body.tuds_phase_name,
            cuds_task_name: req.body.tuds_task_name,
            cuds_service_provider_id:req.body.tuds_service_provider_id,
            cuds_property_id: req.body.property_id,
              cuds_document_name: req.file.filename,
              cuds_customer_id: req.session.user_id,
              cuds_is_active_user_flag: req.session.active_user_login,
              cuds_document_type: ext_type,
              cuds_document_size: docs_size,
              cuds_document_file: {
                data: d,
                contentType: ext
              }
            }
            
          }else{
            console.log('B')
            obj = {
              cuds_property_id: req.body.property_id,
              cuds_document_name: req.file.filename,
              cuds_customer_id: req.session.user_id,
              cuds_is_active_user_flag: req.session.active_user_login,
              cuds_document_type: ext_type,
              cuds_document_size: docs_size,
              cuds_document_file: {
                data: d,
                contentType: ext
              }
            }
          }
          //console.log('obj==============',obj)
         

          CustomerUploadDocsSchema.create(obj, (err, item) => {
            if (err) {
              console.log(err); console.log(err);
              req.flash('err_msg', "Something went worng please try after some time");
              res.send({
                'status': false,
                'message': 'Something Wrong',
                'redirect': '/mydreamhome-details-docs'
              })
              // res.redirect('/mydreamhome-details-docs');
            }
            else {
              item.save();
              console.log("file Submitted Successfully");
              req.flash('success_msg', "Document Uploaded Successfully.");
              res.send({
                'status': true,
                'message': 'Document Upload Successfully',
                'redirect': '/mydreamhome-details-docs'
              })
              //res.redirect('/mydreamhome-details-docs');
            }
          });

        })

      });
    } else {
      if(req.body.tuds_task_id){
        obj={
        cuds_phase_flag:req.body.cuds_phase_flag,
        cuds_task_id:req.body.tuds_task_id,
        cuds_phase_name: req.body.tuds_phase_name,
        cuds_task_name: req.body.tuds_task_name,
        cuds_service_provider_id:req.body.tuds_service_provider_id,  
        cuds_property_id: req.body.property_id,
        cuds_document_name: req.file.filename,
        cuds_customer_id: req.session.user_id,
        cuds_is_active_user_flag: req.session.active_user_login,
        cuds_document_type: ext_type,
        cuds_document_size: docs_size,
        cuds_document_file: {
          data: '',
          contentType: ext
        }
        }
      }else{
        obj = {
          cuds_property_id: req.body.property_id,
          cuds_document_name: req.file.filename,
          cuds_customer_id: req.session.user_id,
          cuds_is_active_user_flag: req.session.active_user_login,
          cuds_document_type: ext_type,
          cuds_document_size: docs_size,
          cuds_document_file: {
            data: '',
            contentType: ext
          }
        }
      }
      
      

      CustomerUploadDocsSchema.create(obj, (err, item) => {
        if (err) {
          console.log(err); console.log(err);
          req.flash('err_msg', "Something went worng please try after some time");
          //res.redirect('/mydreamhome-details-docs');
          res.send({
            'status': false,
            'message': 'Something Wrong',
            'redirect': '/mydreamhome-details-docs'
          })
        }
        else {
          item.save();
          console.log("file Submitted Successfully");
          //res.redirect('/mydreamhome-details-docs');
          res.send({
            'status': true,
            'message': 'Document Upload Successfully',
            'redirect': '/mydreamhome-details-docs'
          })

        }
      });


    }
  } else {
    console.log('File size not supported')
    res.send({
      'status': false,
      'message': 'Please upload file less than 10MB',
      'redirect': '/mydreamhome-details-docs'
    })
  }
});
app.post('/raise-a-complaint', upload.single('complaint_file'), (req, res, next) => {
  console.log('complaint data:', req.body)
  console.log('complaint data:', req.file)
  var obj = {
    //should be mongodb generated id
    //coms_id :
    coms_complaint_for: req.body.coms_complaint_for,//service provider id
    coms_complaint_code: "C" + uuidv4(),//need to generate in  like C123 auto increment feature
    coms_property_id: req.body.property_id,
    coms_user_id: req.body.cust_user_id,
    //coms_complaint_by: 'customer' //need to check if complaints filed via customer portal or service_provider portal
    coms_complaint_subject: req.body.coms_complaint_subject,
    coms_complaint_note: req.body.coms_complaint_note,
    //coms_complaint_file: req.body.coms_complaint_file,
    coms_complaint_filename: req.file.filename,
    coms_is_active_user_flag: req.session.active_user_login,
    coms_complaint_file: {
      data: fs.readFileSync(path.join(__dirname + '../../public/complaintFile/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  ComplaintsSchema.create(obj, (err, item) => {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Something went worng please try aftersome time");
      res.redirect('/');
    }
    else {
      item.save();
      req.session.property_id = req.body.property_id;
      console.log("complaint Submitted Successfully");
      req.flash('success_msg', "complaint submitted Successfully");
      //res.redirect('/mydreamhome');
      res.json({ 'message': 'success' })
    }
  });


})
// Uploading the image task-document
app.post('/upload-task-document', upload.single('task-document'), async (req, res, next) => {
  var err_msg = null;
  var success_msg = null;
  var obj = {};
  console.log("req is :", req.file);
  console.log('req body:',req.body)
  console.log("in upload Task id=", req.body.tuds_task_id);

  console.log("in upload property id=", req.body.property_id);
    
  //add conditions for type of file and set the type of file
  console.log(".........files.......", req.file.filename)
  var ext = path.extname(req.file.filename);
  console.log('extextext:', ext)
  var basename = path.basename(req.file.filename, ext);
  //console.log('basename:', basename)
  let ext_type = '';

  if (ext == ".mp4" || ext == ".wmv") {
    ext_type = 'video';
  } else if (ext == ".pdf") {
    ext_type = 'pdf';
  } else if (ext == ".docx") {
    ext_type = 'doc';
  } else if (ext == ".txt") {
    ext_type = 'txt';
  } else {
    ext_type = 'image';
  }
  //let ext_type = (ext == ".mp4") ? "video" : "image";
  console.log('Sizetest:', req.file.size);
  let size = req.file.size / 1024;
  let docs_size = "";
  let docs_size_valid_mb = "";
  let docs_size_valid_kb = "";
  if (size > 1024) {
    size = size / 1024;
    docs_size = size.toFixed(1) + " MB";
    docs_size_valid_mb = size;
  } else {
    docs_size = size.toFixed(1) + " KB"
    docs_size_valid_kb = size;
  }
  console.log('docs_size:', docs_size);
  console.log('docs_size sizweeee:', parseInt(size));
  console.log('docs_size_valid_mb:', parseInt(docs_size_valid_mb));
  console.log('docs_size_valid_kb:', parseInt(docs_size_valid_kb));
  if (docs_size_valid_mb <= parseInt(10) || docs_size_valid_mb == 'NaN') {
    if (ext_type == 'image') {
      var baseExt = ext.replace(/\./g, "");
      var w_text = new Date().toUTCString()
      var file_hash = path.join(__dirname + '../../public/taskdocument/' + req.file.filename);
      var icon_images = path.join(__dirname + '../../public/images/logo-2.png');
      let icon_image = await Jimp.read(icon_images)
      await Jimp.read(file_hash, async function (err, image) {
        if (err) {
          console.log("jimp error", err);
          res.send(err)
        }

        await icon_image.resize(80, 30);
        await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE, async function (err, font) {
          if (err) {
            console.log("jimp3 error", err);
            res.send(err)
          }
          image.composite(icon_image, (image.bitmap.width - 90), (image.bitmap.height - 45), {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.9
          });
          image.print(font, (image.bitmap.width - 110), (image.bitmap.height - 10), w_text)
          // nova_new.composite(image, 0, 0);
          var d = await image.getBase64Async(Jimp.MIME_PNG)
          var base64Str = d;
          var path = __dirname + '../../public/taskdocument/';
          var optionalObj = { 'fileName': basename, 'type': baseExt };
          base64ToImage(base64Str, path, optionalObj);

          console.log("file extension is", { ext_type, ext })
          obj = {
            tuds_phase_name: req.body.tuds_phase_name,
            tuds_task_name: req.body.tuds_task_name,
            tuds_task_id: req.body.tuds_task_id,
            tuds_service_provider_id: req.body.tuds_service_provider_id,

            tuds_property_id: req.body.property_id,
            tuds_document_name: req.file.filename,
            tuds_customer_id: req.session.user_id,
            tuds_is_active_user_flag: req.session.active_user_login,
            tuds_document_type: ext_type,
            tuds_document_size: docs_size,
            tuds_document_file: {
              data: d,
              contentType: ext
            }
          }
          
          TaskUploadDocsSchema.create(obj, (err, item) => {
            if (err) {
              console.log(err); console.log(err);
              req.flash('err_msg', "Something went worng please try after some time");
              res.send({
                'status': false,
                'message': 'Something Wrong',
                //'redirect': '/task-details-docs'
              })
              // res.redirect('/mydreamhome-details-docs');
            }
            else {
              item.save();
              console.log("file Submitted Successfully");
              req.flash('success_msg', "Document Uploaded Successfully.");
              res.send({
                'status': true,
                'message': 'Document Upload Successfully',
                //'redirect': '/task-details-docs'
              })
              //res.redirect('/mydreamhome-details-docs');
            }
          });

        })

      });
    } else {

      obj = {
        tuds_phase_name: req.body.tuds_phase_name,
        tuds_task_name: req.body.tuds_task_name,
        tuds_task_id: req.body.tuds_task_id,
        tuds_service_provider_id: req.body.tuds_service_provider_id,

        tuds_property_id: req.body.property_id,
        tuds_document_name: req.file.filename,
        tuds_customer_id: req.session.user_id,
        tuds_is_active_user_flag: req.session.active_user_login,
        tuds_document_type: ext_type,
        tuds_document_size: docs_size,
        tuds_document_file: {
          data: '',
          contentType: ext
        }
      }

      TaskUploadDocsSchema.create(obj, (err, item) => {
        if (err) {
          console.log(err); console.log(err);
          req.flash('err_msg', "Something went worng please try after some time");
          //res.redirect('/mydreamhome-details-docs');
          res.send({
            'status': false,
            'message': 'Something Wrong',
            'redirect': '/task-details-docs'
          })
        }
        else {
          item.save();
          console.log("file Submitted Successfully");
          //res.redirect('/mydreamhome-details-docs');
          res.send({
            'status': true,
            'message': 'Document Upload Successfully',
            'redirect': '/task-details-docs'
          })

        }
      });


    }
  } else {
    console.log('File size not supported')
    res.send({
      'status': false,
      'message': 'Please upload file less than 10MB',
      'redirect': '/task-details-docs'
    })
  }
});

module.exports = app;