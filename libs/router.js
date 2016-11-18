const index = require('../routes/index.js');
const consoleIndex = require('../routes/console/index.js');
const consoleRegister = require('../routes/console/register.js');
const consoleLogin = require('../routes/console/login.js');
const consoleUser = require('../routes/console/user.js');
const profile = require('../routes/console/profile.js');
module.exports = function(app, backend){
    app.get('/', index.index);


    backend.get('/', consoleIndex.index);
    backend.get('/index', consoleIndex.index);
    backend.get('/register', consoleRegister.index);
    backend.post('/register', consoleRegister.register);
    backend.get('/login', consoleLogin.index);
    backend.post('/login/checkLogin', consoleLogin.checkLogin);

    backend.get('/user', consoleUser.index);
    backend.get('/user/index', consoleUser.index);
    backend.get('/user/add', consoleUser.add);
    backend.get('/user/edit/:id', consoleUser.edit);
    backend.post('/user/add', consoleUser.insert);
    backend.post('/user/edit', consoleUser.update);
    backend.post('/user/delete', consoleUser.delete);

    backend.get('/profile/index', profile.index);
    backend.get('/profile/password', profile.password);
    backend.post('/profile/index', profile.resetProfile);
    backend.post('/profile/password', profile.resetPassword);
    backend.post('/profile/avatar', profile.avatar);
};