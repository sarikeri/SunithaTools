using System.Collections.Generic;
using System.Configuration;
using System.Data;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.RepositoryContracts.Entities;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.EGWS.Repositories
{
    public class ClientConfigurationRepository : DalBaseRepository<ClientConfigurationEntity>, IClientConfigurationRepository
    {
        public ClientConfigurationRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }

        public override string SelectAllSql
        {
            get { return "SELECT EP_CLIENT_ID, SCDY_SUBSCRIBING_CLIENT_IDS, SITE_IDS FROM EP_CLIENT_CONFIGURATION "; }
        }

        public override IEnumerable<ClientConfigurationEntity> Get()
        {
            string query = SelectAllSql;
            return GetList(query);
        }

        protected override ClientConfigurationEntity ConstructDbEntity(IDataReader dr)
        {
            var entity = new ClientConfigurationEntity();

            int index = dr.GetOrdinal("EP_CLIENT_ID");
            if (!dr.IsDBNull(index))
            {
                entity.ClientId = (int)dr.GetDecimal(index);
            }

            index = dr.GetOrdinal("SCDY_SUBSCRIBING_CLIENT_IDS");
            entity.SecondarySubscribingClientIds = string.Empty;
            if (!dr.IsDBNull(index))
            {
                entity.SecondarySubscribingClientIds = dr.GetString(index);
            }

            index = dr.GetOrdinal("SITE_IDS");
            if (!dr.IsDBNull(index))
            {
                entity.SiteIds = dr.GetString(index);
            }

            return entity;
        }
    }
}
