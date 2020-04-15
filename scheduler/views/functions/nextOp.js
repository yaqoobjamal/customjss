export function nextOp(job, currentOperation, schedule) {

    var tempNextOp = parseInt(currentOperation) + 1;
    var nextOperation = null;
    for (let index = 0; index < schedule.length; index++) {
        if (schedule[index].Operation == parseInt(currentOperation) + 1 && schedule[index].Job == job) {
            nextOperation = schedule[index]
            break;
        }
    }
    return nextOperation
}

