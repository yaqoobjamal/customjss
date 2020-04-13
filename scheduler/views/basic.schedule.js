import { DateHelper, WidgetHelper, Scheduler, AjaxHelper, DomClassList, EventModel }
    from '../../build/scheduler.module.js?439960'
import shared from '../_shared/shared.module.js';
import { nextOp } from "./functions/nextOp.js"
import { currentOp } from "./functions/currentOp.js"
import { nextMachine } from "./functions/nextMachine.js"
import { findNextDependents, finalCallback } from "./functions/nextDependents.js"
import { resetHighlights } from "./functions/hReset.js"


class EventModelWithPercent extends EventModel {
    static get fields() {
        return [
            { name: 'percentDone', type: 'number', defaultValue: 0 }
        ];
    }
}


var scheduleTempx = []
AjaxHelper.get('data5.json', { parseJson: true }).then(response => {

    const data = response.parsedJson;
    scheduleTempx = data.events
    if (data) {
        scheduler.resources = data.resources;
        scheduler.events = data.events;
    }
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

        onChange: ({ value }) => {
            scheduler.eventStore.forEach(task => {
                const taskClassList = new DomClassList(task.cls);
                const matched = taskClassList['b-match'];
                if (task.name.toLowerCase().indexOf(value) >= 0) {
                    if (!matched) {
                        taskClassList.add('b-match');
                    }
                } else if (matched) {
                    taskClassList.remove('b-match');
                }
                task.cls = taskClassList.value;
            });
            scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
        },

    },
    {
        type: 'button',
        text: 'clear all',
        onClick: () => {
            scheduler.element.classList.remove('b-highlighting');
            resetHighlights(scheduler, scheduler.eventStore.records)
        }
    }
], { insertFirst: document.getElementById('tools') || document.body });

var i = 0;


var tempArr = []
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
    multiEventSelect: true,
    eventSelectionDisabled: false,

    columns: [
        { text: 'Machine', field: 'name', width: 150 }
    ],

    eventStore: {
        // fields: ['locked'],
        modelClass: EventModelWithPercent
    },
    listeners: {
        eventselectionchange(event) {

            if (event.action == 'select') {
                // console.log(event)
                const count = scheduler.selectedEvents.length;
                var t = _.last(scheduler.selectedEvents)
                t.eventStyle = 'hollow'
            }
            else if (event.action=='update')
            {
                // console.log(event.selection[0].Job);
                event.selection[0].eventStyle='hollow';
                event.deselected[0].eventStyle=undefined;
            }
            else if (event.action == 'clear') 
            {
                event.deselected.forEach(element => {
                    element.eventStyle = undefined
                });
            }
        }

    },

    features: {
        eventResize: false,
        eventDrag: false,
        filterBar: true,
        stripe: true,
        group: 'category',
        timeRanges: true,
        contextMenu: {
            headerItems: [
                {
                    text: 'Expand All', icon: 'b-fa-angle-double-down', disabled: true, weight: 200, onItem: () => {
                        scheduler.expandAll()
                        scheduler.features.contextMenu.headerItems[0].disabled = true;
                        scheduler.features.contextMenu.headerItems[1].disabled = false;
                        console.log(scheduler.features.contextMenu)

                    }
                },
                {
                    text: 'Collapse All', icon: 'b-fa-angle-double-up', disabled: false, weight: 200, onItem: () => {
                        scheduler.collapseAll();
                        scheduler.features.contextMenu.headerItems[1].disabled = true;
                        scheduler.features.contextMenu.headerItems[0].disabled = false;


                    }
                }
            ],

            // cellItems: [
            //     {
            //         text: 'Yaqoob jamal', icon: 'fa fa-bus', weight: 200, onItem: () => {

            //             window.alert('Qoobi jani')
            //         }
            //     }
            // ]
        },
        eventContextMenu: {
            items: [
                {
                    text: 'Overall Dependency',
                    icon: 'b-fa b-fa-project-diagram"',
                    onItem({ eventRecord }) {
                        var depArr = []
                        var tempStack = []; var visited = []; var newArr = []
                        findNextDependents(eventRecord.Job, eventRecord.Operation, scheduleTempx, depArr, function () {
                            tempStack.push(currentOp(eventRecord.Job, eventRecord.Operation, scheduleTempx))
                            while (tempStack.length != 0) {
                                var x = tempStack.pop()
                                visited.push(x)
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
                                newArr = _.uniqWith(visited, _.isEqual)
                                var eventsToHighlight = []
                                var NotToHighlight = []
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
                                for (var i = 0; i < eventsToHighlight.length; i++) {
                                    const taskClassList = new DomClassList(eventsToHighlight[i].cls);
                                    const matched = taskClassList['b-match'];
                                    var t1 = eventsToHighlight[i].Job; var t1 = t1.toString()
                                    var t2 = eventsToHighlight[i].Operation; var t2 = t2.toString()
                                    if (eventsToHighlight[i].name.toLowerCase().indexOf('j' + t1 + ' o' + t2) >= 0) {
                                        if (!matched) {
                                            taskClassList.add('b-match');
                                        }
                                    }
                                    else if (matched) {
                                        taskClassList.remove('b-match');

                                    }
                                    eventsToHighlight[i].cls = taskClassList.value;
                                }
                                scheduler.element.classList[1 > 0 ? 'add' : 'remove']('b-highlighting');
                                $(document).keyup(function (e) {
                                    if (e.key === "Escape") {

                                        resetHighlights(scheduler, totalEventsOnDOM)
                                    }
                                });

                            })
                        })
                    }
                },
                {
                    text: 'Resource Dependency',
                    icon: 'b-fa b-fa-project-diagram',
                    onItem({ eventRecord }) {
                        var machinedependent = [];
                        var x = eventRecord.machine_index;
                        var temp = nextMachine(eventRecord.Job, eventRecord.Operation, scheduleTempx);
                        machinedependent.push(temp);
                        for (i = 1; i < 10 - x; i++) {
                            temp = nextMachine(temp.Job, temp.Operation, scheduleTempx);
                            machinedependent.push(temp);
                        }
                        var eventsToHighlight = []
                        var totalEventsOnDOM = scheduler.eventStore.records
                        for (var i = 0; i < machinedependent.length - 1; i++) {
                            for (var j = 0; j < totalEventsOnDOM.length - 1; j++) {
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

                                resetHighlights(scheduler, totalEventsOnDOM)
                            }
                        });
                        eventRecord.flagged = true;
                    }
                },
                {
                    text: 'Highlight Job',
                    icon: 'b-fa b-fa-project-diagram',
                    onItem({ eventRecord }) {
                        var jobName = eventRecord.data.name.split(' ')[0].toLowerCase();
                        scheduler.eventStore.forEach(task => {
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
                        $(document).keyup(function (e) {
                            if (e.key === "Escape") {

                                resetHighlights(scheduler, scheduler.eventStore.records)
                            }
                        });
                    }
                },
                {
                    text: 'Job Dependency',
                    icon: 'b-fa b-fa-project-diagram',
                    onItem({ eventRecord }) {
                        var taskdependent = [];
                        var x = eventRecord.Operation;
                        var temp = nextOp(eventRecord.Job, eventRecord.Operation, scheduleTempx);
                        taskdependent.push(temp);
                        for (i = 1; i < 10 - x; i++) {
                            temp = nextOp(temp.Job, temp.Operation, scheduleTempx);
                            taskdependent.push(temp);
                        }
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

                                resetHighlights(scheduler, totalEventsOnDOM)
                            }
                        });
                        eventRecord.flagged = true;
                    }
                }
            ],
            processItems({ eventRecord, items }) {
                return !eventRecord.locked;
            }
        },

        headerContextMenu: {

            processItems({ items }) {
                items.push(
                    {
                    type: 'textfield',
                    placeholder: 'Highlight tasks',
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

                    onChange: ({ value }) => {
                        scheduler.eventStore.forEach(task => {
                            const taskClassList = new DomClassList(task.cls);
                            const matched = taskClassList['b-match'];
                            if (task.name.toLowerCase().indexOf(value) >= 0) {
                                if (!matched) {
                                    taskClassList.add('b-match');
                                }
                            } else if (matched) {
                                taskClassList.remove('b-match');
                            }
                            task.cls = taskClassList.value;
                        });
                        scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
                    }
                })
            }

        },

        // contextMenu: {
        //     // headerItems: [
        //     //   { text: 'Asad Tariq', icon: 'fa fa-car', weight: 200, onItem : () => {} }
        //     // ],

        //     cellItems: [
        //         {
        //             text: 'Yaqoob jamal', icon: 'fa fa-bus', weight: 200, onItem: () => {

        //                 window.alert('Qoobi jani')
        //             }
        //         }
        //     ]
        // },

        scheduleContextMenu: {
            items: [
                {
                    type: 'textfield',
                    placeholder: 'Highlight tasks',
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

                    onChange: ({ value }) => {
                        scheduler.eventStore.forEach(task => {
                            const taskClassList = new DomClassList(task.cls);
                            const matched = taskClassList['b-match'];
                            if (task.name.toLowerCase().indexOf(value) >= 0) {
                                if (!matched) {
                                    taskClassList.add('b-match');
                                }
                            } else if (matched) {
                                taskClassList.remove('b-match');
                            }
                            task.cls = taskClassList.value;
                        });
                        scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
                    }


                }
            ]
        }




    },
    startDate:
        new Date(2020, 0, 1, 9),
    endDate:
        new Date(2020, 0, 1, 22),

    viewPreset: 'hourAndDay',
    rowHeight: 50,
    barMargin: 5,

    eventRenderer({ eventRecord, tplData }) {
        let status = '';
        if (eventRecord.locked) {
            tplData.cls.locked = true;
            tplData.iconCls = 'b-fa b-fa-lock';
            tplData.eventColor = 'red';
            status = 'Locked: ';
        }
        else if (eventRecord.eventType === 'activity') {
            tplData.iconCls = 'b-fa b-fa-clock';
        }
        else if (eventRecord.eventType === 'meeting') {
            tplData.iconCls = 'b-fa b-fa-calendar';
        }
        return `${status}${eventRecord.name}`;
    },
});

scheduler.maskBody('Loading JSON data');




scheduler.on({
    cellClick(cell) {
        console.log(cell)
    }
});