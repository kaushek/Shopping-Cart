const { json } = require("express");
const express = require("express");
let app = new express();
var cartData = [];
var result = 0

app.post("/", function(req, res) {
  res.send(result.toString());
});

app.get("/", function(req, res) {
  res.send(cartData);
});



let port = 8080;
app.listen(port, function() {
    var request = require('request');
    request.get({
      url: 'https://nalinindika90-eval-prod.apigee.net/catalog-reader/get-catalog?apikey=1hUf1UjGYKXYZA1cNExgcgbqYGhh8Cl8',
     // url: 'http://34.123.46.214',
      json: true,
     // headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        // data is already parsed as JSON:
        console.log(data);
       // var resoponse = JSON.parse(res);
        var price = 0;
        var cartArray = [];
        for(var items in data.items){
          var key = Object.keys(data.items[items]);
          var value = Object.values(data.items[items]);
          if (value[0] == "ToothBrush" || value[0]== "soap"){
            price = parseFloat(value[1]) + price;
            cartArray.push(data.items[items]);
          }
        }

        cartData = {  
          "OrderId": Math.floor(Math.random() * 10000),
          "Items": JSON.parse(JSON.stringify(cartArray)),
          "TotalPrice": price,
          "PaymentMethod": "card"
        };

        var BillingData = {
          "userId": (Math.floor(Math.random() * 10000)).toString(),
          "items": JSON.parse(JSON.stringify(cartArray)),
          "paymentMethod": "credit-card"
        };
       
        console.log(BillingData);
        request.post({
           url: 'https://umrfirdausi-eval-prod.apigee.net/api/billing-svc/generate-invoice?apikey=ODsnKFJAj6j1ZcZuxd5T7KLMrsidUtTG',
           json: true,
           body: BillingData
           
         },
         function(error, response, user){        
           console.log(response.statusCode);
           if (response.statusCode == 200)
           {
             //call put order
             request(
              { method: 'PUT'
              , uri: 'https://nalinindika90-eval-prod.apigee.net/order-persistor/put-order?apikey=AE4qCAAOeMflzIfniY3qaSBInVHvMGMa'
              , multipart:
                [ { 'content-type': 'application/json'
                  ,  body: JSON.stringify( {
                      "user_id": Math.floor(Math.random() * 10000),
                      "items": "ToothBrush,soap",
                      "total_price": price
                    })
                  }          
                ]
              }
            , function (error, response, body) {        
                  console.log(response.statusCode);                    
              }
            )
           }
         }
       )

       

       
     
      }
  });
  var num1 = Number(1);
  var num2 = Number(2);
   
  result = num1 + num2 ;
   

var clientServerOptions = {
   uri: 'http://35.193.132.159/',
   body: JSON.stringify(result),
   method: 'POST',
   headers: {
       'Content-Type': 'application/json'
   }
}
request(clientServerOptions, function (error, response) {
   console.log(response.statusCode);
   return;
});
});

