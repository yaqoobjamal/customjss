import { DomClassList, EventModel }from '../../../build/scheduler.module.js?439960'
import { nextOp } from "./nextOp.js"
import { resetHighlights } from "./hReset.js"
import { highlight } from "./highlight.js"

export function returndependentjobs(eventRecord,scheduleTempx) {

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