using System.Collections.Generic;
using System.Configuration;
using System.Data;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.RepositoryContracts.Entities;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.EGWS.Repositories
{
    public class EventDefinitionRepository : DalBaseRepository<EventDefinitionEntity>, IEventDefinitionRepository
    {
        public EventDefinitionRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }

        public override string SelectAllSql
        {
            get { return "SELECT EVENT_NAME FROM ESG_EVENT_DEFINITIONS EED "; }
        }

        public override IEnumerable<EventDefinitionEntity> Get()
        {
            string query = SelectAllSql + " WHERE EED.DISABLED = 0 ";

            return GetList(query, null);
        }

        protected override EventDefinitionEntity ConstructDbEntity(IDataReader dr)
        {
            var entity = new EventDefinitionEntity();

            int index = dr.GetOrdinal("EVENT_NAME");
            if (!dr.IsDBNull(index))
            {
                entity.EventName = dr.GetString(index);
            }

            return entity;
        }
    }
}
