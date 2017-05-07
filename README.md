# ng2-STOMP-Over-WebSocket
STOMP Over WebSocket service for angular2

Competible with: angular4 and ionic3

[Website](http://devsullo.com/github/angular2-stomp-over-websocket-service/) 


## 3 step of installation

1) npm i --save stompjs
2) npm i --save sockjs-client
3) npm i --save ng2-stomp-service


## Setup

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

### Fast usage example

```javascript
import { StompService } from 'ng2-stomp-service';

private subscription : any;

constructor(stomp: StompService) {

  //configuration
  stomp.configure({
    host:'test.com',
    debug:true,
    queue:{'init':false}
  });
  
  //start connection
  stomp.startConnect().then(() => {
    stomp.done('init');
    console.log('connected');
    
    //subscribe
    this.subscription = stomp.subscribe('/destination', this.response});
    
    //send data
    stomp.send('destionation',{"data":"data"});
    
    //unsubscribe
    this.subscription.unsubscribe();
    
    //disconnect
    stomp.disconnect().then(() => {
      console.log( 'Connection closed' )
    })
    
  });
 

}

//response
public response = (data) => {
  console.log(data)
}
  
```

## The Queue

When your application is going to scale the 'fast usage example' is not for you.. but it's helpful for beginning.

When you have routes and different actions in your application you will need to use 'queue' of subscriptions with ```after() ``` and ```done()``` methods.

First create queue of subscriptions. The first one 'init' is required then we can add other queue for example 'user' and assign it as false.

```javascript
  stomp.configure({
    host:'test.com',
    debug:true,
    queue:{'init':false,'user':false}
  });
```

When connection established we have to call ```done()``` methdod with 'init' parameter. 
```javascript
 stomp.startConnect().then(() => {
    stomp.done('init');
 })
```

Now we can use ```after() ``` method in different components and classes. Which checks continuously if specified queue have been done.
```javascript
  stomp.after('init').then(()=>{
    stomp.subscribe('user',(data)=>{
    
      //here we done our queue
      stomp.done('user');
      
    })
  })
```

As you can see we subscribed 'user' destination when 'init' queue has been complated. As you understand you can done your queue list when you want.. If some component needs user information you have to use following code

```javascript
  stomp.after('user').then(()=>{
    console.log('do something')
  })
```



## Methods
```javascript
  /**
   * Stomp configuration.
   * @param {object} config: a configuration object.
   *                 {host:string} websocket endpoint
   *                 {headers?:Object} headers (optional)
   *                 {heartbeatIn?: number} heartbeats out (optional)
   *                 {heartbeatOut?: number} heartbeat in (optional)
   *                 {debug?:boolean} debuging (optional)
   *                 {recTimeout?:number} reconnection time (ms) (optional)
   *                 {queue:Object} queue object
   *                 {queueCheckTime?:number} queue cheking Time (ms) (optional)
   */
  stomp.configure();
  
  /**
   * Start connection
   * @return {Promise} if resolved
   */
  stomp.startConnect()
  
  /**
   * Subscribe.
   * @param {string} destination: subscibe destination.
   * @param {Function} callback(message,headers): called after server response.
   * @param {object} headers: optional headers.
   */
  stomp.subscribe();
  
  /**
   * Send message.
   * @param {string} destination: send destination.
   * @param {object} body: a object that sends.
   * @param {object} headers: optional headers.
   */
  stomp.send();
  
  /**
   * Unsubscribe subscription.
   */
  this.subscription.unsubscribe();

  /**
   * Disconnect
   * @return {Promise} if resolved
   */
  stomp.disconnect()
  
  /**
   * After specified subscription queue.
   * @param {string} name: queue name.
   * @return {Promise} if resolved
   */
  stomp.after()
  
  /**
   * Done specified subscription queue.
   * @param {string} name: queue name.
   */
  stomp.done()
  
  /**
   * Turn specified subscription queue on pending mode
   * @param {string} name: queue name.
   */
  stomp.pending()

```

