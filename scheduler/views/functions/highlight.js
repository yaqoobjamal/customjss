import { DateHelper, WidgetHelper, Scheduler, AjaxHelper, DomClassList, EventModel }
    from '../../../build/scheduler.module.js?439960'
export function highlight(value) {
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