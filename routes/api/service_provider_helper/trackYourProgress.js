const PropertiesSchema = require("../../../models/properties");
const PropertyProfessionalSchema = require("../../../models/property_professional_Schema");
const customerHelper = require('./customerHelper.js');
module.exports.getAllPropertyByUserId = function (user_id) {
    return new Promise(async function (resolve, reject) {
        if (user_id != null) {
            data = {
                pps_service_provider_id: user_id
            }

            await PropertyProfessionalSchema.find(data).sort({ _id: -1 }).then(async (resp) => {
                if (resp) {
                    var dataarray = [];
                    for (var k of resp) {
                        await PropertiesSchema.findOne({ _id: k.pps_property_id }).then(async (responce) => {
                            if (responce) {
                                let customerImage = await customerHelper.getCustomerImageByID(k.pps_user_id)
                                let customerName = await customerHelper.getCustomerNameByID(k.pps_user_id);
                                var object_as_string = JSON.stringify(responce);
                                const t = JSON.parse(object_as_string);
                                t.user_image = customerImage
                                t.user_name = customerName
                                let temps = await t
                                let tempsData = await temps
                                dataarray.push(temps)

                            }
                        })

                    }

                    resolve(dataarray)
                }

            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};
module.exports.getAllPropertyByUserId1 = function (user_id,start,limit) {
    return new Promise(async function (resolve, reject) {
        if (user_id != null) {
            data = {
                pps_service_provider_id: user_id
            }
           await PropertyProfessionalSchema.find(data).sort({ _id: -1 }).limit(parseInt(limit)).then(async (resp) => {
                if(resp){

                    var dataarray=[];
                    for(var k of resp){
                        await PropertiesSchema.findOne({_id:k.pps_property_id}).then(async(responce)=>{
                            if(responce){
                                let customerImage = await customerHelper.getCustomerImageByID(k.pps_user_id)
                                var object_as_string = JSON.stringify(responce);
                                const t = JSON.parse(object_as_string);
                                t.user_image =customerImage
                                let temps = await t
                                let tempsData = await temps
                                dataarray.push(temps)
                              
                            }
                        })

                    }

                    resolve(dataarray)
                }
                
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};