export function currentOp(job, currentOperation, schedule) {

    var currentOp = null
    for (let index = 0; index < schedule.length; index++) {
        if (schedule[index].Operation == parseInt(currentOperation) && schedule[index].Job == job) {
            currentOp = schedule[index]
            break;
        }
    }
    return currentOp
}