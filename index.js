const { json } = require("express");
const express = require("express");
let app = new express();

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

        var cartData = {  
          "OrderId": Math.floor(Math.random() * 10000),
          "Items": JSON.parse(JSON.stringify(cartArray)),
          "TotalPrice": price,
          "PaymentMethod": "card"
        };
       // request.post('http://35.193.132.159', {cartData});


        app.get("/", function(req, res) {
        res.send(cartData);
      });
      
      }
  });

});
