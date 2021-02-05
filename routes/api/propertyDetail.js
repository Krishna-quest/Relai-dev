
const PropertiesSchema = require("../../models/properties");
var fs = require('fs');
const path = require('path');
const PropertiesPictureSchema = require("../../models/properties_picture");
const PropertiesPlanPictureSchema = require("../../models/properties_plan_picture");
module.exports.GetPropertById = function (propertyId) {
    return new Promise(async function (resolve, reject) {
        //console.log('hello',pps_property_id,pps_is_active_user_flag)
        var data = { _id: propertyId }
        await PropertiesSchema.findOne(data).then(async (resp) => {
            let responce = await resp
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};
module.exports.AddNewProperty = function (req) {
    return new Promise(async function (resolve, reject) {
        //console.log('hello=============', req);
        var PropertyBoject = {
            ps_unique_code: "prop-" + Math.random().toString(36).slice(-6),
            ps_user_id: req.session.user_id, //storing customer_ID
            ps_property_name: req.body.ps_property_name,
            ps_property_address: req.body.ps_property_address,
            ps_property_country_id: req.body.ps_property_country_id,
            ps_property_state_id: req.body.ps_property_state_id,
            ps_property_city_id: req.body.ps_property_city_id,
            ps_property_zipcode: req.body.ps_property_zipcode,
            //ps_property_user_as: req.body.ps_property_user_as,
            ps_property_user_as: req.session.active_user_login, //updaing active customer portal buyer/seller/renovator
            ps_other_party_fullname: req.body.ps_other_party_fullname,
            ps_other_party_emailid: req.body.ps_other_party_emailid,
            ps_other_party_invited: req.body.ps_other_party_invited,
            ps_property_area: req.body.ps_property_area,
            ps_property_bedroom: req.body.ps_property_bedroom,
            ps_property_bathroom: req.body.ps_property_bathroom,
            ps_additional_note: req.body.ps_additional_note,
            ps_property_type: req.body.ps_property_type,
            ps_chain_property_id: req.body.ps_chain_property_id,
            ps_is_active_user_flag: req.session.active_user_login
        };
        const newProperty = new PropertiesSchema(PropertyBoject)
        //return;
        // var data={_id:propertyId}
        await newProperty.save().then(async (property) => {
            //----------------------------------------
            if (property) {
                await req.files.propertiespic.forEach(element => {
                    var obj = {
                        pps_property_id: property._id,
                        pps_property_image_name: element.filename,
                        pps_is_active_user_flag: req.session.active_user_login,
                        pps_property_image: {
                            data: fs.readFileSync(path.join(__dirname + '../../../public/propimg/' + element.filename)),
                            contentType: 'image/png'
                        }
                    }

                    PropertiesPictureSchema.create(obj, (err, item) => {
                        if (err) {
                            console.log(err);
                            req.flash('err_msg', "Something went worng please try after some time");
                            // res.redirect('/add-property');
                        }
                        else {
                            item.save();
                            console.log("file Submitted Successfully");
                            req.flash('success_msg', "Properties picture Uploaded Successfully");
                            //res.redirect('/add-property');
                        }
                    });
                });
                await req.files.propertiesplanpic.forEach(e => {
                    var obj = {
                        ppps_property_id: property._id,
                        ppps_plan_image_name: e.filename,
                        ppps_is_active_user_flag: req.session.active_user_login,
                        ppps_plan_image: {
                            data: fs.readFileSync(path.join(__dirname + '../../../public/propplanimg/' + e.filename)),
                            contentType: 'image/png'
                        }
                    }

                    PropertiesPlanPictureSchema.create(obj, (err, item) => {
                        if (err) {
                            console.log(err);
                            req.flash('err_msg', "Something went worng please try after some time");
                            //res.redirect('/add-property');
                        }
                        else {
                            item.save();
                            console.log("file Submitted Successfully");
                            req.flash('success_msg', "Properties picture Uploaded Successfully");
                            // res.redirect('/add-property');

                        }
                    });

                });
                let responce = await property
                resolve(responce)
            }
            //----------------------------------------
            
        }).catch((err) => {
            reject(err)
        })
    });
};