
using Wag.Oms.EGWS.ApiContract.Entities;

namespace Wag.Oms.EGWS.ApiContract.Interfaces
{
    public interface IEventGenerationHandler
    {
        /// <summary>
        /// Generate the event and return the result
        /// </summary>
        /// <returns>Event generation result</returns>
        bool GenerateEvent();
    }
}
