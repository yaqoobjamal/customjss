import { DateHelper, WidgetHelper, Scheduler, AjaxHelper, DomClassList, EventModel }
    from '../../../build/scheduler.module.js?439960'
import { nextOp } from "./nextOp.js"
import { currentOp } from "./currentOp.js"
import { nextMachine } from "./nextMachine.js"
import { findNextDependents, finalCallback } from "./nextDependents.js"
import { resetHighlights } from "./hReset.js"
// The final list of the dependents is stored in exported variable "final array"
export var finalArray = []
//The boolx variable basically, if "true" allows the returned dependents to be highlighted.
export function returnHighlighted(eventRecord, scheduleTempx, boolx) {
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
                    //Events to Highlight
                    if (newArr[i].Job == totalEventsOnDOM[j].Job && newArr[i].Operation == totalEventsOnDOM[j].Operation) {
                        eventsToHighlight.push(totalEventsOnDOM[j])
                    }
                    else {
                        NotToHighlight.push(totalEventsOnDOM[j])
                    }
                }
            }
            if (boolx) {
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

                finalArray = []
                finalArray = eventsToHighlight
            }
            else {
                finalArray = []
                finalArray = eventsToHighlight;
            }
        })
    })
}

