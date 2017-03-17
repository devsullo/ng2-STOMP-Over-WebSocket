import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

interface Config {

	//websocket endpoint
	host:string;

	//optional headers
	headers?:Object;

	//heartbeats (ms)
	heartbeatIn?: number;
	heartbeatOut?: number;

	//debuging
	debug?:boolean;

	//reconnection time (ms)
	recTimeout?:number;

}

@Injectable()
export class StompService {

	public config = null;

	private socket: any;

	public stomp : any;

	private timer: any;

	private connectionPromise: any;
	private resolveConPromise: (...args: any[]) => void;

	private disconnectPromise: any;
	private resolveDisConPromise: (...args: any[]) => void;

	public status: string;


	constructor() {
		
		this.status = 'CLOSED';

		//Create promises
		this.connectionPromise = new Promise(
	 	  (resolve, reject) => this.resolveConPromise = resolve
	 	);
	 	this.disconnectPromise = new Promise(
	 	  (resolve, reject) => this.resolveDisConPromise = resolve
	 	);
	}


	/**
	 * Configure
	 */
	public configure(config: Config):void{
		this.config = config;
	}


	/**
	 * Try to establish connection to server
	 */
	public startConnect(): Promise<{}>{

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
		if(this.config.debug){
			this.stomp.debug = function(str) {
			  console.log(str);
			};
		}else{
			this.stomp.debug = false;
		}
		//Connect to server
		this.stomp.connect(this.config.headers, this.onConnect,this.onError);
		return this.connectionPromise;
		
	}


	/**
	 * Successfull connection to server
	 */
	public onConnect = (frame:any) => {
	 	this.status = 'CONNECTED';
	 	this.resolveConPromise();
	 	this.timer = null;
	 	//console.log('Connected: ' + frame);
	}

	/**
	 * Unsuccessfull connection to server
	 */
	public onError = (error: string ) => {

	  console.error(`Error: ${error}`);

	  // Check error and try reconnect
	  if (error.indexOf('Lost connection') !== -1) {
	    if(this.config.debug){
	    	console.log('Reconnecting...');
	    }
	    this.timer = setTimeout(() => {
	     	this.startConnect();
	    }, this.config.recTimeout);
	  }
	}

	/**
	 * Subscribe 
	 */
	public subscribe(destination:string, callback:any, headers?:Object){
		headers = headers || {};
		return this.stomp.subscribe(destination, function(response){
			let message = JSON.parse(response.body);
			let headers = response.headers;
			callback(message,headers);
		},headers);
	}

	/**
	 * Unsubscribe
	 */
	public unsubscribe(subscription:any){
		subscription.unsubscribe();
	}


	/**
	 * Send 
	 */
	public send(destination:string, body:any, headers?:Object):void {
		let message = JSON.stringify(body);
		headers = headers || {}
		this.stomp.send(destination, headers, message);
	}


	/**
	 * Disconnect stomp
	 */
	public disconnect(): Promise<{}> {
		this.stomp.disconnect(() => {this.resolveDisConPromise(); this.status = 'CLOSED'});
		return this.disconnectPromise;
	}



}