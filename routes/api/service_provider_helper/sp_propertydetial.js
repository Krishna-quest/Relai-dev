const PropertiesSchema = require("../../../models/properties");
const PropertiesPictureSchema = require("../../../models/properties_picture");
module.exports.getPropertyByID = function (property_id) {
    return new Promise(async function (resolve, reject) {
        if (property_id != null) {
           let data=await PropertiesSchema.findOne({_id:property_id}).sort({ _id: -1 })
                if(data){
                    var object_as_string = JSON.stringify(data);
                    const propertyObject = JSON.parse(object_as_string);
                   
                    resolve(propertyObject)
                }else{
                    reject({status:0,'message':'property not found'})
                }
           
        } else {
            reject({status:0,'message':'property not found'})
        }
    }).catch((error) => { });
};
module.exports.getPropertyImageByID = function (property_id) {
    return new Promise(async function (resolve, reject) {
        if (property_id != null) {
           let data=await PropertiesPictureSchema.findOne({pps_property_id:property_id})
                if(data){
                    var object_as_string = JSON.stringify(data);
                    const propertyObject = JSON.parse(object_as_string);
                   
                    resolve(propertyObject)
                }else{
                    reject({status:0,'message':'property image not found'})
                }
           
        } else {
            reject({status:0,'message':'property image not found'})
        }
    }).catch((error) => { });
};