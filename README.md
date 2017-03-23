# ng2-STOMP-Over-WebSocket
STOMP Over WebSocket service for angular2

[Website](http://devsullo.com/github/angular2-stomp-over-websocket-service/) 


## 3 step of installation

1) npm i --save stompjs
2) npm i --save sockjs-client
3) npm i --save ng2-stomp-service


## Example of Usage

### In -> typings.d.ts
Add `stompjs` and `sockjs-client` module declaration

```javascript
declare module 'stompjs';
declare module 'sockjs-client';
```

### In -> app.module.ts

```javascript
import { StompService } from 'ng2-stomp-service';

@NgModule({
  ...
  providers: [StompService]
})
```

### In -> app.components.ts

```javascript
import { StompService } from 'ng2-stomp-service';

private wsConf = {
  host:'test.com',
  debug:true
}
private subscription : any;

constructor(stomp: StompService) {

  /**
   * Stomp configuration.
   * @param {object} config: a configuration object.
   *                 {host:string} websocket endpoint
   *                 {headers?:Object} headers (optional)
   *                 {heartbeatIn?: number} heartbeats out (optional)
   *                 {heartbeatOut?: number} heartbeat in (optional)
   *                 {debug?:boolean} debuging (optional)
   *                 {recTimeout?:number} reconnection time (ms) (optional)
   */
  stomp.configure(this.wsConf);
  
  /**
   * Start connection
   * @return {Promise} if resolved
   */
  stomp.startConnect().then(() => {
    console.log('connected');
    
    /**
     * Subscribe.
     * @param {string} destination: subscibe destination.
     * @param {Function} callback(message,headers): called after server response.
     * @param {object} headers: optional headers.
     */
    this.subscription = stomp.subscribe('/destination', this.response});
    
    /**
     * Send message.
     * @param {string} destination: send destination.
     * @param {object} body: a object that sends.
     * @param {object} headers: optional headers.
     */
    stomp.send('destionation',{"data":"data"});
    
    /**
     * Unsubscribe subscription.
     */
    this.subscription.unsubscribe();
    
    /**
     * Disconnect
     * @return {Promise} if resolved
     */
    stomp.disconnect().then(() => {
      console.log( 'Connection closed' )
    })
    
  });
 

}

//Response
public response = (data) => {
  console.log(data)
}
  
  
```
