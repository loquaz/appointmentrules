import * as Router from 'koa-router';
import { id } from 'inversify';
import AppointmentType from '../appointmentType';
import Appointment from '../model/appointment';
import * as moment from 'moment';
import RequestError from './request-error';

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
        return appointment.toJsonWithoutId();
    }); 
    
    ctx.body = response;

    console.log( response );

});

/**
 * registers a day appointment
 */
endpoints.post('/appointment/day', async (ctx, next) => {
  
    const appointmentData       = ctx.request.body;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    const appointmentRecord     = serviceAppointment.build( appointmentData );


    if(appointmentRecord.type !== AppointmentType.DAY){

        const reqError  = new RequestError(400, "type", appointmentRecord.type, "Wrong type especified");
        ctx.status      = 400; // BAD REQUEST
        ctx.body        = reqError.getError(); 

    }else if( !appointmentRecord.validate() ){
        
        ctx.status  = 400; // BAD REQUEST
        ctx.body    = appointmentRecord.getErrors();
        console.log( appointmentRecord.getErrors() );

    }else{

        const appointmentSaved  = serviceAppointment.create( appointmentRecord );

        if( appointmentSaved && appointmentSaved.getErrors().length > 0 ){

            ctx.status  = 400; // BAD REQUEST
            ctx.body    = appointmentRecord.getErrors();
            console.log( appointmentRecord.getErrors() );

        }else if( appointmentSaved ){
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

        ctx.status = 204 // DELETED

    }else{

        ctx.status  = 404 // NOT FOUND
        ctx.body    = {
            "message" : `resource with id [${_id}] not found`
        }

    }
    
    //console.log('id', ctx.params.id);
});

endpoints.get('/appointment/available/:initdate/:enddate', (ctx)=>{
    
    let _initDateParam  = ctx.params.initdate;
    let _endDateParam   = ctx.params.enddate;
    let _initDate       = moment(_initDateParam, 'DD-MM-YYYY');
    let _endDate        = moment(_endDateParam, 'DD-MM-YYYY');
    
    if( !_initDate.isValid() || !_endDate.isValid() ){

        // TODO mensagem de erro

    }else if( _initDate.isAfter( _endDate ) ){

        // TODO mensagem de erro
        console.log('opa')
        
    }else{

        const serviceAppointment    = ctx.container.get("AppointmentService");   
        const appointments          = serviceAppointment.getAppointmentsBetween( _initDateParam, _endDateParam );
        let response                = [];

        if( appointments && appointments.length > 0 ){

            response = appointments.map( appointment =>{

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
 * get all daily appointments
 */
endpoints.get('/appointment/daily', async (ctx, next) => {
  
    const serviceAppointment            = ctx.container.get("AppointmentService");
    const appointments: Appointment[]   = serviceAppointment.getDaily();
    const response                      = appointments.map( appointment => {
        return appointment.toJsonWithoutId();
    }); 
    
    ctx.body = response;

    console.log( response );

});

/**
 * registers a daily appointment
 */
endpoints.post('/appointment/daily', async (ctx, next) => {
  
    const appointmentData       = ctx.request.body;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    const appointmentRecord     = serviceAppointment.build( appointmentData );

    if(appointmentRecord.type !== AppointmentType.DAILY){

        ctx.status  = 400; // BAD REQUEST
        ctx.body    = {
            "message" : "Wrong type especified" 
        } 

    }else if( !appointmentRecord.validate() ){
        
        ctx.response.status = 400; // BAD REQUEST
        ctx.body            = appointmentRecord.getErrors();
        console.log( appointmentRecord.getErrors() );

    }else{

        const appointmentSaved  = serviceAppointment.create( appointmentRecord );
        //ctx.body                = appointmentSaved.toJson();

        if( appointmentSaved && appointmentSaved.getErrors().length > 0 ){

            ctx.status  = 400; // BAD REQUEST
            ctx.body    = appointmentRecord.getErrors();
            console.log( appointmentRecord.getErrors() );

        }else if( appointmentSaved ){
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

        ctx.status = 204 // DELETED

    }else{

        ctx.status  = 404 // NOT FOUND
        ctx.body    = {
            "message" : `resource with id [${_id}] not found`
        }

    }
    
    //console.log('id', ctx.params.id);
});


/*==============================================================
                            WEEKLY
===============================================================*/
/**
 * registers a weekly appointment
 */
endpoints.post('/appointment/weekly', async (ctx, next) => {
  
    const appointmentData       = ctx.request.body;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    const appointmentRecord     = serviceAppointment.build( appointmentData );

    if(appointmentRecord.type !== AppointmentType.WEEKLY){

        ctx.status  = 400; // BAD REQUEST
        ctx.body    = {
            "message" : "Wrong type especified" 
        } 

    }else if( !appointmentRecord.validate() ){
        
        ctx.response.status = 400; // BAD REQUEST
        ctx.body            = appointmentRecord.getErrors();
        console.log( appointmentRecord.getErrors() );

    }else{

        const appointmentSaved  = serviceAppointment.create( appointmentRecord );
        ctx.body                = appointmentSaved.toJson();

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

        ctx.status = 204 // DELETED

    }else{

        ctx.status  = 404 // NOT FOUND
        ctx.body    = {
            "message" : `resource with id [${_id}] not found`
        }

    }
    
    //console.log('id', ctx.params.id);
});

export default endpoints;
