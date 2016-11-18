module.exports = {
    database : {
        host : 'localhost',
        port : 3306,
        dbname : 'nodeblog',
        user:'shixinke',
        password:'info@shixinke.com',
        charset:'utf8',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    },
    security : {
        salt:'shixinke@nodeblog',
        sessionSecret:'shixinke',
        withoutLogin:['/login', '/register', '/login/checkLogin']
    }
};