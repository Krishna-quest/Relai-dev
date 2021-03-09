const PropertyProfessionalSchema= require('../../../models/property_professional_Schema');
module.exports.getHiredPropertyProfessional = function (pps_service_provider_id) {
    return new Promise(async function (resolve, reject) {
        if (pps_service_provider_id != null) {
           let data=await PropertyProfessionalSchema.find({pps_service_provider_id:pps_service_provider_id})
                if(data){
                    var object_as_string = JSON.stringify(data);
                    const propertyProfessional = JSON.parse(object_as_string);
                   
                    resolve(propertyProfessional)
                }else{
                    reject({status:0,'message':'data not found'})
                }
           
        } else {
            reject({status:0,'message':'data not found'})
        }
    }).catch((error) => { });
};
