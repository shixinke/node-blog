module.exports = function(req, res){
    if(req.query.action === 'uploadimage'){

        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png

        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = 'yourpath';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    else if (req.query.action === 'listimage'){
        var dir_url = 'your img_dir'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    else if(req.query.action == 'config') {
        res.setHeader('Content-Type', 'application/json');
        const conf = require('../conf/ueditor.json');
        res.json(conf);
    }
    else {
        res.send(req.query.action);
    }
};