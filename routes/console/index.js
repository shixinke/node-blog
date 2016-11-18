const index = {};

index.index = function(req, res){
    res.render('index/index', {title : '控制台'});
};


module.exports = index;