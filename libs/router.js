const index = require('../routes/index.js');
module.exports = function(app){
    app.get('/', index.index);
};