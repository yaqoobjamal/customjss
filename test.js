var abc = require('./data3.json');
console.log(abc);
obj= abc.events;
// console.log(abc.length);
for (i = 0; i < obj.length; i++) {
    if (obj[i].Job == 0)
        {obj[i]["eventColor"] = "#698fca	";
        console.log(obj[i].eventColor);}
    if (obj[i].Job == 1)
        obj[i]["eventColor"] = "#bba432";
    if (obj[i].Job == 2)
        obj[i]["eventColor"] = "#7cb9eb";
    if (obj[i].Job == 3)
        obj[i]["eventColor"] = "#5cab47";
    if (obj[i].Job == 4)
        obj[i]["eventColor"] = "#b961b8";
    if (obj[i].Job == 5)
        obj[i]["eventColor"] = "#4aaa86";
    if (obj[i].Job == 6)
        obj[i]["eventColor"] = "#6bbaff";
    if (obj[i].Job == 7)
        obj[i]["eventColor"] = "#948a4c";
    if (obj[i].Job == 8)
        obj[i]["eventColor"] = "#c35f88";
    if (obj[i].Job == 9)
        obj[i]["eventColor"] = "#cc6531";
}
abc.events=obj;

const fs = require('fs');

var jsonContent = JSON.stringify(abc);

fs.writeFile("data4.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});