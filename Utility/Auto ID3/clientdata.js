const fs = require("fs");
const qs = require("qs"); //had to first run npm install --save qs on cmd prompt
const url = require("url");
const nodeid3 = require("node-id3");

exports.getClientData = function(pathname, request){
    if(pathname == "retag"){
        var files = fs.readdirSync("./Music");
        var path = "./Music";
        
        var loop = (arr) => {
            console.log(path);
            for(item in arr){
                console.log("Full filename: " + arr[item]);
                let ext = arr[item].substr(-3);
                console.log("Ext: " + ext);
                if(ext != "wav" && ext != "mp3"){
                    if(ext == "jpg" || ext == "jpeg" || ext == "png") continue;
                    console.log(arr[item] + " is a folder");
                    path += "/" + arr[item];
                    var items = fs.readdirSync(path);
                    loop(items);
                    continue;
                }
                let filename = arr[item].substring(0, arr[item].length - 4);
                console.log("Filename: " + filename);
                let fileitems = filename.split(" - ");
                console.log(fileitems);

                var tags = {
                    title: fileitems[1],
                    artist: fileitems[0]
                }
                let success = nodeid3.write(tags, path + "/" + arr[item]);
                if(success) continue;
            }
            console.log(path);
            console.log(path.length);
            for(let i = (path.length - 1); i > 0; i--){
                if(path[i] == "/"){
                    path = path.substring(0, i);
                    break;
                }
            }
            console.log("DONE ------------------- " + path);
        }
        loop(files);
    }
    return "";
}

function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}