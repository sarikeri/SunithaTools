using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using Oracle.DataAccess.Client;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.RepositoryContracts.Entities;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.EGWS.Repositories
{
    public class EventOutboundDataRepository : DalBaseRepository<EventOutboundDataEntity>, IEventOutboundDataRepository
    {
        public EventOutboundDataRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }

        private string InsertSql
        {
            get
            {
                return "INSERT INTO EVENT_OUTBOUND_DATA (MSG_ID , MSG_DATA) " +
                        " VALUES (:MSG_ID , :MSG_DATA)";
            }
        }

        public void Add(EventOutboundDataEntity eventOutboundDataEntity)
        {
            Action<OracleCommand> fnPrepareCommand = cmd => AddPrepareCommand(cmd, eventOutboundDataEntity);

            if (Connection.State != ConnectionState.Open)
                Connection.Open();
            try
            {
                ExecuteNonQuery(InsertSql, fnPrepareCommand, Connection);
            }
            finally
            {
                if (Connection.State != ConnectionState.Closed)
                    Connection.Close();
            }
        }

        private void AddPrepareCommand(OracleCommand cmd, EventOutboundDataEntity entity)
        {
            AddInParameter(cmd, ":MSG_ID", OracleDbType.Varchar2, entity.MessageId);
            AddInParameter(cmd, ":MSG_DATA", OracleDbType.Varchar2, entity.MessageData);
        }

        public override string SelectAllSql
        {
            get
            {
                return "Select * from event_outbound_data";
            }
        }

        protected override EventOutboundDataEntity ConstructDbEntity(IDataReader dr)
        {
            throw new NotImplementedException();
        }

        public override IEnumerable<EventOutboundDataEntity> Get()
        {
            throw new NotImplementedException();
        }
    }
}
