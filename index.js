var app  = require('./setup.js');

const port = process.env.PORT || 4000
app.listen(port);
console.log('App is listening on %d port', port);