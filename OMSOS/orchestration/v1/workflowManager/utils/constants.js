module.exports = {

    docStatus: {
        new: "New",
        success: "Success",
        failed: "Failed",
        processing: "Processing",
        retry: "Retry",
        putAway: "PutAway" //after try n times
    },

    mongodbConnState: {
        close: 0,
        open: 1,
        opening: 2,
        closing: 3
    },

  taskStatus: {
        failed: "Failed",
        success: "Success",
        retry: "Retry"
    },

    dbCollectionName: 'wfOrchestration',
    putwayTimes: 6
}