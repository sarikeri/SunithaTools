namespace Wag.Oms.OTUWS.Models.Common
{
    interface ITrackingUpdateRequest
    {
        EventData EventData { get; set; }
        string ClientReferenceId { get; set; }
    }
}
