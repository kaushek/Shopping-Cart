const { json } = require("express");
const express = require("express");
let app = new express();
var cartData = [];
var result = 0;
var itemsObj = [];


app.post("/", function(req, res) { 
  res.send(itemsObj); 
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
            //price = parseFloat(value[1]) + price;
            cartArray.push(data.items[items]);
          }
        }

        itemsObj = {
          "items": JSON.parse(JSON.stringify(cartArray)),
        }
        
        console.log(itemsObj);
        var clientServerOptions = {
         //uri: 'https://kaushekkr-eval-test.apigee.net/shopping-cart-app?apikey=J4CTGobjgB47Io6k6lqSAPZUJmU0SGsl',
          uri: 'http://35.193.132.159/',
          body: JSON.stringify(itemsObj),
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
       }
       request(clientServerOptions, function (error, response) {
          console.log(response.statusCode);
          return;
       });

       request.post({
        url: 'http://kaushekkr-eval-prod.apigee.net/calculate-total-app?apikey=J8bVz4X8Lu8SYohEwO0e3dx9yHJtIAAJ',
        json: true     
      },
      function(error, response, data){         
        console.log(response.statusCode); 
        if (response.statusCode == 200){}
          price = parseFloat(data); 
      }
    )


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

            var orderData = {
              "user_id": (Math.floor(Math.random() * 10000)).toString(),
              "items": "ToothBrush,soap",
              "total_price": price
            }
             
            request.post({
              url: 'https://nalinindika90-eval-prod.apigee.net/order-persistor/put-order?apikey=AE4qCAAOeMflzIfniY3qaSBInVHvMGMa',
              json: true,
              body: orderData 
            },
            function(error, response, user){    
              console.log(response.statusCode); 
            })



           }
         }
       )

       

        
      
      }
  });
    


});


