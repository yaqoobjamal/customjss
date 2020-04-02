export function nextMachine(job, currentOperation, schedule) {
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