const index = {};

index.index = function(req, res){
    const page = req.params.page;
    console.log(page);
    res.render('index/index');
};


module.exports = index;