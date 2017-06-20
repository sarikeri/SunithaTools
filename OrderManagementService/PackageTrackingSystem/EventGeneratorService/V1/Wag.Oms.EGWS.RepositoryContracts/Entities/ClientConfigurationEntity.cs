
namespace Wag.Oms.EGWS.RepositoryContracts.Entities
{
    public class ClientConfigurationEntity
    {
        public int ClientId { get; set; }
        public string SecondarySubscribingClientIds { get; set; }
        public string SiteIds { get; set; }
    }
}
