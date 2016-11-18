const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./libs/router.js');
const session = require('express-session');
const conf = require('./libs/conf.js');
const helper = require('./libs/helper.js');

const app = express();
const backend = express();

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', handlebars({extname:'.html', defaultLayout:'layout.html'}));
app.set('view cache', false);

backend.set('view engine', 'html');
backend.set('views', path.join(__dirname, 'views', 'console'));
backend.engine('html', handlebars({extname:'.html', layoutsDir:'views/console/layouts', partialsDir:'views/console/partials', defaultLayout:'layout.html', helpers:{
    section:function(name, options){
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    eq: function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    and: function (a, b, options) {
        if (a && b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    or: function (a, b, options) {
        if (a || b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    xif:function(expression, options){
        var result = false;
        try {
            if (expression) {
                result =true;
            }
        } catch(e){
            console.warn('expression error:'+e);
        }
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    }
}}));
backend.set('view cache', false);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret : conf.security.sessionSecret, resave : true, saveUninitialized:false,cookie:{secure:false}}));

/*
backend.use(function(req, res, next){
    let userInfo = req.session.user;
    if ((!userInfo || !userInfo.uid) && !helper.inArray(req.path, conf.security.withoutLogin)) {
        res.redirect('/console/login');
    } else {
        next();
    }
});
*/
app.use('/console', backend);




router(app, backend);



app.listen(3000);
