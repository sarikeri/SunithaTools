class carrierConfiguration {
    constructor(carrierId, maxParallelCalls, maxTrackingDays, initialWaitDays, schedule) {
        this.carrierId = carrierId;
        this.maxParallelCalls = maxParallelCalls;
        this.maxTrackingDays = maxTrackingDays;
        this.initialWaitDays = initialWaitDays;
        this.schedule = schedule;
    }
}

module.exports = carrierConfiguration;