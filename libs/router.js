const index = require('../routes/index.js');
const consoleIndex = require('../routes/console/index.js');
const consoleRegister = require('../routes/console/register.js');
const consoleLogin = require('../routes/console/login.js');
const consoleUser = require('../routes/console/user.js');
const profile = require('../routes/console/profile.js');

const consoleCategory = require('../routes/console/category.js');
const consolePosts = require('../routes/console/posts.js');
const consoleTags = require('../routes/console/tags.js');
const consoleConfig = require('../routes/console/config.js');
const consolePages = require('../routes/console/pages.js');
const consoleTheme = require('../routes/console/theme.js');
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

    backend.get('/tags', consoleTags.index);
    backend.get('/tags/index', consoleTags.index);
    backend.get('/tags/add', consoleTags.add);
    backend.get('/tags/edit/:id', consoleTags.edit);
    backend.post('/tags/add', consoleTags.insert);
    backend.post('/tags/edit', consoleTags.update);
    backend.post('/tags/delete', consoleTags.delete);

    backend.get('/category', consoleCategory.index);
    backend.get('/category/index', consoleCategory.index);
    backend.get('/category/add', consoleCategory.add);
    backend.get('/category/edit/:id', consoleCategory.edit);
    backend.post('/category/add', consoleCategory.insert);
    backend.post('/category/edit', consoleCategory.update);
    backend.post('/category/delete', consoleCategory.delete);

    backend.get('/config', consoleConfig.options);
    backend.get('/config/index', consoleConfig.index);
    backend.get('/config/options', consoleConfig.options);
    backend.get('/config/add', consoleConfig.add);
    backend.get('/config/edit/:id', consoleConfig.edit);
    backend.post('/config/add', consoleConfig.insert);
    backend.post('/config/edit', consoleConfig.update);
    backend.post('/config/delete', consoleConfig.delete);
    backend.post('/config/options', consoleConfig.save);

    backend.get('/posts', consolePosts.index);
    backend.get('/posts/index', consolePosts.index);
    backend.get('/posts/add', consolePosts.add);
    backend.get('/posts/edit/:id', consolePosts.edit);
    backend.post('/posts/add', consolePosts.insert);
    backend.post('/posts/edit', consolePosts.update);
    backend.post('/posts/delete', consolePosts.delete);

    backend.get('/pages', consolePages.index);
    backend.get('/pages/index', consolePages.index);
    backend.get('/pages/add', consolePages.add);
    backend.get('/pages/edit/:id', consolePages.edit);
    backend.post('/pages/add', consolePages.insert);
    backend.post('/pages/edit', consolePages.update);
    backend.post('/pages/delete', consolePages.delete);

    backend.get('/theme', consoleTheme.index);
    backend.get('/theme/index', consoleTheme.index);
    backend.post('/theme/add', consoleTheme.insert);
    backend.post('/theme/update', consoleTheme.update);
    backend.post('/pages/delete', consoleTheme.delete);
};