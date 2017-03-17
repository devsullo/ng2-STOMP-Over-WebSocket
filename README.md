# ng2-STOMP-Over-WebSocket
STOMP Over WebSocket service for angular2


##Installation

1) npm i stompjs
2) npm i sockjs-client
3) npm i ng2-stomp-service


##Usage

###In -> app.module.ts

```javascript
import { StompService } from 'ng2-stomp-service';

@NgModule({
  ...
  providers: [StompService]
})
```

###In -> app.components.ts

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
    stomp.subscribe('destination', this.response);
    
    //send message
    stomp.send('destionation',{"data":"data"});
  });
 

}

//Response
public response = (data) => {
  console.log(data)
}
  
  
```
