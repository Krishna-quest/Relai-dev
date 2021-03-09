const ServiceProviderEmploymentHistorySchema = require("../../../models/service_provider_employment_history");
const ServiceProviderPortfolioSchema = require("../../../models/service_provider_portfolio");
const ServiceProviderReferenceSchema = require("../../../models/service_provider_reference");
module.exports.getAllEmployeHistory = function (service_provider_id) {
    return new Promise(async function (resolve, reject) {
        if (service_provider_id != null) {
            data = {
                spehs_service_provider_id: service_provider_id
            }
            ServiceProviderEmploymentHistorySchema.find(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};

module.exports.savePortpofolio = function (req) {
    return new Promise(async function (resolve, reject) {
        if (req.files.length != 0) {
            let ext_type = '';
            var ext = ''
            await req.files.forEach(async element => {
                ext = element.mimetype
                console.log(ext)
               
                if (ext == "video/mp4") {
                    ext_type = 'video';
                } else if(ext=='image/jpeg'||ext=='image/png'){

                    ext_type = 'image';
                }
                if(ext_type=='image'||ext_type=='video'){
                var obj = {
                    spps_filename: element.filename,
                    spps_service_provider_id: req.session.user_id,
                    spps_type: ext_type,
                    // spps_file: {
                    //   data: fs.readFileSync(path.join(__dirname + '../../public/portfolioImage/' + element.filename)),
                    //   contentType: 'image/png'
                    // }
                }
                ServiceProviderPortfolioSchema.create(obj, async (err, item) => {
                    if (err) {
                        console.log(err);
                        reject({ status: false })
                    }
                    else {
                        var resp = await item.save()
                        resolve(true)


                    }

                });
            }else{
                reject(false)
            }


            })



        } else {
            reject(false)
        }

    }).catch((error) => { console.log(error) });
};

module.exports.getReferenceDetailById = function (id) {
    return new Promise(async function (resolve, reject) {
        if (id != null) {
            data = {
                rs_service_provider_id: id
            }
            ServiceProviderReferenceSchema.findOne(data).sort({ _id: -1 }).then(async (resp) => {
                let responce = await resp
                resolve(responce)
            }).catch((err) => {
                reject(err)
            })
        } else {
            reject({ status: 0 })
        }
    }).catch((error) => { });
};