import * as Koa from 'koa';
import * as Bodyparser   from 'koa-bodyparser';
import endpoints from './api/endpoints';
import JsonDatasource from './data/json-datasource';
import AppointmentService from './service/appointment-service';
import AppointmentRepository from './repository/appointment-repository';
import 'reflect-metadata';

import { Container } from 'inversify';
import IDatasource from './data/idatasource';
import IRepository from './repository/irepository';
import Appointment from './model/appointment';
import IService from './service/iservice';

class AppointmentApp {
    
    constructor(){
        this.boot();
    }

    /**
     * Bootstrap the app
     */
    boot() : void {

        // init the DI container
        const container = new Container();
        container.bind<IDatasource<Appointment>>("JsonDatasource").to(JsonDatasource);
        container.bind<IRepository<Appointment>>("AppointmentRepository").to(AppointmentRepository);
        container.bind<IService<Appointment>>("AppointmentService").to(AppointmentService);

        // init the server
        const server        = new Koa();       
        const bodyParser    = Bodyparser;

        const bodyParserOptions = {
            extendTypes : {
                json : ['application/json']
            }
        }

        // inject the DI container into context to be used in all endpoints (routes)
        server.context.container = container;

        //register routes
        server.use( bodyParser( bodyParserOptions ) );
        server.use( endpoints.routes() );
        server.listen( 3001 );
        

        //console.log( container.get("AppointmentService") );

    }

}

const _app = new AppointmentApp();