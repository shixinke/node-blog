const index = {};
const postModel = require('../../models/posts.js');
const tagModel = require('../../models/tags.js');
const os = require('os');


index.index = async function(req, res){
    const data = {};
    const postsStats = await postModel.stats();
    const tagStats = await tagModel.stats();
    data.posts = postsStats;
    data.tags = tagStats;
    data.system = os.type()+' '+os.release();
    data.version = 'Node '+process.version;
    res.render('index/index', {title : '控制台', data: data, userInfo : req.session.user});
};


module.exports = index;