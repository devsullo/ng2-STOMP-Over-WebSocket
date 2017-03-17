"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
var StompService = (function () {
    function StompService() {
        var _this = this;
        this.config = null;
        /**
         * Successfull connection to server
         */
        this.onConnect = function (frame) {
            _this.status = 'CONNECTED';
            _this.resolveConPromise();
            _this.timer = null;
            //console.log('Connected: ' + frame);
        };
        /**
         * Unsuccessfull connection to server
         */
        this.onError = function (error) {
            console.error("Error: " + error);
            // Check error and try reconnect
            if (error.indexOf('Lost connection') !== -1) {
                if (_this.config.debug) {
                    console.log('Reconnecting...');
                }
                _this.timer = setTimeout(function () {
                    _this.startConnect();
                }, _this.config.recTimeout);
            }
        };
        this.status = 'CLOSED';
        //Create promises
        this.connectionPromise = new Promise(function (resolve, reject) { return _this.resolveConPromise = resolve; });
        this.disconnectPromise = new Promise(function (resolve, reject) { return _this.resolveDisConPromise = resolve; });
    }
    /**
     * Configure
     */
    StompService.prototype.configure = function (config) {
        this.config = config;
    };
    /**
     * Try to establish connection to server
     */
    StompService.prototype.startConnect = function () {
        if (this.config === null) {
            throw Error('Configuration required!');
        }
        this.status = 'CONNECTING';
        //Prepare Client
        this.socket = new SockJS(this.config.host);
        this.stomp = Stomp.over(this.socket);
        this.stomp.heartbeat.outgoing = this.config.heartbeatOut;
        this.stomp.heartbeat.incoming = this.config.heartbeatIn;
        //Debuging connection
        if (this.config.debug) {
            this.stomp.debug = function (str) {
                console.log(str);
            };
        }
        else {
            this.stomp.debug = false;
        }
        //Connect to server
        this.stomp.connect(this.config.headers, this.onConnect, this.onError);
        return this.connectionPromise;
    };
    /**
     * Subscribe
     */
    StompService.prototype.subscribe = function (destination, callback, headers) {
        headers = headers || {};
        return this.stomp.subscribe(destination, function (response) {
            var message = JSON.parse(response.body);
            var headers = response.headers;
            callback(message, headers);
        }, headers);
    };
    /**
     * Unsubscribe
     */
    StompService.prototype.unsubscribe = function (subscription) {
        subscription.unsubscribe();
    };
    /**
     * Send
     */
    StompService.prototype.send = function (destination, body, headers) {
        var message = JSON.stringify(body);
        headers = headers || {};
        this.stomp.send(destination, headers, message);
    };
    /**
     * Disconnect stomp
     */
    StompService.prototype.disconnect = function () {
        var _this = this;
        this.stomp.disconnect(function () { _this.resolveDisConPromise(); _this.status = 'CLOSED'; });
        return this.disconnectPromise;
    };
    return StompService;
}());
StompService = __decorate([
    core_1.Injectable()
], StompService);
exports.StompService = StompService;

//# sourceMappingURL=stomp.service.js.map
