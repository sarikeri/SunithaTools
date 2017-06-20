using System;
using System.Configuration;
using System.Data;
using Oracle.DataAccess.Client;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.RepositoryContracts.Entities;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;
using System.Collections.Generic;

namespace Wag.Oms.EGWS.Repositories
{
    public class EventConfigurationRepository : DalBaseRepository<EventConfigurationEntity>, IEventConfigurationRepository
    {
        public EventConfigurationRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }

        public override string SelectAllSql
        {
            get { return "SELECT MD.MSG_TYPE, MD.ENDPOINT_ID, MD.ENCODING_TYPE, MD.NO_MSG_BODY FROM ESG_EVENT_DEFINITIONS EED INNER JOIN ESG_EVENT_SUBSCRIPTIONS EES ON EED.DEFINITION_ID = EES.DEFINITION_ID"
                    + " INNER JOIN MSG_DEFINITION MD ON MD.MSG_TYPE = EES.MSG_TYPE "; }
        }

        public override IEnumerable<EventConfigurationEntity> Get()
        {
            throw new NotImplementedException();
        }

        public EventConfigurationEntity Get(string eventName, int siteId, int clientId)
        {
            string query = SelectAllSql + " WHERE EED.DISABLED = 0 AND EES.DISABLED = 0 AND MD.ENABLED = 1 AND EED.EVENT_NAME = :EVENT_NAME AND EES.SITE_ID = :SITE_ID AND EES.CLIENT_ID = :CLIENT_ID";

            Action<OracleCommand> fnPrepareCommand = cmd =>
            {
                AddInParameter(cmd, ":EVENT_NAME", OracleDbType.Varchar2, eventName);
                AddInParameter(cmd, ":SITE_ID", OracleDbType.Int32, siteId);
                AddInParameter(cmd, ":CLIENT_ID", OracleDbType.Int32, clientId);
            };

            return GetEntity(query, fnPrepareCommand);
        }

        protected override EventConfigurationEntity ConstructDbEntity(IDataReader dr)
        {
            var entity = new EventConfigurationEntity();

            int index = dr.GetOrdinal("MSG_TYPE");
            if (!dr.IsDBNull(index))
            {
                entity.MessageType = dr.GetString(index);
            }

            index = dr.GetOrdinal("ENDPOINT_ID");
            if (!dr.IsDBNull(index))
            {
                entity.EndPointId = (int) dr.GetDecimal(index);
            }

            index = dr.GetOrdinal("ENCODING_TYPE");
            if (!dr.IsDBNull(index))
            {
                entity.Encoding = (EncodingType)Enum.Parse(typeof(EncodingType),dr.GetString(index));
            }

            index = dr.GetOrdinal("NO_MSG_BODY");
            if (!dr.IsDBNull(index))
            {
                entity.MsgBodyNotRequired = Convert.ToBoolean(dr.GetInt16(index));
            }

            return entity;
        }
    }
}
