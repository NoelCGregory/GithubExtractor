const html2json = require("html2json").html2json;
const fs = require("fs");
const tagAr = ["times","unittestresult","counters","testmethod"];
let skipped = 0;
function getTrxData(input){
    skipped = 0;
    let xmlToJson = html2json(input).child;
    //fs.writeFileSync("output.json",JSON.stringify(xmlToJson,null,2))
    let result = getInfo(xmlToJson,xmlToJson.tag);
    const counterIndex = result.findIndex((val) => val.key == "counters");
    result[counterIndex].info["skipped"] = skipped
    result.pop();
    return result;
}
let testName = "";
function getInfo(data,tag){
    let infoAr = [];
    for(let i = 0; i<data.length;i++){
        //Get times from json object
        if(data[i].hasOwnProperty("tag")){
            let indexTag = tagAr.indexOf(data[i].tag);
            if(indexTag != -1){
                let tagName = tagAr[indexTag];
                if(tagName == "unittestresult"){
                    if(data[i].attr.duration == undefined){
                        skipped++;
                        data[i].attr.outcome = "Skipped"
                    }
                    testName = data[i].attr.testName;
                }
                infoAr.push({
                    key:tagName,
                    info:data[i].attr
                });
            }
        }else if(data[i].hasOwnProperty("text")){
                let tagName = tag;
                if(data[i].text.length > 10 && data[i].text.indexOf("\n") != -1){
                    infoAr.push({
                        key:tagName,
                        info:data[i].text,
                        test:testName
                    })
                }
        }

        if(data[i].hasOwnProperty("child")){
            if(data[i].hasOwnProperty("tag")){
                tag = data[i].tag;
            }
            infoAr.push(...getInfo(data[i].child,tag));
        }

    }
    return infoAr;
}

module.exports= {
    getTrxData
}