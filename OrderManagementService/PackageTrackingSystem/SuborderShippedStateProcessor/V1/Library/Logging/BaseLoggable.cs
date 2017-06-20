
namespace Wag.Oms.SOS.Logging
{
    /// <summary>
    /// This enum type should include all COMMON 'known' types that can be logged in a structured way, and is shared for all logging consumers. 
    /// Adding new enum fields should not break existing code; please do not delete existing enums. You can define new enums in your own project
    /// for additional values.
    /// </summary>
    public enum BaseLoggable
    {
        Msg = 1,
        Timestamp,
        Debuglevel,
        Exception,
        Callstack,
        AppName,
        OrderType,
        InstanceId,
        ProcessGroupId,
        MsgType,
        TypeName,
        MethodName,
        OtherTypeName,
        UserName,
        ElementCount,
        ErrorCount,
        ProductId,
        LineItemId,
        SubOrderId,
        OrderId,
        DcId,
        InstallmentPlanId,
        OtherId,
        MethodExecutionTime,
        SourceFilename,
        SourceFileLine,
        SourceModule,
        MachineName,
        WindowsProcess,
        WindowsThread,
        MoneyValue,
        OperationType,
        OperationResult,
        UserId,
        Revision,
        PrevRevision,
    }
}
