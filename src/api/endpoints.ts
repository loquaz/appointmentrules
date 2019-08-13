import * as Router from 'koa-router';
import { id } from 'inversify';
import AppointmentType from '../common/appointmentType';
import Appointment from '../model/appointment';
import * as moment from 'moment';
import ApplicationError, {  ErrorTypes, ErrorCodes, HttpStatusCodes } from '../common/application-error';

const endpoints = new Router();

/*==============================================================
                            DAY
===============================================================*/
/**
 * get all days appointments
 */
endpoints.get('/appointment/days', async (ctx, next) => {
  
    const serviceAppointment            = ctx.container.get("AppointmentService");
    const appointments: Appointment[]   = serviceAppointment.getAllDays();
    const response                      = appointments.map( appointment => {

        appointment._sortIntervals()
        return appointment.toJsonWithoutId();

    }); 
    
    ctx.body = response;
    
});

/**
 * registers a day appointment
 */
endpoints.post('/appointment/day', async (ctx, next) => {
  
    const appointmentData       = ctx.request.body;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    const appointmentRecord     = serviceAppointment.build( appointmentData );


    if(appointmentRecord.type !== AppointmentType.DAY){
        
        const errorMsg  = `Wrong type specified {${appointmentRecord.type}}`;
        const error     = new ApplicationError(400, ErrorTypes.BAD_REQUEST, ErrorCodes.BAD_REQUEST, errorMsg);
        ctx.status      = HttpStatusCodes.BAD_REQUEST;
        ctx.body        = error.getError(); 

    }else if( !appointmentRecord.validate() ){

        console.log('endpoint');
        
        const errorMsg  = appointmentRecord.getError();
        const error     = new ApplicationError(400, ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, errorMsg);
        ctx.status      = HttpStatusCodes.OK;
        ctx.body        = error.getError();        

    }else{

        const appointmentSaved  = serviceAppointment.create( appointmentRecord );

        if( appointmentSaved && serviceAppointment.getError() ){

            const error     = ApplicationError.buildFromBaseError( serviceAppointment.getError(), 400 );
            ctx.status      = 400; // BAD REQUEST
            ctx.body        = error;            

        }else if( appointmentSaved ){
            appointmentSaved._sortIntervals();
            ctx.body = appointmentSaved.toJson();
        }

    }  

});

/**
 * Removes an day appointment
 */
endpoints.del('/appointment/day/:id', (ctx) =>{
    
    let _id                     = ctx.params.id;
    const serviceAppointment    = ctx.container.get("AppointmentService");   
    const removed               = serviceAppointment.deleteDayById( _id, AppointmentType.DAY );

    if(removed){

        ctx.status = HttpStatusCodes.NO_CONTENT // DELETED

    }else{

        const errorMsg  = `resource with id {${_id}} not found`;
        const error     = new ApplicationError(404, ErrorTypes.NOT_FOUND, ErrorCodes.NOT_FOUND, errorMsg);
        ctx.status      = HttpStatusCodes.NOT_FOUND;
        ctx.body        = error.getError();        

    }
    
});

/**
 * Retrieves all appointments between the suplieds init and end dates
 */
endpoints.get('/appointment/available/:initdate/:enddate', (ctx)=>{
    
    let _initDateParam  = ctx.params.initdate;
    let _endDateParam   = ctx.params.enddate;
    let _initDate       = moment(_initDateParam, 'DD-MM-YYYY');
    let _endDate        = moment(_endDateParam, 'DD-MM-YYYY');
    
    if( !_initDate.isValid() || !_endDate.isValid() ){

        const errorMsg  = `${_initDateParam}, ${_endDateParam} or both are invalid dates`;
        const error     = new ApplicationError(400, ErrorTypes.BAD_REQUEST, ErrorCodes.BAD_REQUEST, errorMsg);
        ctx.status      = HttpStatusCodes.OK;
        ctx.body        = error.getError();

    }else if( _initDate.isAfter( _endDate ) ){

        const errorMsg  = `${_initDateParam} can\'t be greater than ${_endDateParam}`;
        const error     = new ApplicationError(400, ErrorTypes.BAD_REQUEST, ErrorCodes.BAD_REQUEST, errorMsg);
        ctx.status      = HttpStatusCodes.OK;
        ctx.body        = error.getError();
        
    }else{

        const serviceAppointment    = ctx.container.get("AppointmentService");   
        const appointments          = serviceAppointment.getAppointmentsBetween( _initDateParam, _endDateParam );
        let response                = [];

        if( appointments && appointments.length > 0 ){

            response = appointments.map( appointment =>{

                appointment._sortIntervals();
                return appointment.toJsonWithoutId();

            });

            ctx.body = response;

        }    
    }

});


/*==============================================================
                            DAILY
===============================================================*/
/**
 * get daily appointment
 */
endpoints.get('/appointment/daily', async (ctx, next) => {
  
    const serviceAppointment            = ctx.container.get("AppointmentService");
    const appointments: Appointment[]   = serviceAppointment.getDaily();
    const response                      = appointments.map( appointment => {
        appointment._sortIntervals();
        return appointment.toJsonWithoutId();
    }); 
    
    ctx.body = response;

});

/**
 * registers a daily appointment
 */
endpoints.post('/appointment/daily', async (ctx, next) => {
     
   const appointmentData       = ctx.request.body;
   const serviceAppointment    = ctx.container.get("AppointmentService");
   const appointmentRecord     = serviceAppointment.build( appointmentData );


   if(appointmentRecord.type !== AppointmentType.DAILY){
       
       const errorMsg  = `Wrong type specified {${appointmentRecord.type}}`;
       const error     = new ApplicationError(400, ErrorTypes.BAD_REQUEST, ErrorCodes.BAD_REQUEST, errorMsg);
       ctx.status      = HttpStatusCodes.BAD_REQUEST;
       ctx.body        = error.getError(); 

   }else if( !appointmentRecord.validate() ){

       console.log('endpoint daily');
       
       const errorMsg  = appointmentRecord.getError();
       const error     = new ApplicationError(400, ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, errorMsg);
       ctx.status      = HttpStatusCodes.OK;
       ctx.body        = error.getError();        

   }else{

       const appointmentSaved  = serviceAppointment.create( appointmentRecord );

       if( appointmentSaved && serviceAppointment.getError() ){

           const error     = ApplicationError.buildFromBaseError( serviceAppointment.getError(), 400 );
           ctx.status      = 400; // BAD REQUEST
           ctx.body        = error;            

       }else if( appointmentSaved ){
           appointmentSaved._sortIntervals();
           ctx.body = appointmentSaved.toJson();
       }

   }

});

/**
 * Removes an daily appointment
 */
endpoints.del('/appointment/daily/:id', (ctx) =>{
    
    let _id                     = ctx.params.id;
    const serviceAppointment    = ctx.container.get("AppointmentService");   
    const removed               = serviceAppointment.deleteDayById( _id, AppointmentType.DAILY );

    if(removed){

        ctx.status = HttpStatusCodes.NO_CONTENT // DELETED

    }else{

        const errorMsg  = `resource with id {${_id}} not found`;
        const error     = new ApplicationError(404, ErrorTypes.NOT_FOUND, ErrorCodes.NOT_FOUND, errorMsg);
        ctx.status      = HttpStatusCodes.NOT_FOUND;
        ctx.body        = error.getError();        

    }
    
    //console.log('id', ctx.params.id);
});


/*==============================================================
                            WEEKLY
===============================================================*/
/**
 * get weekly appointment
 */
endpoints.get('/appointment/weekly', async (ctx, next) => {
  
    const serviceAppointment            = ctx.container.get("AppointmentService");
    const appointments: Appointment[]   = serviceAppointment.getWeekly();
    const response                      = appointments.map( appointment => {
        appointment._sortIntervals();
        return appointment.toJsonWithoutId();
    }); 
    
    ctx.body = response;

});

/**
 * registers a weekly appointment
 */
endpoints.post('/appointment/weekly', async (ctx, next) => {
  
   const appointmentData       = ctx.request.body;
   const serviceAppointment    = ctx.container.get("AppointmentService");
   const appointmentRecord     = serviceAppointment.build( appointmentData );


   if(appointmentRecord.type !== AppointmentType.WEEKLY){
       
       const errorMsg  = `Wrong type specified {${appointmentRecord.type}}`;
       const error     = new ApplicationError(400, ErrorTypes.BAD_REQUEST, ErrorCodes.BAD_REQUEST, errorMsg);
       ctx.status      = HttpStatusCodes.BAD_REQUEST;
       ctx.body        = error.getError(); 

   }else if( !appointmentRecord.validate() ){

       console.log('endpoint weekly');
       
       const errorMsg  = appointmentRecord.getError();
       const error     = new ApplicationError(400, ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, errorMsg);
       ctx.status      = HttpStatusCodes.OK;
       ctx.body        = error.getError();        

   }else{

       const appointmentSaved  = serviceAppointment.create( appointmentRecord );

       if( appointmentSaved && serviceAppointment.getError() ){

           const error     = ApplicationError.buildFromBaseError( serviceAppointment.getError(), 400 );
           ctx.status      = 400; // BAD REQUEST
           ctx.body        = error;            

       }else if( appointmentSaved ){
           appointmentSaved._sortIntervals();
           ctx.body = appointmentSaved.toJson();
       }

   }

});

/**
 * Removes an weekly appointment
 */
endpoints.del('/appointment/weekly/:id', (ctx) =>{
    
    let _id                     = ctx.params.id;
    const serviceAppointment    = ctx.container.get("AppointmentService");   
    const removed               = serviceAppointment.deleteDayById( _id, AppointmentType.WEEKLY );

    if(removed){

        ctx.status = HttpStatusCodes.NO_CONTENT // DELETED

    }else{

        const errorMsg  = `resource with id {${_id}} not found`;
        const error     = new ApplicationError(404, ErrorTypes.NOT_FOUND, ErrorCodes.NOT_FOUND, errorMsg);
        ctx.status      = HttpStatusCodes.NOT_FOUND;
        ctx.body        = error.getError();        

    }
    
    //console.log('id', ctx.params.id);
});

export default endpoints;
