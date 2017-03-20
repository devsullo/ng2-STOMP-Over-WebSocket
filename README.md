# ng2-STOMP-Over-WebSocket
STOMP Over WebSocket service for angular2


## 3 step of installation

1) npm i stompjs
2) npm i sockjs-client
3) npm i ng2-stomp-service


## Usage example

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
  host:'test.com'
}

constructor(stomp: StompService) {

  //stomp configuration
  stomp.configure(this.wsConf);
  
  //start connection
  stomp.startConnect().then(() => {
    console.log('connected');
    
    //subscribe
    stomp.subscribe('/destination', this.response});
    
    //send message
    stomp.send('destionation',{"data":"data"});
    
    //disconnect
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
