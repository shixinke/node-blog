const posts = {};

posts.tag = function(req, res){
    const tag = req.params.tag;
    const page = req.params.page;
    console.log('tag');
    console.log(page);
    res.send(tag);
};

posts.date = function(req, res){
    const year = req.params.year;
    const month = req.params.month;
    const page = req.params.page;
    console.log('date');
    console.log(page);
    res.send(year+':'+month);
};

posts.detail = function(req, res){
    const alias = req.params.alias;
    console.log('detail');
    res.send(alias);
};

posts.category = async function(req, res){
    console.log(req.params);
    console.log('category');
    res.send(req.params[0]);
};

posts.pages = function(req, res){
    const alias = req.params.alias;

    console.log(page);
    res.send(alias);
};


module.exports = posts;