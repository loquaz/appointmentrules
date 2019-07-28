import * as Router from 'koa-router';
import { id } from 'inversify';
import AppointmentType from '../appointmentType';

const endpoints = new Router();

/**
 * registers a day appointment
 */
endpoints.post('/appointment/day', async (ctx, next) => {
  
    const appointmentData       = ctx.request.body;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    const appointmentRecord     = serviceAppointment.build( appointmentData );


    if(appointmentRecord.type !== AppointmentType.DAY){

        ctx.status  = 400; // BAD REQUEST
        ctx.body    = {
            "message" : "Wrong type especified" 
        } 

    }else if( !appointmentRecord.validate() ){
        
        ctx.status  = 400; // BAD REQUEST
        ctx.body    = appointmentRecord.getErrors();
        console.log( appointmentRecord.getErrors() );

    }else{

        const appointmentSaved  = serviceAppointment.create( appointmentRecord );
        ctx.body                = appointmentSaved.toJson();

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
        ctx.body                = appointmentSaved.toJson();

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
