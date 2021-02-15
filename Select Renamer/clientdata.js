const fs = require("fs");
const qs = require("qs"); //had to first run npm install --save qs on cmd prompt
const url = require("url");

exports.getClientData = function(pathname, request){
    if(pathname == "rename"){
        var files = fs.readdirSync("./Music");
        for(item in files){
            var num = (parseInt(files[item].substr(0, 3))).toString();
            var newname = files[item].substr(num.length + 3);
            fs.rename("./Music/" + files[item], "./Music/" + newname, function(err){
                if(err)
                    throw err;
            });
        }
        console.log(files);
    }
    return "";
}

function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}