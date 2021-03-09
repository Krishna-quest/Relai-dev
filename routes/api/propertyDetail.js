
const PropertiesSchema = require("../../models/properties");
var fs = require('fs');
const path = require('path');
const PropertiesPictureSchema = require("../../models/properties_picture");
const PropertiesPlanPictureSchema = require("../../models/properties_plan_picture");
const { where } = require("../../models/properties");

module.exports.EditPropertyById = function (req) {
    return new Promise(async function (resolve, reject) {
        
        var phaseArray = [];
        var chainPropertyIdArray=[];
        for (var i in req.body.Phase) {
            var phaseObj = {
                phase_name: '',
                start_date: '',
                end_date: '',
                phase_status: 'pending',
            };
            phaseObj.phase_name = req.body.Phase[i];
            phaseObj.start_date = req.body.startDate[i];
            phaseObj.end_date = req.body.endDate[i];
            phaseArray.push(phaseObj);
        }
        
        var editPropObj = {
            ps_property_name: req.body.ps_property_name,
            ps_property_address: req.body.ps_property_address,
            ps_property_country_id: req.body.country,
            ps_property_state_id: req.body.state,
            ps_property_city_id: req.body.city,
            ps_property_zipcode: req.body.ps_property_zipcode,
            ps_property_user_as: req.session.active_user_login, //updaing active customer portal buyer/seller/renovator
            ps_other_party_fullname: req.body.ps_other_party_fullname,
            ps_other_party_emailid: req.body.ps_other_party_emailid,
            ps_other_party_invited: req.body.ps_other_party_invited,
            ps_property_area: req.body.ps_property_area,
            ps_property_bedroom: req.body.ps_property_bedroom,
            ps_property_bathroom: req.body.ps_property_bathroom,
            ps_additional_note: req.body.ps_additional_note,
            ps_property_type: req.body.property_type,
            ps_is_active_user_flag: req.session.active_user_login,
            ps_phase_array: phaseArray,
            ps_existing_property:req.body.ps_existing_property,
            ps_chain_property_id:chainPropertyIdArray,
            ps_other_property_type:req.body.ps_other_property_type
            
        };
        if(req.body.property_type=='Chain'){
            

            chainPropertyIdArray.push(req.body.ps_chain_property)
        }
        await PropertiesSchema.updateOne(editPropObj).where({_id:req.body.editPropertyId}).then(async(resp)=>{
            if(resp){
                let responce =await resp
                resolve(responce)
            }
        }).catch((err) => {
            reject(err)
        })
    
    });
};

module.exports.EditPropertyImageById = function (req) {
    return new Promise(async function (resolve, reject) {
        await req.files.propertiespic.forEach(function(element,i){
            var obj = {
               
                pps_property_id: req.body.property_id,
                pps_property_image_name: element.filename,
                pps_is_active_user_flag: req.session.active_user_login,
                
            }
            
            PropertiesPictureSchema.updateOne(obj).where({_id:req.body.image_id}).then(async(resp)=>{
                if(resp){
                    //console.log("success image =========",resp)
                    let responce =await resp
                    resolve(responce)
                }
            }).catch((err) => {
                reject(err)
            })
           
            
               
            
        });
       
    });
};
module.exports.EditPropertyPlanImageById = function (req) {
    return new Promise(async function (resolve, reject) {
        await req.files.planImage.forEach(function(element,i){
            var obj = {
               
                ppps_property_id: req.body.property_id,
                ppps_plan_image_name: element.filename,
                ppps_is_active_user_flag: req.session.active_user_login,
                
            }
           
          
            
            PropertiesPlanPictureSchema.updateOne(obj).where({_id:req.body.image_id}).then(async(resp)=>{
                if(resp){
                    let responce =await resp
                    resolve(responce)
                }
            }).catch((err) => {
                reject(err)
            })
          
           
            
               
            
        });
       
    });
};
module.exports.GetPropertImageById = function (propertyId, pps_is_active_user_flag) {
    return new Promise(async function (resolve, reject) {
        
        var data = { $and: [{ pps_is_active_user_flag: pps_is_active_user_flag, pps_property_id: propertyId }] }
        await PropertiesPictureSchema.find(data).then(async (resp) => {
            let responce = await resp
            // console.log(" propery image responce",responce)
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};
module.exports.GetPropertPlanImageById = function (propertyId, ppps_is_active_user_flag) {
    return new Promise(async function (resolve, reject) {
        
        var data = { $and: [{ ppps_is_active_user_flag: ppps_is_active_user_flag, ppps_property_id: propertyId }] }
        await PropertiesPlanPictureSchema.find(data).then(async (resp) => {
            let responce = await resp
            // console.log("plan image responce",responce)
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};
module.exports.GetPropertById = function (propertyId, ps_is_active_user_flag) {
    return new Promise(async function (resolve, reject) {
        //console.log('hello',pps_property_id,pps_is_active_user_flag)
        //var data = { _id: propertyId }
        var data = { $and: [{
            //ps_is_active_user_flag: ps_is_active_user_flag, _id: propertyId 
             _id: propertyId 
            }] }
        await PropertiesSchema.findOne(data).then(async (resp) => {
            let responce = await resp
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};
module.exports.GetAllProperty = function (user_id, ps_is_active_user_flag) {
    return new Promise(async function (resolve, reject) {
        //console.log('hello',pps_property_id,pps_is_active_user_flag)
        //var data = { _id: propertyId }
        var data = { $and: [{ ps_is_active_user_flag: ps_is_active_user_flag, ps_user_id: user_id }] }
        await PropertiesSchema.find(data).then(async (resp) => {
            let responce = await resp
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};
module.exports.GetAllPropertyInEdit = function (user_id, ps_is_active_user_flag,property_id) {
    return new Promise(async function (resolve, reject) {
      console.log('hello',property_id)
        //var data = { _id: propertyId }
        
        var data = { $and: [{ ps_is_active_user_flag: ps_is_active_user_flag, ps_user_id: user_id,},{_id:{$ne:property_id}}] }
        await PropertiesSchema.find().where(data).then(async (resp) => {
            let responce = await resp
            resolve(responce)
        }).catch((err) => {
            reject(err)
        })
    });
};
module.exports.add_new_property_image = function (req) {
    return new Promise(async function (resolve, reject) {
        await req.files.propertiespic.forEach(element => {
            var obj = {
                pps_property_id: req.body.property_id,
                pps_property_image_name: element.filename,
                pps_is_active_user_flag: req.session.active_user_login,
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
                    item.save().then(async(propertyImageResponce)=>{
                        if(propertyImageResponce){
                            let responce = await propertyImageResponce
                            resolve(responce);
                        }
                    }).catch((err) => {
                        reject(err)
                    });
                }
            });
        });

    });
};
module.exports.add_new_property_plan_image = function (req) {
    return new Promise(async function (resolve, reject) {
        await req.files.planImage.forEach(element => {
            var obj = {
                ppps_property_id: req.body.property_id,
                ppps_plan_image_name: element.filename,
                ppps_is_active_user_flag: req.session.active_user_login,
                // ppps_plan_image: {
                //     data: fs.readFileSync(path.join(__dirname + '../../../public/propplanimg/' + e.filename)),
                //     contentType: 'image/png'
                // }
            }
            PropertiesPlanPictureSchema.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                }
                else {
                    item.save().then(async(propertyPlanImageResponce)=>{
                        if(propertyPlanImageResponce){
                            let responce = await propertyPlanImageResponce
                            resolve(responce);
                        }
                    }).catch((err) => {
                        reject(err)
                    });
                }
            });
        });

    });
};

module.exports.Add_New_Propert = function (req) {
    return new Promise(async function (resolve, reject) {
        var phaseArray = [];
        var chainPropertyIdArray=[];
        var chainPropertyNameArray=[];
        req.body.Phase.forEach(function(row,i){
        //for (var i in req.body.Phase) {
            var phaseObj = {
                phase_name: '',
                start_date: '',
                end_date: '',
                phase_status: 'pending',
            };
            phaseObj.phase_name = req.body.Phase[i];
            phaseObj.start_date = req.body.startDate[i];
            phaseObj.end_date = req.body.endDate[i];
            phaseArray.push(phaseObj);
        //}
        })
        var PropertyBoject = {
            ps_unique_code: "prop-" + Math.random().toString(36).slice(-6),
            ps_user_id: req.session.user_id, //storing customer_ID
            ps_property_name: req.body.ps_property_name,
            ps_property_address: req.body.ps_property_address,
            ps_property_country_id: req.body.country,
            ps_property_state_id: req.body.state,
            ps_property_city_id: req.body.city,
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
            ps_property_type: req.body.property_type,
            ps_is_active_user_flag: req.session.active_user_login,
            ps_phase_array: phaseArray,
            ps_existing_property:req.body.ps_existing_property,
            ps_chain_property_id:chainPropertyIdArray,
            ps_other_property_type:req.body.ps_other_property_type,
            ps_chain_property_name:chainPropertyNameArray
            
        };
        if(req.body.property_type=='Chain'){
            var chain_propnameByid=await PropertiesSchema.findOne({_id:req.body.ps_chain_property});
            chainPropertyNameArray.push(chain_propnameByid.ps_property_name);
            chainPropertyIdArray.push(req.body.ps_chain_property)
        }
        const newProperty = new PropertiesSchema(PropertyBoject)
        await newProperty.save().then(async (property) => {

            if (property) {
                let responce = await property
                resolve(responce);
            }

        }).catch((err) => {
            reject(err)
        })
    });
};























module.exports.AddNewProperty = function (req) {
    return new Promise(async function (resolve, reject) {
        //console.log('hello=============', req);

        var phaseArray = [];
        for (var i in req.body.Phase) {
            var phaseObj = {
                phase_name: '',
                start_date: '',
                end_date: '',
                phase_status: 'pending',
            };
            phaseObj.phase_name = req.body.Phase[i];
            phaseObj.start_date = req.body.startDate[i];
            phaseObj.end_date = req.body.endDate[i];
            phaseArray.push(phaseObj);


            console.log("phaseObj==========================", phaseObj)
        }
        console.log("phaseArray:============", phaseArray);

        var PropertyBoject = {
            ps_unique_code: "prop-" + Math.random().toString(36).slice(-6),
            ps_user_id: req.session.user_id, //storing customer_ID
            ps_property_name: req.body.ps_property_name,
            ps_property_address: req.body.ps_property_address,
            ps_property_country_id: req.body.country,
            ps_property_state_id: req.body.state,
            ps_property_city_id: req.body.city,
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
            ps_property_type: req.body.property_type,
            //ps_chain_property_id: req.body.ps_chain_property_id,
            ps_is_active_user_flag: req.session.active_user_login,
            // ps_phase_array:req.body.Phase,
            // ps_phase_start_date:req.body.startDate,
            // pa_phase_end_date:req.body.endDate
            ps_phase_array: phaseArray
        };
        console.log(req.body.Phase.length)




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