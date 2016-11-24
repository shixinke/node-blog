const registry = {};

registry.options = {};

registry.set = function(key, value){
    registry.options[key] = value;
};

registry.get = function(key){
    if (!key) {
        return registry.options;
    }
    if (registry.options[key]) {
        return registry.options[key];
    }
    return false;
};

registry.remove = function(key){
    if (registry.options[key]) {
        return delete registry.options[key];
    }
    return false;
};

registry.destory = function(){
    registry.options = {};
};

registry.register = function(obj){
    for (let k in obj) {
        registry.set(k, obj[k]);
    }
};

module.exports = registry;