import { DateHelper, WidgetHelper, Scheduler, AjaxHelper, DomClassList, EventModel }
    from '../../build/scheduler.module.js?439960'
import shared from '../_shared/shared.module.js';
import { nextOp } from "./functions/nextOp.js"
import { currentOp } from "./functions/currentOp.js"
import { nextMachine } from "./functions/nextMachine.js"
import { findNextDependents, finalCallback } from "./functions/nextDependents.js"
import { resetHighlights } from "./functions/hReset.js"
import { finalArray, returnHighlighted } from "./functions/returnHighlighted.js"
import {Items} from "./functions/comboItems.js"
import {highlight} from "./functions/highlight.js"




highlight(1);





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
        id: 'highlight',
        style    : 'margin-right: 2em',
        cls: 'b-bright',
        placeholder: 'Highlight Event',
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
        type      : 'slider',
        ref       : 'rowHeight',
        text      : 'Row height',
        showValue : true,
        style    : 'margin-right: 2em',
        min       : 20,
        value: 35,
        cls       : 'b-bright',
        onInput({ value }) {
            scheduler.rowHeight = value;
            barMargin.max       = Math.max(0, (value - 10) / 2);
            scheduler.element.classList[value <= 25 ? 'add' : 'remove']('smallrowheight');
        }
    },



    {
        // width: 100,
        type    : 'button',
        ref     : 'zoomInButton',
        color   : 'b-blue b-raised',
        icon    : 'b-icon b-icon-search-plus',
        tooltip : 'Zoom in',
        onClick() {
            scheduler.zoomIn();
        }
    },
    {
        // width:  100,
        type    : 'button',
        style   : 'margin-right: 1em',
        ref     : 'zoomOutButton',
        color   : 'b-blue b-raised',
        icon    : 'b-icon b-icon-search-minus',
        tooltip : 'Zoom out',
        onClick() {
            scheduler.zoomOut();
        }
    },

    {
        type: 'button',
        color   : 'b-blue b-raised',
        style   : 'margin-right: 1em',
        text: 'Zoom to Fit',
        onClick: () => {
            scheduler.zoomToFit();
        }
    },

    {
        type: 'button',
        text: 'Clear',
        style   : 'margin-right: 1em',
        color   : 'b-blue b-raised',

        onClick: () => {
            scheduler.element.classList.remove('b-highlighting');
            resetHighlights(scheduler, scheduler.eventStore.records)
            //Clears all the selected events
            scheduler.clearEventSelection()
        }
    },

    // {
    //     type: 'textfield',
    //     id: 'filterByName',
    //     icon: 'b-fa b-fa-filter',
    //     cls: 'b-bright',
    //     placeholder: 'Find Event',
    //     clearable: true,
    //     keyStrokeChangeDelay: 100,
    //     triggers: {
    //         filter: {
    //             align: 'start',
    //             cls: 'b-fa b-fa-filter'
    //         }
    //     },
    //     onChange: ({ value }) => {
    //         value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    //         scheduler.eventStore.filter(event => event.name.match(new RegExp(value, 'i')));
    //     }
    // },



    {
        // height:40,
        style: 'margin-right:0em',
        type: 'combo',
        text: 'Push ',
        id: 'timeDropDown',
        placeholder:'Select time period',
        disabled: true,
        items: Items,
    },

    {
        color   : 'b-blue b-raised',
        style: 'margin-right:2em',
        type: 'button',
        icon: 'b-fa-arrow-right',
        id: 'cla',
        onClick: () =>
        {
            // console.log(WidgetHelper.getById('push').record.id);
            var selectedTime=WidgetHelper.getById('timeDropDown').record.value
            for (let index = 0; index < scheduler.selectedEvents.length; index++)
            {
                scheduler.selectedEvents[index].startDate = DateHelper.add(scheduler.selectedEvents[index].startDate, selectedTime, 'minutes');
            }
        }
    }
], { insertFirst: document.getElementById('tools') || document.body });

var i = 0;


var tempArr = []
const scheduler = new Scheduler({
    appendTo: 'container',
    minHeight: '20em',
    // rowHeight: 30,
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
                WidgetHelper.getById('timeDropDown').disabled = false
                WidgetHelper.getById('cla').disabled = false

            }
            else if (event.action == 'update') {
                event.selection[0].eventStyle = 'hollow';
                event.deselected[0].eventStyle = undefined;
                WidgetHelper.getById('timeDropDown').disabled = false
                WidgetHelper.getById('cla').disabled = false
            }
            else if (event.action == 'clear') {
                event.deselected.forEach(element => {
                    element.eventStyle = undefined
                });
                WidgetHelper.getById('timeDropDown').disabled = true;
                WidgetHelper.getById('cla').disabled = true;
            }
        }
    },

    features: {
        // autoFitOnLoad: true,
        eventResize: false,
        eventDrag: false,
        filterBar: true,
        stripe: true,
        group: 'category',
        timeRanges: true,
        contextMenu: {
            headerItems: [
                {
                    text: 'Expand All', icon: 'b-fa-arrow-down', disabled: false, weight: 200, onItem: () => {
                        scheduler.expandAll()
                        // scheduler.features.contextMenu.headerItems[0].disabled = true;
                        // scheduler.features.contextMenu.headerItems[1].disabled = false;
                        // console.log(scheduler)

                    }
                },
                {
                    text: 'Collapse All', icon: 'b-fa b-fa b-fa-arrow-up', disabled: false, weight: 200, onItem: () => {
                        scheduler.collapseAll();
                        // scheduler.features.contextMenu.headerItems[1].disabled = true;
                        // scheduler.features.contextMenu.headerItems[0].disabled = false;


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
                    text: 'Highlight Dependents',
                    icon: 'b-fa b-fa-project-diagram"',
                    onItem({ eventRecord }) {
                        var boolTemp = true;
                        returnHighlighted(eventRecord, scheduleTempx, boolTemp)
                    }
                },

                // {
                //     text: 'Resource Dependency',
                //     icon: 'b-fa b-fa-project-diagram',
                //     onItem({ eventRecord }) {
                //         var machinedependent = [];
                //         var x = eventRecord.machine_index;
                //         var temp = nextMachine(eventRecord.Job, eventRecord.Operation, scheduleTempx);
                //         machinedependent.push(temp);
                //         for (i = 1; i < 10 - x; i++) {
                //             temp = nextMachine(temp.Job, temp.Operation, scheduleTempx);
                //             machinedependent.push(temp);
                //         }
                //         var eventsToHighlight = []
                //         var totalEventsOnDOM = scheduler.eventStore.records
                //         for (var i = 0; i < machinedependent.length - 1; i++) {
                //             for (var j = 0; j < totalEventsOnDOM.length - 1; j++) {
                //                 if (machinedependent[i].Job == totalEventsOnDOM[j].Job && machinedependent[i].Operation == totalEventsOnDOM[j].Operation) {
                //                     eventsToHighlight.push(totalEventsOnDOM[j])
                //                 }
                //             }
                //         }
                //         for (var i = 0; i < eventsToHighlight.length; i++) {
                //             const taskClassList = new DomClassList(eventsToHighlight[i].cls);
                //             const matched = taskClassList['b-match'];
                //             var t1 = eventsToHighlight[i].Job; var t1 = t1.toString()
                //             var t2 = eventsToHighlight[i].Operation; var t2 = t2.toString()
                //             var combined = 'j' + t1 + 'o' + t2
                //             if (eventsToHighlight[i].name.toLowerCase().indexOf('j' + t1 + ' o' + t2) >= 0) {
                //                 if (!matched) {
                //                     taskClassList.add('b-match');
                //                 }
                //             } else if (matched) {
                //                 taskClassList.remove('b-match');
                //             }
                //             eventsToHighlight[i].cls = taskClassList.value;
                //         }
                //         scheduler.element.classList[1 > 0 ? 'add' : 'remove']('b-highlighting');
                //
                //         $(document).keyup(function (e) {
                //             if (e.key === "Escape") {
                //
                //                 resetHighlights(scheduler, totalEventsOnDOM)
                //             }
                //         });
                //         eventRecord.flagged = true;
                //     }
                // },
                // ,
                // {
                //     text: 'Job Dependency',
                //     icon: 'b-fa b-fa-project-diagram',
                //     onItem({ eventRecord }) {
                //         var taskdependent = [];
                //         var x = eventRecord.Operation;
                //         var temp = nextOp(eventRecord.Job, eventRecord.Operation, scheduleTempx);
                //         taskdependent.push(temp);
                //         for (i = 1; i < 10 - x; i++) {
                //             temp = nextOp(temp.Job, temp.Operation, scheduleTempx);
                //             taskdependent.push(temp);
                //         }
                //         var eventsToHighlight = []
                //         //Get total elements of DOM
                //         var totalEventsOnDOM = scheduler.eventStore.records
                //
                //         for (var i = 0; i < taskdependent.length - 1; i++) {
                //             for (var j = 0; j < totalEventsOnDOM.length; j++) {
                //                 if (taskdependent[i].Job == totalEventsOnDOM[j].Job && taskdependent[i].Operation == totalEventsOnDOM[j].Operation) {
                //                     eventsToHighlight.push(totalEventsOnDOM[j])
                //                 }
                //             }
                //         }
                //         for (var i = 0; i < eventsToHighlight.length; i++) {
                //             const taskClassList = new DomClassList(eventsToHighlight[i].cls);
                //             const matched = taskClassList['b-match'];
                //             var t1 = eventsToHighlight[i].Job; var t1 = t1.toString()
                //             var t2 = eventsToHighlight[i].Operation; var t2 = t2.toString()
                //             var combined = 'j' + t1 + 'o' + t2
                //             if (eventsToHighlight[i].name.toLowerCase().indexOf('j' + t1 + ' o' + t2) >= 0) {
                //                 if (!matched) {
                //                     taskClassList.add('b-match');
                //                 }
                //             } else if (matched) {
                //                 taskClassList.remove('b-match');
                //             }
                //             eventsToHighlight[i].cls = taskClassList.value;
                //
                //         }
                //         scheduler.element.classList[1 > 0 ? 'add' : 'remove']('b-highlighting');
                //
                //         $(document).keyup(function (e) {
                //             if (e.key === "Escape") {
                //
                //                 resetHighlights(scheduler, totalEventsOnDOM)
                //             }
                //         });
                //         eventRecord.flagged = true;
                //     }
                // },
                {
                    text: 'Select all Dependents',
                    icon: 'b-fa b-fa-project-diagram"',
                    onItem({ eventRecord })
                    {
                        var boolTemp = false;
                        returnHighlighted(eventRecord, scheduleTempx, boolTemp)
                        for (let index = 0; index < finalArray.length; index++)
                        {
                            scheduler.selectEvents(finalArray[index])
                        }
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
                    // {
                    //     type: 'textfield',
                    //     placeholder: 'Highlight tasks',
                    //     cls: 'b-bright',
                    //     placeholder: 'Highlight tasks',
                    //     // clearable: true,
                    //     keyStrokeChangeDelay: 100,
                    //     triggers: {
                    //         filter: {
                    //             align: 'start',
                    //             cls: 'b-fa b-fa-search'
                    //         }
                    //     },
                    //
                    //     onChange: ({ value }) => {
                    //         scheduler.eventStore.forEach(task => {
                    //             const taskClassList = new DomClassList(task.cls);
                    //             const matched = taskClassList['b-match'];
                    //             if (task.name.toLowerCase().indexOf(value) >= 0) {
                    //                 if (!matched) {
                    //                     taskClassList.add('b-match');
                    //                 }
                    //             } else if (matched) {
                    //                 taskClassList.remove('b-match');
                    //             }
                    //             task.cls = taskClassList.value;
                    //         });
                    //         scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
                    //     }
                    // }
                    )
            }

        },
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
        new Date(2020, 0, 10, 22),

    viewPreset: 'weekAndDay',
    rowHeight: 35,
    barMargin: 0,
    resourceMargin:1,

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
    eventClick(event) {
        // console.log(event.eventRecord.startDate)
        // event.eventRecord.startDate = DateHelper.add(event.eventRecord.startDate, 24, 'hour');
    }
});


// rowHeight.value = scheduler.rowHeight;
