
const CustomerSchema= require('../../../models/customers');
module.exports.getCustomerByID = function (user_id) {
    return new Promise(async function (resolve, reject) {
        if (user_id != null) {
           let userdata=await CustomerSchema.findOne({_id:user_id})
                if(userdata){
                    var object_as_string = JSON.stringify(userdata);
                    const t = JSON.parse(object_as_string);
                    //console.log("userdatauserdatauserdatauserdata",userdata.cus_profile_image_name)
                    resolve(t.cus_profile_image_name)
                }else{
                    reject({status:0,'message':'user not found'})
                }
           
        } else {
            reject({status:0,'message':'user not found'})
        }
    }).catch((error) => { });
};
module.exports.getCustomerImageByID = function (user_id) {
    return new Promise(async function (resolve, reject) {
        if (user_id != null) {
           let userdata=await CustomerSchema.findOne({_id:user_id})
                if(userdata){
                    var object_as_string = JSON.stringify(userdata);
                    const t = JSON.parse(object_as_string);
                    //console.log("userdatauserdatauserdatauserdata",userdata.cus_profile_image_name)
                    resolve(t.cus_profile_image_name)
                }else{
                    reject({status:0,'message':'user not found'})
                }
           
        } else {
            reject({status:0,'message':'user not found'})
        }
    }).catch((error) => { });
};

module.exports.getCustomerNameByID = function (user_id) {
    return new Promise(async function (resolve, reject) {
        if (user_id != null) {
           let userdata=await CustomerSchema.findOne({_id:user_id})
                if(userdata){
                    var object_as_string = JSON.stringify(userdata);
                    const t = JSON.parse(object_as_string);
                   // console.log("userdatauserdatauserdatauserdata",userdata.cus_fullname)
                    resolve(t.cus_fullname)
                }else{
                    reject({status:0,'message':'customer name not found'})
                }
           
        } else {
            reject({status:0,'message':'customer name not found'})
        }
    }).catch((error) => { });
};