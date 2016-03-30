/**
 @name partup.helpers.normalize
 @memberof Partup.helpers
 * based on https://github.com/andrepadez/normalizer
 */
Partup.helpers.normalize = function(origString, keepCase){
    var newString = origString;
    
    for(var char in charMap){
        var rex = new RegExp('[' + charMap[char].toString() + ']', 'g');
        try{
            origString = origString.replace(rex, char);
        } catch(e) {
            console.log('error', origString);
        }
    }
    return keepCase? origString : origString.toLowerCase();
};

var charMap = {
    'a': ['á','Á','à','À','ã','Ã','â','Â','ä','Ä','å','Å','ā','Ā','ą','Ą'],
    'e': ['é','É','è','È','ê','Ê','ë','Ë','ē','Ē','ė','Ė','ę','Ę'],
    'i': ['î','Î','í','Í','ì','Ì','ï','Ï','ī','Ī','į','Į'],
    'l': ['ł', 'Ł'],
    'o': ['ô','Ô','ò','Ò','ø','Ø','ō','Ō','ó','Ó','õ','Õ','ö','Ö'],
    'u': ['û','Û','ú','Ú','ù','Ù','ü','Ü','ū','Ū'],
    'c': ['ç','Ç','č','Č','ć','Ć'],
    's': ['ś','Ś','š','Š'],
    'z': ['ź','Ź','ż','Ż']
};

var normalizeFilter = function(origFilter, model, wholeString, keepCase){
    var schema = model.schema? model.schema.tree.normalized : model;
    var newFilter = {};
    var finalFilter = {};

    var getFilterResult = function(string){
        return wholeString? 
            normalize(string, keepCase) : 
                new RegExp(normalize(string, keepCase), 'i');
    };

    var recurse = function(filter, path, schema){
        for(var key in filter){
            var filterResult;
            if(key in schema){
                var normalized = getPathString(key, path);
                if(typeof filter[key] === 'string'){
                    filterResult = getFilterResult(filter[key]);
                    newFilter[getPathString(key, path) + key] = filterResult;
                } else{
                    path.push(key);
                    recurse(filter[key], path, schema[key]);
                }

            } else {
                newFilter[key] = typeof filter[key] === 'string'? filterResult : filter[key];
            }
        }
        return newFilter;
    };
    finalFilter = recurse(origFilter, [], schema);
    return finalFilter; 
};

var normalizeSort = function(origSort, model){
    var schema = model.schema? model.schema.tree.normalized : model;
    var newSort = {};
    var finalSort = {};

    var recurse = function(sort, path, schema){
        for(var key in sort){
            if(key in schema && !(key in newSort)){
                if(typeof sort[key] !== 'object'){
                    newSort[getPathString(key, path) + key] = sort[key];
                } else{
                    path.push(key);
                    recurse(sort[key], path, schema[key]);
                }

            } else {
                newSort[key] = sort[key];
            }
        }
        return newSort;
    };
    finalSort = recurse(origSort, [], schema);
    return finalSort;
};

var normalizeSearchFields = function(doc, model, keepCase){
    var schema = model.schema? model.schema.tree.normalized : model;
    var recurse = function(doc, normalized, schema){
        var newDoc = {};
        for(var key in doc){
            if(key in schema){
                if(typeof doc[key] === 'object'){
                    var normal = newDoc[key] = {};
                    newDoc[key] = recurse(doc[key], normal , schema[key]);
                } else {
                    newDoc[key] = typeof doc[key] === 'string'? normalize(doc[key], keepCase) : doc[key];
                }
            }
        }
        return newDoc;
    };

    var finalDoc = {normalized: {}};
    for(var key in doc){
        finalDoc[key] = doc[key];
    }
    finalDoc.normalized = recurse(doc, finalDoc.normalized, schema);
    return finalDoc;
};


var getPathString = function(key, path){
    var pathString = 'normalized';
    if(path.length > 0){
        pathString += '.' +  path.join('.');
    }
    pathString += '.';
    return pathString;
};
