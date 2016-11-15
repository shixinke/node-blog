const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const router = require('./libs/router.js')

const app = express();

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', handlebars({extname:'.html', defaultLayout:'layout.html'}));

app.use(express.static(path.join(__dirname, 'public')));

router(app);

app.use(function(err, req, res){
    res.render('error/error', {err : err})
});



app.listen(3000);
