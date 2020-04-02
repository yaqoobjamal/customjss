// import {Scheduler} from '../../build/scheduler.module.js'
import { DateHelper, WidgetHelper, Scheduler, AjaxHelper, DomClassList } from '../../build/scheduler.module.js?439960'
import shared from '../_shared/shared.module.js';

// let scheduler;




var colorArr = ["#2a7b60", "#5e63e2", "#339d6c", "#3d44a7",
    "#3fa398",
    "#5f82e2",
    "#4796c2",
    "#3f4481",
    "#8181c4",
    "#3d67a2"]

//Return JSON obj of on click on any event
function currentOp(job, currentOperation, schedule) {

    var currentOp = null
    for (let index = 0; index < schedule.length; index++) {
        if (schedule[index].Operation == parseInt(currentOperation) && schedule[index].Job == job) {
            currentOp = schedule[index]
            break;
        }
    }
    return currentOp
}
//Return JSON of next op.
function nextOp(job, currentOperation, schedule) {

    var tempNextOp = parseInt(currentOperation) + 1

    var nextOperation = null;
    for (let index = 0; index < schedule.length; index++) {
        if (schedule[index].Operation == parseInt(currentOperation) + 1 && schedule[index].Job == job) {
            nextOperation = schedule[index]
            break;
        }

    }
    return nextOperation
}
//Return JSON of next machine
function nextMachine(job, currentOperation, schedule) {
    var current = null;
    // console.log('Current op recieved by api ->'+currentOperation)
    // tempNextOp=parseInt(currentOperation)+1
    // console.log('Next Op ->'+tempNextOp)
    var nextMachine = null
    for (let index = 0; index < schedule.length; index++) {
        if (schedule[index].Operation == parseInt(currentOperation) && schedule[index].Job == job) {
            current = schedule[index]
            //Just Checking if I have the correct info required.
            // console.log(current);
            for (let index = 0; index < schedule.length; index++) {

                if (schedule[index].Machine == parseInt(current.Machine) && schedule[index].machine_index == current.machine_index + 1) {
                    nextMachine = schedule[index]
                    break;
                }

            }
            break;
        }

    }

    return nextMachine
}

//Returns all Dependents from
function findNextDependents(job, op, schedule, varTemp, callback) {
    callback();
}

function finalCallback(someRandomText, callback) {
    console.log(someRandomText);
    callback();
}

var scheduleTempx = []
AjaxHelper.get('data5.json', { parseJson: true }).then(response => {

    const data = response.parsedJson;
    scheduleTempx = data.events

    console.log(scheduleTempx);

    if (data) {
        scheduler.resources = data.resources;
        scheduler.events = data.events;
    }


    //For coloring --Kindly change it
    // for (let index = 0; index < data.resources.length; index++) {
    //     scheduler.resourceStore.getAt(index).eventColor = colorArr[index]
    //     // console.log(scheduler.resourceStore.getAt(index).borderColor)

    //     // console.log(scheduler.resourceStore.getAt(index).eventColor,scheduler.resourceStore.getAt(index).borderColor)
    // }

    scheduler.unmaskBody();
});


WidgetHelper.append([
    {
        type: 'textfield',
        id: 'filterByName',
        icon: 'b-fa b-fa-filter',
        cls: 'b-bright',
        placeholder: 'Find tasks by name',
        clearable: true,
        keyStrokeChangeDelay: 100,
        triggers: {
            filter: {
                align: 'start',
                cls: 'b-fa b-fa-filter'
            }
        },
        onChange: ({ value }) => {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            scheduler.eventStore.filter(event => event.name.match(new RegExp(value, 'i')));
        }
    },
    {
        type: 'textfield',
        id: 'highlight',
        cls: 'b-bright',
        placeholder: 'Highlight tasks',
        // clearable: true,
        keyStrokeChangeDelay: 100,
        triggers: {
            filter: {
                align: 'start',
                cls: 'b-fa b-fa-search'
            }
        },

        // HIGHLIGHT TASK INPUT ---> TEXTBOX 
        onChange: ({ value }) => {
            scheduler.eventStore.forEach(task => {
                const taskClassList = new DomClassList(task.cls);
                // console.log(task.cls);
                // console.log(taskClassList);
                const matched = taskClassList['b-match'];
                // console.log(task.name,matched);
                // console.log(typeof taskClassList);

                // console.log(task.name, taskClassList);
                if (task.name.toLowerCase().indexOf(value) >= 0) {
                    if (!matched) {
                        taskClassList.add('b-match');

                    }
                } else if (matched) {
                    taskClassList.remove('b-match');

                }
                task.cls = taskClassList.value;
            });
            // console.log(scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting'));
            scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
        },

    },
    // {
    //     type: 'button',
    //     text: 'click me',
    //     onClick: () => {

    //         scheduler.element.classList.remove('b-highlighting');


    //     }
    // }

], { insertFirst: document.getElementById('tools') || document.body });

var i = 0;
var machinedependent = [];
var taskdependent = [];


const scheduler = new Scheduler({

    appendTo: 'container',
    minHeight: '20em',
    rowHeight: 50,
    // eventStyle: 'plain',
    eventColor: 'red',
    // borderColor:'#483fff',
    // eventStore: {
    //     fields: ['locked']
    // },

    columns: [
        { text: 'Machine', field: 'name', width: 100 }
    ],

    eventStore: {
        // Additional fields added to EventModel
        fields: ['locked']
    },

    features: {
        eventResize: false,
        eventDrag: false,
        filterBar: true,
        stripe: true,
        timeRanges: true,
        eventContextMenu: {
            // Extra items for all events
            items: [
                {
                    text: 'Highlight Job',
                    // icon: 'b-fa b-fa-fw b-fa-arrow-left',
                    cls: 'b-separator',
                    onItem({ eventRecord }) {
                        // console.log(eventRecord.data.name);
                        var jobName = eventRecord.data.name.split(' ')[0].toLowerCase();
                        // console.log("JOB:", jobName);
                        scheduler.eventStore.forEach(task => {
                            // console.log(task.name);
                            // console.log(task.name.toLowerCase().indexOf(eventRecord.data.name.split(' ')[0]));
                            const taskClassList = new DomClassList(task.cls),
                                matched = taskClassList['b-match'];
                            if (task.name.toLowerCase().indexOf(jobName) >= 0) {
                                if (!matched) {
                                    taskClassList.add('b-match');
                                }
                            } else if (matched) {
                                taskClassList.remove('b-match');
                            }
                            task.cls = taskClassList.value;
                        });
                        scheduler.element.classList[jobName.length > 0 ? 'add' : 'remove']('b-highlighting');
                        // scheduler.element.classList['add']('b-highlighting');

                        // eventRecord.locked = true
                        // console.log(eventRecord.data.name);
                    }
                },

                {
                    text: 'Resource Dependency',
                    icon: 'b-fa b-fa-fw b-fa-flag',

                    onItem({ eventRecord }) {

                        // window.alert("Machine Dependent");
                        var x = eventRecord.machine_index;
                        console.log(x);
                        var temp = nextMachine(eventRecord.Job, eventRecord.Operation, scheduleTempx);
                        machinedependent.push(temp);
                        for (i = 1; i < 10 - x; i++) {
                            temp = nextMachine(temp.Job, temp.Operation, scheduleTempx);
                            machinedependent.push(temp);
                        }
                        console.log(machinedependent);


                        var eventsToHighlight = []
                        //Get total elements of DOM
                        var totalEventsOnDOM = scheduler.eventStore.records

                        console.log(totalEventsOnDOM[0].Job);

                        for (var i = 0; i < machinedependent.length - 1; i++) {
                            for (var j = 0; j < totalEventsOnDOM.length; j++) {
                                if (machinedependent[i].Job == totalEventsOnDOM[j].Job && machinedependent[i].Operation == totalEventsOnDOM[j].Operation) {
                                    eventsToHighlight.push(totalEventsOnDOM[j])
                                }
                            }
                        }


                        for (var i = 0; i < eventsToHighlight.length; i++) {
                            const taskClassList = new DomClassList(eventsToHighlight[i].cls);

                            const matched = taskClassList['b-match'];

                            var t1 = eventsToHighlight[i].Job; var t1 = t1.toString()
                            var t2 = eventsToHighlight[i].Operation; var t2 = t2.toString()
                            var combined = 'j' + t1 + 'o' + t2
                            console.log(combined);

                            if (eventsToHighlight[i].name.toLowerCase().indexOf('j' + t1 + ' o' + t2) >= 0) {
                                if (!matched) {
                                    taskClassList.add('b-match');


                                }
                            } else if (matched) {
                                taskClassList.remove('b-match');

                            }
                            eventsToHighlight[i].cls = taskClassList.value;

                        }
                        scheduler.element.classList[1 > 0 ? 'add' : 'remove']('b-highlighting');

                        $(document).keyup(function (e) {
                            if (e.key === "Escape") {
                                // eventsToHighlight[0].cls.remove('b-match')
                                // console.log(eventsToHighlight[0].cls)
                                scheduler.element.classList.remove('b-highlighting')
                            }

                        });





                        eventRecord.flagged = true;
                    }
                },

                {
                    text: 'Job Dependency',
                    icon: 'b-fa b-fa-fw b-fa-flag',

                    onItem({ eventRecord }) {

                        // window.alert("Task dependet");
                        var x = eventRecord.Operation;
                        console.log(x);
                        var temp = nextOp(eventRecord.Job, eventRecord.Operation, scheduleTempx);
                        taskdependent.push(temp);
                        for (i = 1; i < 10 - x; i++) {
                            temp = nextOp(temp.Job, temp.Operation, scheduleTempx);
                            taskdependent.push(temp);
                        }
                        console.log(taskdependent);
                        var eventsToHighlight = []
                        //Get total elements of DOM
                        var totalEventsOnDOM = scheduler.eventStore.records

                        for (var i = 0; i < taskdependent.length - 1; i++) {
                            for (var j = 0; j < totalEventsOnDOM.length; j++) {
                                if (taskdependent[i].Job == totalEventsOnDOM[j].Job && taskdependent[i].Operation == totalEventsOnDOM[j].Operation) {
                                    eventsToHighlight.push(totalEventsOnDOM[j])
                                }
                            }
                        }


                        for (var i = 0; i < eventsToHighlight.length; i++) {
                            const taskClassList = new DomClassList(eventsToHighlight[i].cls);

                            const matched = taskClassList['b-match'];

                            var t1 = eventsToHighlight[i].Job; var t1 = t1.toString()
                            var t2 = eventsToHighlight[i].Operation; var t2 = t2.toString()
                            var combined = 'j' + t1 + 'o' + t2
                            console.log(combined);

                            if (eventsToHighlight[i].name.toLowerCase().indexOf('j' + t1 + ' o' + t2) >= 0) {
                                if (!matched) {
                                    taskClassList.add('b-match');


                                }
                            } else if (matched) {
                                taskClassList.remove('b-match');

                            }
                            eventsToHighlight[i].cls = taskClassList.value;

                        }
                        scheduler.element.classList[1 > 0 ? 'add' : 'remove']('b-highlighting');


                        $(document).keyup(function (e) {
                            if (e.key === "Escape") {
                                // eventsToHighlight[0].cls.remove('b-match')
                                // console.log(eventsToHighlight[0].cls)
                                scheduler.element.classList.remove('b-highlighting')
                            }

                        });


                        eventRecord.flagged = true;
                    }
                }
            ],
            processItems({ eventRecord, items }) {

                //  items.editEvent = items.deleteEvent = true;

                // Prevent menu for "locked" event
                return !eventRecord.locked;
            }
        },
        // eventContextMenu: {
        //     extraItems: [
        //         {
        //             text: 'Highlight Job',
        //             // icon: 'b-fa b-fa-fw b-fa-arrow-left',
        //             cls: 'b-separator',
        //             onItem({eventRecord}) {
        //                 // console.log(eventRecord.data.name);
        //                 var jobName = eventRecord.data.name.split(' ')[0].toLowerCase();
        //                 // console.log("JOB:", jobName);
        //                 scheduler.eventStore.forEach(task => {
        //                     // console.log(task.name);

        //                     // console.log(task.name.toLowerCase().indexOf(eventRecord.data.name.split(' ')[0]));

        //                     const taskClassList = new DomClassList(task.cls),
        //                         matched = taskClassList['b-match'];

        //                     if (task.name.toLowerCase().indexOf(jobName) >= 0) {
        //                         if (!matched) {
        //                             taskClassList.add('b-match');


        //                         }
        //                     } else if (matched) {
        //                         taskClassList.remove('b-match');

        //                     }
        //                     task.cls = taskClassList.value;
        //                 });
        //                 scheduler.element.classList[jobName.length > 0 ? 'add' : 'remove']('b-highlighting');
        //                 // scheduler.element.classList['add']('b-highlighting');


        //                 // eventRecord.locked = true
        //                 // console.log(eventRecord.data.name);
        //             }
        //         }
        //     ],




        //     //---------------------------------Right Click STUFF---------------------------------------------// 
        //     processItems({eventRecord, items}) {
        //         console.log(items);
        //         // items.push({
        //         //     text: 'Lock',
        //         //     icon: 'b-fa b-fa-fw b-fa-ban',
        //         //     cls: 'b-separator',
        //         //     onItem({eventRecord}) {
        //         //         eventRecord.locked = true;
        //         //     }
        //         // });


        //         // return !eventRecord.locked;
        //     }
        // }

    },

    // crudManager: {
    //     autoLoad: true,
    //     transport: {
    //         load: {
    //             url: 'data.json'
    //         }
    //     }
    // },

    startDate:
        new Date(2020, 0, 1, 9),
    endDate:
        new Date(2020, 0, 1, 22),

    viewPreset: 'hourAndDay',
    rowHeight: 50,
    barMargin: 5,

    // eventBodyTemplate: data => `
    //     <div class="b-sch-event-header">${data.headerText}</div>
    //     <div class="b-sch-event-footer">${data.footerText}</div>
    // `,
    // eventRenderer({eventRecord, resourceRecord, tplData}) {
    //     tplData.style = 'background-color:' + resourceRecord.color;
    //
    //     return {
    //         headerText: DateHelper.format(eventRecord.startDate, this.displayDateFormat),
    //         footerText: eventRecord.name || ''
    //     };
    // }

    // eventBodyTemplate: data => `
    //     <div class="b-sch-event-header">${data.headerText}</div>
    //     <div class="b-sch-event-footer">${data.footerText}</div>
    // `,

    eventRenderer({ eventRecord, tplData }) {
        let status = '';
        // And "locked"
        if (eventRecord.locked) {
            tplData.cls.locked = true;
            tplData.iconCls = 'b-fa b-fa-lock';
            tplData.eventColor = 'red';
            status = 'Locked: ';
        }
        // All activities use same icon
        else if (eventRecord.eventType === 'activity') {
            tplData.iconCls = 'b-fa b-fa-clock';
        }
        // And the same for meetings
        else if (eventRecord.eventType === 'meeting') {
            tplData.iconCls = 'b-fa b-fa-calendar';
        }

        return `${status}${eventRecord.name}`;


        // return {
        //     headerText: DateHelper.format(eventRecord.startDate, this.displayDateFormat),
        //     footerText: eventRecord.name || ''
        // };
    }


});

scheduler.maskBody('Loading JSON data');



// scheduler.on('eventclick', function (sch, event) {
//     window.alert("You've clicked on " + event.get('Name') + ' event');
// }); 







scheduler.on({
    eventclick(event) {
        //This depArr is a dummy variable only passing in function because of the parameters
        var depArr = []
        //TempStack is the only stack
        var tempStack = []; var visited = []; var newArr = []
        findNextDependents(event.eventRecord.Job, event.eventRecord.Operation, scheduleTempx, depArr, function () {
            //eventRecord.Job and eventRecord.Operation 
            tempStack.push(currentOp(event.eventRecord.Job, event.eventRecord.Operation, scheduleTempx))
            while (tempStack.length != 0) {   //trying to implement simple dfs
                var x = tempStack.pop()
                visited.push(x)
                console.log(x);

                var tempNextOp = nextOp(x.Job, x.Operation, scheduleTempx)
                var tempnextMachine = nextMachine(x.Job, x.Operation, scheduleTempx)
                if (tempNextOp != null) {
                    tempStack.push(tempNextOp)
                }
                if (tempnextMachine != null) {
                    tempStack.push(tempnextMachine)
                }
            }
            finalCallback('Final Call', function () {
                //Visited array contains too many duplicates
                console.log("Length of visited -->" + visited.length)

                //Removes the duplicates using Lodash
                newArr = _.uniqWith(visited, _.isEqual)
                console.log("Length of arr -->" + newArr.length)

                //Unique elements in newArr
                console.log(newArr)


                var eventsToHighlight = []
                var NotToHighlight = []
                //Get total elements of DOM
                var totalEventsOnDOM = scheduler.eventStore.records

                for (var i = 0; i < newArr.length; i++) {
                    for (var j = 0; j < totalEventsOnDOM.length; j++) {
                        if (newArr[i].Job == totalEventsOnDOM[j].Job && newArr[i].Operation == totalEventsOnDOM[j].Operation) {
                            eventsToHighlight.push(totalEventsOnDOM[j])
                        }
                        else {
                            NotToHighlight.push(totalEventsOnDOM[j])
                        }

                    }
                }


                console.log('Not to highlight')
                console.log(NotToHighlight[0])
                // console.log(eventsToHighlight)
                //Now highlightning events
                for (var i = 0; i < eventsToHighlight.length; i++) {
                    const taskClassList = new DomClassList(eventsToHighlight[i].cls);

                    const matched = taskClassList['b-match'];

                    var t1 = eventsToHighlight[i].Job; var t1 = t1.toString()
                    var t2 = eventsToHighlight[i].Operation; var t2 = t2.toString()
                    // var combined='j'+t1+'o'+t2
                    // console.log(combined);

                    // console.log(taskClassList)
                    if (eventsToHighlight[i].name.toLowerCase().indexOf('j' + t1 + ' o' + t2) >= 0) {
                        if (!matched) {
                            taskClassList.add('b-match');
                            // console.log(taskClassList)
                        }
                    }
                    else if (matched) {
                        taskClassList.remove('b-match');

                    }
                    eventsToHighlight[i].cls = taskClassList.value;
                }



                for (var i = 0; i < eventsToHighlight.length; i++) {
                    console.log(eventsToHighlight[i].cls)
                }

                //Scheduler.element classlist add or removes the added classes
                scheduler.element.classList[1 > 0 ? 'add' : 'remove']('b-highlighting');


                $(document).keyup(function (e) {
                    if (e.key === "Escape") {
                        // eventsToHighlight[0].cls.remove('b-match')
                        // console.log(eventsToHighlight[0].cls)
                        scheduler.element.classList.remove('b-highlighting')
                    }
                });
                $(document).keyup(function (e) {
                    if (e.key === "a") {
                        eventsToHighlight[0].cls.remove('b-match')
                        console.log(eventsToHighlight[0].cls)
                        scheduler.element.classList.remove('b-highlighting')
                    }

                });
                $(document).keyup(function (e) {
                    if (e.key === "s") {
                        // eventsToHighlight[0].cls.remove('b-match')
                        // console.log(eventsToHighlight[0].cls)
                        scheduler.element.classList.add('b-highlighting')
                    }

                });
            })
        })
    }
});