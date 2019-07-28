import * as Router from 'koa-router';
import { id } from 'inversify';
import AppointmentType from '../appointmentType';

const endpoints = new Router();

endpoints.post('/appointment/day', async (ctx, next) => {
  
    const appointmentData       = ctx.request.body;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    const appointmentRecord     = serviceAppointment.build( appointmentData );

    if( !appointmentRecord.validate() ){
        
        ctx.response.status = 400; // BAD REQUEST
        ctx.body            = appointmentRecord.getErrors();
        console.log( appointmentRecord.getErrors() );

    }else{

        const appointmentSaved  = serviceAppointment.create( appointmentRecord );
        ctx.body                = appointmentSaved.toJson();

    }  

});

endpoints.del('/appointment/day/:id', (ctx) =>{
    
    let _id                     = ctx.params.id;
    const serviceAppointment    = ctx.container.get("AppointmentService");
    serviceAppointment.deleteDayById( _id, AppointmentType.DAY );
    
    console.log('is', ctx.params.id);
})

export default endpoints;
