var abc = require('./data5.json');
console.log(abc);
obj= abc.events;
// console.log(abc.length);
for (i = 0; i < obj.length; i++) {
    if (obj[i].Job == 0)
        {obj[i]["eventColor"] = "#83dab0	";
        console.log(obj[i].eventColor);}
    if (obj[i].Job == 1)
        obj[i]["eventColor"] = "#e79ee3";
    if (obj[i].Job == 2)
        obj[i]["eventColor"] = "#aad982";
    if (obj[i].Job == 3)
        obj[i]["eventColor"] = "#aad982";
    if (obj[i].Job == 4)
        obj[i]["eventColor"] = "#dfc36b";
    if (obj[i].Job == 5)
        obj[i]["eventColor"] = "#83c3ea";
    if (obj[i].Job == 6)
        obj[i]["eventColor"] = "#ef9f78";
    if (obj[i].Job == 7)
        obj[i]["eventColor"] = "#79d9d7";
    if (obj[i].Job == 8)
        obj[i]["eventColor"] = "#e9a6ba";
    if (obj[i].Job == 9)
        obj[i]["eventColor"] = "#d7c89a";
}
abc.events=obj;

const fs = require('fs');

var jsonContent = JSON.stringify(abc);

fs.writeFile("data.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});