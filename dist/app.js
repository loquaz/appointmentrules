"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Koa = require("koa");
var Bodyparser = require("koa-bodyparser");
var endpoints_1 = require("./api/endpoints");
var json_datasource_1 = require("./data/json-datasource");
var appointment_service_1 = require("./service/appointment-service");
var appointment_repository_1 = require("./repository/appointment-repository");
require("reflect-metadata");
var inversify_1 = require("inversify");
var AppointmentApp = /** @class */ (function () {
    function AppointmentApp() {
        this.boot();
    }
    /**
     * Bootstrap the app
     */
    AppointmentApp.prototype.boot = function () {
        // init the DI container
        var container = new inversify_1.Container();
        container.bind("JsonDatasource").to(json_datasource_1.default);
        container.bind("AppointmentRepository").to(appointment_repository_1.default);
        container.bind("AppointmentService").to(appointment_service_1.default);
        // init the server
        var server = new Koa();
        var bodyParser = Bodyparser;
        var bodyParserOptions = {
            extendTypes: {
                json: ['application/json']
            }
        };
        // inject the DI container into context to be used in all endpoints (routes)
        server.context.container = container;
        //register routes
        server.use(bodyParser(bodyParserOptions));
        server.use(endpoints_1.default.routes());
        server.listen(3001);
        //console.log( container.get("AppointmentService") );
    };
    return AppointmentApp;
}());
var _app = new AppointmentApp();
//# sourceMappingURL=app.js.map