const PropertyProfessinoalTaskSchema = require("../../models/property_professional_tasks_Schema");
const PropertiesPhaseSchema = require("../../models/property_phase_schema");
const PropertiesSchema = require("../../models/properties");
module.exports.GetTaskById = function (ppts_property_id,ppts_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
       if(ppts_property_id!=null){
        var data={
            ppts_property_id: ppts_property_id

           
        }
        PropertyProfessinoalTaskSchema.find(data).then(async(resp)=>{
            console.log('resp:====',resp)
            let responce = await resp
             resolve(responce)
         }).catch((err)=>{
             reject(err)
         })
       }
    });
};

module.exports.GetTaskByPhaseName = function (ppts_property_id,ppts_phase_name,ppts_user_id,ppts_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
      var pps_property_id=ppts_property_id;
       if(ppts_property_id!=null){
        await  PropertiesSchema.findOne({_id:pps_property_id}).then(async(propertyData)=>{
          if('ps_tagged_user_id' in propertyData){
               console.log('here..1');
               console.log('here..gg:',propertyData.ps_tagged_user_id);
               console.log('here..ppts_user_id:+++++++++++++',ppts_user_id);
               if(propertyData.ps_tagged_user_id == ppts_user_id){
                console.log('here..2');
                var data={$and:[{
                  //ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_is_active_user_flag:ppts_is_active_user_flag
                  ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_user_id:ppts_user_id
              }]}
              PropertyProfessinoalTaskSchema.find(data).then(async(resp)=>{
                  console.log('resp:====',resp)
                  let responce = await resp
                  resolve(responce)
              }).catch((err)=>{
                  reject(err)
              })
               
              }else{
                var data={$and:[{
                  //ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_is_active_user_flag:ppts_is_active_user_flag
                  ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_user_id:ppts_user_id
              }]}
              PropertyProfessinoalTaskSchema.find(data).then(async(resp)=>{
                  console.log('resp:====',resp)
                  let responce = await resp
                  resolve(responce)
              }).catch((err)=>{
                  reject(err)
              })
              }

          }
        })
       
        }
    });
};

module.exports.GetGestTaskByPhaseName = function (ppts_property_id, ppts_phase_name, ppts_user_id, ppts_is_active_user_flag) {
  return new Promise(async function (resolve, reject) {
    var pps_property_id = ppts_property_id;
    if (ppts_property_id != null) {
      await PropertiesSchema.findOne({ _id: pps_property_id }).then(async (propertyData) => {
        if ('ps_tagged_user_id' in propertyData) {
          console.log('here..1');
          console.log('here..gg:GetGestTaskByPhaseName', propertyData.ps_tagged_user_id);
          console.log('here..ppts_user_id:', ppts_user_id);
          if(propertyData.ps_tagged_user_id==undefined){
            resolve([])
            // var data = {
            //   $and: [{
            //     //ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_is_active_user_flag:ppts_is_active_user_flag
            //     ppts_property_id: ppts_property_id, ppts_phase_name: ppts_phase_name
            //   }]
            // }
            // PropertyProfessinoalTaskSchema.find(data).then(async (resp) => {
            //   console.log('resp:====', resp)
            //   let responce = await resp
            //   resolve(responce)
            // }).catch((err) => {
            //   reject(err)
            // })
          }else{
          if (propertyData.ps_tagged_user_id == ppts_user_id) {
            //console.log('here..2');
            var data = {
              $and: [{
                //ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_is_active_user_flag:ppts_is_active_user_flag
                ppts_property_id: ppts_property_id, ppts_phase_name: ppts_phase_name, ppts_user_id:propertyData.ps_user_id.toString()
              }]
            }
            PropertyProfessinoalTaskSchema.find(data).then(async (resp) => {
              console.log('resp:====', resp)
              let responce = await resp
              resolve(responce)
            }).catch((err) => {
              reject(err)
            })

          }else{
            var data = {
              $and: [{
                //ppts_property_id: ppts_property_id,ppts_phase_name:ppts_phase_name,ppts_is_active_user_flag:ppts_is_active_user_flag
                ppts_property_id: ppts_property_id, ppts_phase_name: ppts_phase_name, ppts_user_id:propertyData.ps_tagged_user_id.toString()
              }]
            }
            PropertyProfessinoalTaskSchema.find(data).then(async (resp) => {
              console.log('resp:====', resp)
              let responce = await resp
              resolve(responce)
            }).catch((err) => {
              reject(err)
            })
          }
        }
        }
      })

    }
  });
};
module.exports.save_addPhase = function (pps_property_id,pps_phase_name,pps_phase_start_date,pps_phase_end_date,pps_is_active_user_flag) {
    return new Promise( async function (resolve, reject) {
        var data={pps_property_id:pps_property_id,
        //pps_professional_id:pps_professional_id,
        //pps_user_id:req.session.user_id,
        pps_phase_name:pps_phase_name,
        pps_phase_start_date:pps_phase_start_date,
        pps_phase_end_date:pps_phase_end_date,
        pps_is_active_user_flag:pps_is_active_user_flag
    }
    var newdata = new PropertiesPhaseSchema(data);
    newdata.save().then(async(resp)=>{
       let responce = await resp
        resolve(responce)
    }).catch((err)=>{
        reject(err)
    })
    });
};

module.exports.add_existing_task = function (req) {
    return new Promise( async function (resolve, reject) {
        var newTask={};
        console.log('Bodyyy task in table:',req.body)

        if (typeof (req.body.task_element) == 'object') {
                req.body.task_element.forEach(async function(row ,i){
                    PropertyProfessinoalTaskSchema.find(
                        {ppts_property_id: req.body.ppts_property_id,
                          ppts_user_id:{$in:[req.session.user_id]},
                          ppts_task_name:row, 
                          ppts_assign_to:{$in:[req.body.ppts_assign_to]},
                          ppts_phase_name:req.body.ppts_phase_name, 
                           ppts_phase_flag:req.body.ppts_phase_flag
                         }).then(async (data) => {
                          console.log('Already task in table2111:',data)
                        if (!data) {
                            console.log('ifififi consifotiodsf sjs fksdh')
                          
                            // newTask ={
                            // ppts_property_id: req.body.ppts_property_id,
                            // ppts_user_id: req.session.user_id,
                            // ppts_task_name: row,
                            // ppts_assign_to: req.body.ppts_assign_to,
                            // ppts_due_date: req.body.duedate,
                            // ppts_phase_name: req.body.ppts_phase_name,
                            // ppts_is_active_user_flag: req.session.active_user_login,
                            // ppts_note: req.body.notes,
                            // ppts_phase_flag:req.body.ppts_phase_flag
                            // }
                            // console.log('Newdata',newTask)
                            // const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                            // allobj.save().then(async function(resp){
                            //     let responce = await resp
                            //     resolve(responce)
                            // }).catch((err)=>{
                            //     reject(err)
                            // });
                        }else{
                            console.log('Else consifotiodsf sjs fksdh')

                            PropertyProfessinoalTaskSchema.findOne({
                                ppts_property_id: req.body.ppts_property_id,
                                ppts_task_name:row,
                                ppts_phase_name:req.body.ppts_phase_name,
                                ppts_phase_flag:req.body.ppts_phase_flag 
                             }).then(async (data1) => { 
                                if (data1) {
                                console.log('Object data1data1 String:',data1);
                                console.log('Object data1.ppts_assign_to String:',data1.ppts_assign_to);
                                console.log('Object data1.ppts_user_id String:',data1.ppts_user_id);
            
                                 var AssignToArray = data1.ppts_assign_to;
                                 if(!AssignToArray.includes(req.body.ppts_assign_to)){
                                    AssignToArray.push(req.body.ppts_assign_to);
                                 }
                                 console.log('Object AssignToArray New String:',AssignToArray);
            
                                 var UseridToArray = data1.ppts_user_id;
                                 if(!UseridToArray.includes(req.session.user_id)){
                                    UseridToArray.push(req.session.user_id);
                                 }
                                 console.log('Object UseridToArray New String:',UseridToArray);
                               
                                 var DueDateToArray = data1.ppts_due_date;
                                 if(!DueDateToArray.includes(req.body.duedate)){
                                    DueDateToArray.push(req.body.duedate);
                                 }
                                 console.log('Object DueDateToArray New String:',DueDateToArray);
            
                                 var NotesToArray = data1.ppts_note;
                                 if(!NotesToArray.includes(req.body.notes)){
                                    NotesToArray.push(req.body.notes);
                                 }
                                 console.log('Object NotesToArray New String:',NotesToArray);
            
            
                                PropertyProfessinoalTaskSchema.updateOne({  ppts_property_id: req.body.ppts_property_id,
                                    ppts_task_name:row,
                                    ppts_phase_name:req.body.ppts_phase_name,
                                    ppts_phase_flag:req.body.ppts_phase_flag  }, { $set: { ppts_assign_to: AssignToArray,ppts_user_id:UseridToArray,ppts_note:NotesToArray,ppts_due_date:DueDateToArray } }, { upsert: true }, function (err) {
                                    if (err) {
                                      console.log("err is :", err);
                                      console.log(' Object Dataupdated Not successfully');
                  
                                    } else {
                                               console.log(' Object Dataupdated successfully');
                                    }
                                  })
                                }else{
                                    console.log('Object Not avilable data ere foirst data ');
            
                                        newTask = {
                                            ppts_property_id: req.body.ppts_property_id,
                                            ppts_user_id: req.session.user_id,
                                            ppts_task_name: row,
                                            ppts_assign_to: req.body.ppts_assign_to,
                                            ppts_due_date: req.body.duedate,
                                            ppts_phase_name: req.body.ppts_phase_name,
                                            ppts_is_active_user_flag: req.session.active_user_login,
                                            ppts_note: req.body.notes,
                                            ppts_phase_flag:req.body.ppts_phase_flag
                                        }
                                        const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                                        allobj.save().then(async function(resp){
                                            let responce = await resp
                                            resolve(responce)
                                        }).catch((err)=>{
                                            reject(err)
                                        });
                                    
                                }
                                     
            
                             })



                        }
                    }).catch((err) => {
                        reject(err)
                    })
                })
      
          } else {
            console.log("addTask post String:", req.body);

            PropertyProfessinoalTaskSchema.findOne({
                   ppts_property_id: req.body.ppts_property_id,
                   ppts_user_id:{$in:req.session.user_id},
                   ppts_task_name:req.body.task_element,
                   ppts_assign_to:{$in:req.body.ppts_assign_to}, 
                   ppts_phase_name:req.body.ppts_phase_name,
                   ppts_phase_flag:req.body.ppts_phase_flag
            }).then(async (data) => {
              if (!data) {

                console.log('Not Already task in table2111 String:');

                PropertyProfessinoalTaskSchema.findOne({
                    ppts_property_id: req.body.ppts_property_id,
                    ppts_task_name:req.body.task_element,
                    ppts_phase_name:req.body.ppts_phase_name,
                    ppts_phase_flag:req.body.ppts_phase_flag 
                 }).then(async (data1) => { 
                    if (data1) {
                    console.log('data1data1 String:',data1);
                    console.log('data1.ppts_assign_to String:',data1.ppts_assign_to);
                    console.log('data1.ppts_user_id String:',data1.ppts_user_id);

                     var AssignToArray = data1.ppts_assign_to;
                     if(!AssignToArray.includes(req.body.ppts_assign_to)){
                        AssignToArray.push(req.body.ppts_assign_to);
                     }
                     console.log('AssignToArray New String:',AssignToArray);

                     var UseridToArray = data1.ppts_user_id;
                     if(!UseridToArray.includes(req.session.user_id)){
                        UseridToArray.push(req.session.user_id);
                     }
                     console.log('UseridToArray New String:',UseridToArray);
                   
                     var DueDateToArray = data1.ppts_due_date;
                     if(!DueDateToArray.includes(req.body.duedate)){
                        DueDateToArray.push(req.body.duedate);
                     }
                     console.log('DueDateToArray New String:',DueDateToArray);

                     var NotesToArray = data1.ppts_note;
                     if(!NotesToArray.includes(req.body.notes)){
                        NotesToArray.push(req.body.notes);
                     }
                     console.log('NotesToArray New String:',NotesToArray);


                    PropertyProfessinoalTaskSchema.updateOne({  ppts_property_id: req.body.ppts_property_id,
                        ppts_task_name:req.body.task_element,
                        ppts_phase_name:req.body.ppts_phase_name,
                        ppts_phase_flag:req.body.ppts_phase_flag  }, { $set: { ppts_assign_to: AssignToArray,ppts_user_id:UseridToArray,ppts_note:NotesToArray,ppts_due_date:DueDateToArray } }, { upsert: true }, function (err) {
                        if (err) {
                          console.log("err is :", err);
                          console.log('Dataupdated Not successfully');
      
                        } else {
                                   console.log('Dataupdated successfully');
                        }
                      })
                    }else{
                        console.log('Not avilable data ere foirst data ');

                            newTask = {
                                ppts_property_id: req.body.ppts_property_id,
                                ppts_user_id: req.session.user_id,
                                ppts_task_name: req.body.task_element,
                                ppts_assign_to: req.body.ppts_assign_to,
                                ppts_due_date: req.body.duedate,
                                ppts_phase_name: req.body.ppts_phase_name,
                                ppts_is_active_user_flag: req.session.active_user_login,
                                ppts_note: req.body.notes,
                                ppts_phase_flag:req.body.ppts_phase_flag
                            }
                            const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                            allobj.save().then(async function(resp){
                                let responce = await resp
                                resolve(responce)
                            }).catch((err)=>{
                                reject(err)
                            });
                        
                    }
                         

                 })

              }else{
              
                console.log('Already task in table2111 String:',data)


              }
            })
     
            
          }
      
    });
};



module.exports.add_existing_task_from_btn = function (req) {
    return new Promise( async function (resolve, reject) {

        let taskName='';
        if(req.body.task_name){
          taskName = req.body.task_name;
        }else{
          taskName = req.body.phase_task_list;
        }
        var newTask={};
        console.log('Bodyyy task in table:',req.body)

        if (typeof (taskName) == 'object') {
            taskName.forEach(async function(row ,i){
                    PropertyProfessinoalTaskSchema.find(
                        {ppts_property_id: req.body.property_id,
                          ppts_user_id:{$in:[req.session.user_id]},
                          ppts_task_name:row, 
                          ppts_assign_to:{$in:[req.body.professionalId]},
                          ppts_phase_name:req.body.Phase, 
                           ppts_phase_flag:req.body.ppts_phase_flag
                         }).then(async (data) => {
                          console.log('Already task in table2111:',data)
                        if (!data) {
                            console.log('ifififi consifotiodsf sjs fksdh')
                          
                          
                        }else{
                            console.log('Else consifotiodsf sjs fksdh')

                            PropertyProfessinoalTaskSchema.findOne({
                                ppts_property_id: req.body.property_id,
                                ppts_task_name:row,
                                ppts_phase_name:req.body.Phase,
                                ppts_phase_flag:req.body.ppts_phase_flag 
                             }).then(async (data1) => { 
                                if (data1) {
                                console.log('Object data1data1 String:',data1);
                                console.log('Object data1.ppts_assign_to String:',data1.ppts_assign_to);
                                console.log('Object data1.ppts_user_id String:',data1.ppts_user_id);
            
                                 var AssignToArray = data1.ppts_assign_to;
                                 if(!AssignToArray.includes(req.body.professionalId)){
                                    AssignToArray.push(req.body.professionalId);
                                 }
                                 console.log('Object AssignToArray New String:',AssignToArray);
            
                                 var UseridToArray = data1.ppts_user_id;
                                 if(!UseridToArray.includes(req.session.user_id)){
                                    UseridToArray.push(req.session.user_id);
                                 }
                                 console.log('Object UseridToArray New String:',UseridToArray);
                               
                                 var DueDateToArray = data1.ppts_due_date;
                                 if(!DueDateToArray.includes(req.body.duedate)){
                                    DueDateToArray.push(req.body.duedate);
                                 }
                                 console.log('Object DueDateToArray New String:',DueDateToArray);
            
                                 var NotesToArray = data1.ppts_note;
                                 if(!NotesToArray.includes(req.body.notes)){
                                    NotesToArray.push(req.body.notes);
                                 }
                                 console.log('Object NotesToArray New String:',NotesToArray);
            
            
                                PropertyProfessinoalTaskSchema.updateOne({  ppts_property_id: req.body.property_id,
                                    ppts_task_name:row,
                                    ppts_phase_name:req.body.Phase,
                                    ppts_phase_flag:req.body.ppts_phase_flag  }, { $set: { ppts_assign_to: AssignToArray,ppts_user_id:UseridToArray,ppts_note:NotesToArray,ppts_due_date:DueDateToArray } }, { upsert: true }, function (err) {
                                    if (err) {
                                      console.log("err is :", err);
                                      console.log(' Object Dataupdated Not successfully');
                  
                                    } else {
                                               console.log(' Object Dataupdated successfully');
                                    }
                                  })
                                }else{
                                    console.log('Object Not avilable data ere foirst data ');
            
                                    newTask ={
                                            ppts_property_id: req.body.property_id,
                                            ppts_user_id: req.session.user_id,
                                            ppts_task_name: row,
                                            ppts_assign_to: req.body.professionalId,
                                            ppts_due_date: req.body.duedate,
                                            //ppts_phase_id: req.body.Phase,
                                            ppts_phase_name: req.body.Phase,
                                            ppts_is_active_user_flag: req.session.active_user_login,
                                            ppts_note: req.body.notes,
                                            ppts_phase_flag:req.body.ppts_phase_flag
                                        }
                                        const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                                        allobj.save().then(async function(resp){
                                            let responce = await resp
                                            resolve(responce)
                                        }).catch((err)=>{
                                            reject(err)
                                        });
                                    
                                }
                                     
            
                             })



                        }
                    }).catch((err) => {
                        reject(err)
                    })
                })
      
          } else {
            console.log("addTask post String:", req.body);

            PropertyProfessinoalTaskSchema.findOne({
                   ppts_property_id: req.body.property_id,
                   ppts_user_id:{$in:req.session.user_id},
                   ppts_task_name:taskName,
                   ppts_assign_to:{$in:req.body.professionalId}, 
                   ppts_phase_name:req.body.Phase,
                   ppts_phase_flag:req.body.ppts_phase_flag
            }).then(async (data) => {
              if (!data) {

                console.log('Not Already task in table2111 String:');

                PropertyProfessinoalTaskSchema.findOne({
                    ppts_property_id: req.body.property_id,
                    ppts_task_name:taskName,
                    ppts_phase_name:req.body.Phase,
                    ppts_phase_flag:req.body.ppts_phase_flag
                 }).then(async (data1) => { 
                    if (data1) {
                    console.log('data1data1 String:',data1);
                    console.log('data1.ppts_assign_to String:',data1.ppts_assign_to);
                    console.log('data1.ppts_user_id String:',data1.ppts_user_id);

                     var AssignToArray = data1.ppts_assign_to;
                     if(!AssignToArray.includes(req.body.professionalId)){
                        AssignToArray.push(req.body.professionalId);
                     }
                     console.log('AssignToArray New String:',AssignToArray);

                     var UseridToArray = data1.ppts_user_id;
                     if(!UseridToArray.includes(req.session.user_id)){
                        UseridToArray.push(req.session.user_id);
                     }
                     console.log('UseridToArray New String:',UseridToArray);
                   
                     var DueDateToArray = data1.ppts_due_date;
                     if(!DueDateToArray.includes(req.body.duedate)){
                        DueDateToArray.push(req.body.duedate);
                     }
                     console.log('DueDateToArray New String:',DueDateToArray);

                     var NotesToArray = data1.ppts_note;
                     if(!NotesToArray.includes(req.body.notes)){
                        NotesToArray.push(req.body.notes);
                     }
                     console.log('NotesToArray New String:',NotesToArray);


                    PropertyProfessinoalTaskSchema.updateOne({  ppts_property_id: req.body.property_id,
                        ppts_task_name:taskName,
                        ppts_phase_name:req.body.Phase,
                        ppts_phase_flag:req.body.ppts_phase_flag  }, { $set: { ppts_assign_to: AssignToArray,ppts_user_id:UseridToArray,ppts_note:NotesToArray,ppts_due_date:DueDateToArray } }, { upsert: true }, function (err) {
                        if (err) {
                          console.log("err is :", err);
                          console.log('Dataupdated Not successfully');
      
                        } else {
                                   console.log('Dataupdated successfully');
                        }
                      })
                    }else{
                        console.log('Not avilable data ere foirst data ');

                            newTask = {
                                    ppts_property_id: req.body.property_id,
                                    ppts_user_id: req.session.user_id,
                                    ppts_task_name: taskName,
                                    ppts_assign_to: req.body.professionalId,
                                    ppts_due_date: req.body.duedate,
                                    //ppts_phase_id: req.body.Phase,
                                    ppts_phase_name: req.body.Phase,
                                    ppts_is_active_user_flag: req.session.active_user_login,
                                    ppts_note: req.body.notes,
                                    ppts_phase_flag:req.body.ppts_phase_flag
                            }
                            const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                            allobj.save().then(async function(resp){
                                let responce = await resp
                                resolve(responce)
                            }).catch((err)=>{
                                reject(err)
                            });
                        
                    }
                         

                 })

              }else{
              
                console.log('Already task in table2111 String:',data)


              }
            })
     
            
          }


    });
};


module.exports.add_existing_task_from_btn_dramhome_details = function (req) {
    return new Promise( async function (resolve, reject) {
        // var newTask={};

        let taskName='';
        if(req.body.task_name){
          taskName = req.body.task_name;
        }else{
          taskName = req.body.phase_task_list;
        }
        var newTask={};
        console.log('Bodyyy task in table:',req.body)

        if (typeof (taskName) == 'object') {
            taskName.forEach(async function(row ,i){
                    PropertyProfessinoalTaskSchema.find(
                        {ppts_property_id: req.body.property_id_add_task,
                          ppts_user_id:{$in:[req.session.user_id]},
                          ppts_task_name:row, 
                          ppts_assign_to:{$in:[req.body.service_provider_id]},
                          ppts_phase_name:req.body.Phase, 
                           ppts_phase_flag:req.body.ppts_phase_flag
                         }).then(async (data) => {
                          console.log('Already task in table2111:',data)
                        if (!data) {
                            console.log('ifififi consifotiodsf sjs fksdh')
                          
                          
                        }else{
                            console.log('Else consifotiodsf sjs fksdh')

                            PropertyProfessinoalTaskSchema.findOne({
                                ppts_property_id: req.body.property_id_add_task,
                                ppts_task_name:row,
                                ppts_phase_name:req.body.Phase,
                                ppts_phase_flag:req.body.ppts_phase_flag 
                             }).then(async (data1) => { 
                                if (data1) {
                                console.log('Object data1data1 String:',data1);
                                console.log('Object data1.ppts_assign_to String:',data1.ppts_assign_to);
                                console.log('Object data1.ppts_user_id String:',data1.ppts_user_id);
            
                                 var AssignToArray = data1.ppts_assign_to;
                                 if(!AssignToArray.includes(req.body.service_provider_id)){
                                    AssignToArray.push(req.body.service_provider_id);
                                 }
                                 console.log('Object AssignToArray New String:',AssignToArray);
            
                                 var UseridToArray = data1.ppts_user_id;
                                 if(!UseridToArray.includes(req.session.user_id)){
                                    UseridToArray.push(req.session.user_id);
                                 }
                                 console.log('Object UseridToArray New String:',UseridToArray);
                               
                                 var DueDateToArray = data1.ppts_due_date;
                                 if(!DueDateToArray.includes(req.body.duedate)){
                                    DueDateToArray.push(req.body.duedate);
                                 }
                                 console.log('Object DueDateToArray New String:',DueDateToArray);
            
                                 var NotesToArray = data1.ppts_note;
                                 if(!NotesToArray.includes(req.body.notes)){
                                    NotesToArray.push(req.body.notes);
                                 }
                                 console.log('Object NotesToArray New String:',NotesToArray);
            
            
                                PropertyProfessinoalTaskSchema.updateOne({  ppts_property_id: req.body.property_id_add_task,
                                    ppts_task_name:row,
                                    ppts_phase_name:req.body.Phase,
                                    ppts_phase_flag:req.body.ppts_phase_flag  }, { $set: { ppts_assign_to: AssignToArray,ppts_user_id:UseridToArray,ppts_note:NotesToArray,ppts_due_date:DueDateToArray } }, { upsert: true }, function (err) {
                                    if (err) {
                                      console.log("err is :", err);
                                      console.log(' Object Dataupdated Not successfully');
                  
                                    } else {
                                               console.log(' Object Dataupdated successfully');
                                    }
                                  })
                                }else{
                                    console.log('Object Not avilable data ere foirst data ');
            
                                    newTask ={
                                            ppts_property_id: req.body.property_id_add_task,
                                            ppts_user_id: req.session.user_id,
                                            ppts_task_name: row,
                                            ppts_assign_to: req.body.service_provider_id,
                                            ppts_due_date: req.body.duedate,
                                            //ppts_phase_id: req.body.Phase,
                                            ppts_phase_name: req.body.Phase,
                                            ppts_is_active_user_flag: req.session.active_user_login,
                                            ppts_note: req.body.notes,
                                            ppts_phase_flag:req.body.ppts_phase_flag
                                        }
                                        const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                                        allobj.save().then(async function(resp){
                                            let responce = await resp
                                            resolve(responce)
                                        }).catch((err)=>{
                                            reject(err)
                                        });
                                    
                                }
                                     
            
                             })



                        }
                    }).catch((err) => {
                        reject(err)
                    })
                })
      
          } else {
            console.log("addTask post String:", req.body);

            PropertyProfessinoalTaskSchema.findOne({
                   ppts_property_id: req.body.property_id_add_task,
                   ppts_user_id:{$in:req.session.user_id},
                   ppts_task_name:taskName,
                   ppts_assign_to:{$in:req.body.ppts_assign_to}, 
                   ppts_phase_name:req.body.Phase,
                   ppts_phase_flag:req.body.ppts_phase_flag
            }).then(async (data) => {
              if (!data) {

                console.log('Not Already task in table2111 String:');

                PropertyProfessinoalTaskSchema.findOne({
                    ppts_property_id: req.body.property_id_add_task,
                    ppts_task_name:taskName,
                    ppts_phase_name:req.body.Phase,
                    ppts_phase_flag:req.body.ppts_phase_flag
                 }).then(async (data1) => { 
                    if (data1) {
                    console.log('data1data1 String:',data1);
                    console.log('data1.ppts_assign_to String:',data1.ppts_assign_to);
                    console.log('data1.ppts_user_id String:',data1.ppts_user_id);

                     var AssignToArray = data1.ppts_assign_to;
                     if(!AssignToArray.includes(req.body.service_provider_id)){
                        AssignToArray.push(req.body.service_provider_id);
                     }
                     console.log('AssignToArray New String:',AssignToArray);

                     var UseridToArray = data1.ppts_user_id;
                     if(!UseridToArray.includes(req.session.user_id)){
                        UseridToArray.push(req.session.user_id);
                     }
                     console.log('UseridToArray New String:',UseridToArray);
                   
                     var DueDateToArray = data1.ppts_due_date;
                     if(!DueDateToArray.includes(req.body.duedate)){
                        DueDateToArray.push(req.body.duedate);
                     }
                     console.log('DueDateToArray New String:',DueDateToArray);

                     var NotesToArray = data1.ppts_note;
                     if(!NotesToArray.includes(req.body.notes)){
                        NotesToArray.push(req.body.notes);
                     }
                     console.log('NotesToArray New String:',NotesToArray);


                    PropertyProfessinoalTaskSchema.updateOne({  ppts_property_id: req.body.property_id_add_task,
                        ppts_task_name:taskName,
                        ppts_phase_name:req.body.Phase,
                        ppts_phase_flag:req.body.ppts_phase_flag  }, { $set: { ppts_assign_to: AssignToArray,ppts_user_id:UseridToArray,ppts_note:NotesToArray,ppts_due_date:DueDateToArray } }, { upsert: true }, function (err) {
                        if (err) {
                          console.log("err is :", err);
                          console.log('Dataupdated Not successfully');
      
                        } else {
                                   console.log('Dataupdated successfully');
                        }
                      })
                    }else{
                        console.log('Not avilable data ere foirst data ');

                            newTask = {
                                ppts_property_id: req.body.property_id_add_task,
                                ppts_user_id: req.session.user_id,
                                ppts_task_name: taskName,
                                ppts_assign_to: req.body.service_provider_id,
                                ppts_due_date: req.body.duedate,
                                //ppts_phase_id: req.body.Phase,
                                ppts_phase_name: req.body.Phase,
                                ppts_is_active_user_flag: req.session.active_user_login,
                                ppts_note: req.body.notes,
                                ppts_phase_flag:req.body.ppts_phase_flag
                            }
                            const allobj = await  new PropertyProfessinoalTaskSchema(newTask);
                            allobj.save().then(async function(resp){
                                let responce = await resp
                                resolve(responce)
                            }).catch((err)=>{
                                reject(err)
                            });
                        
                    }
                         

                 })

              }else{
              
                console.log('Already task in table2111 String:',data)


              }
            })
     
            
          }

  
    });
};