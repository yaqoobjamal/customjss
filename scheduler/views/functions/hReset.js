import {DomClassList} from '../../../build/scheduler.module.js?439960'
 
export function resetHighlights(schedulerx,totalEventsOnDOMx)
{
    schedulerx.element.classList.remove('b-highlighting')
    for (let index = 0; index <totalEventsOnDOMx.length; index++) {
        const taskClassList = new DomClassList(totalEventsOnDOMx[index].cls);
        const matched = taskClassList['b-match'];
        taskClassList.remove('b-match')
        totalEventsOnDOMx[index].cls=taskClassList.value
        // console.log(totalEventsOnDOM[index]);
    }
}