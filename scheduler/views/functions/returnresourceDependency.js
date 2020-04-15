import { DateHelper, WidgetHelper, Scheduler, AjaxHelper, DomClassList, EventModel }
    from '../../../build/scheduler.module.js?439960'
import { nextOp } from "./nextOp.js"
import { currentOp } from "./currentOp.js"
import { nextMachine } from "./nextMachine.js"
import { findNextDependents, finalCallback } from "./nextDependents.js"
import { resetHighlights } from "./hReset.js"

export function returnresourceDependency(eventRecord,scheduleTempx)
{
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