var express = require('express')
var app = express()

//Define request response in root URL (/)
app.get('/', function (req, res) {
  res.send('Hello World!')
})

//Launch listening server on port 8081
//listen to port 3000 by default
app.listen(process.env.PORT || 3000);
 
module.exports = app;