// https://www.bryntum.com/examples/scheduler/dependencies/data/data.json

var data = require("./data5.json")

temp = data.events;

for (i = 0; i < temp.length; i++) {
    temp[i]["id"] = temp[i].name;
    delete temp[i]._id;
    delete temp[i].et_Min;
    delete temp[i].st_Min;
    delete temp[i].ET;
    delete temp[i].ST;
}
data.events = temp;
temp = data.events;

var dependencies = [{
    id: 0,
    from: "",
    to: ""
}];
var index = 0;
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 9; j++) {
        j = parseInt(j);
        dependencies[index] = {
            id: index,
            from: 'J' + i + ' ' + 'O' + j,
            to: 'J' + i + ' ' + 'O' + (j + 1)
        }
        index = index + 1;
    }
}
// console.log(dependencies);

data.dependencies = dependencies;


const fs = require('fs');

var jsonContent = JSON.stringify(data);

fs.writeFile("data.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});