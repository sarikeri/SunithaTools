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
    public class EventOutboundRepository : DalBaseRepository<EventOutboundEntity>, IEventOutboundRepository
    {
        public EventOutboundRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }

        private string InsertSql
        {
            get
            {
                return "INSERT INTO EVENT_OUTBOUND (MSG_ID , MSG_TYPE , STATUS_ID , RETRY_COUNT , CREATE_DATE , KEY_VALUE1 , KEY_VALUE2 , REQUEST_ENDPOINT_ID, PROCESSOR_INSTANCE_NAME) " +
                        " VALUES (:MSG_ID , :MSG_TYPE , :STATUS_ID , :RETRY_COUNT , SYSDATE , :KEY_VALUE1, :KEY_VALUE2, :REQUEST_ENDPOINT_ID, :PROCESSOR_INSTANCE_NAME)";
            }
        }

        public void Add(EventOutboundEntity eventOutboundEntity)
        {
            Action<OracleCommand> fnPrepareCommand = cmd => AddPrepareCommand(cmd, eventOutboundEntity);

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

        private void AddPrepareCommand(OracleCommand cmd, EventOutboundEntity entity)
        {
            AddInParameter(cmd, ":MSG_ID", OracleDbType.Varchar2, entity.MessageId);
            AddInParameter(cmd, ":MSG_TYPE", OracleDbType.Varchar2, entity.MessageType);
            AddInParameter(cmd, ":STATUS_ID", OracleDbType.Varchar2, entity.StatusId);
            AddInParameter(cmd, ":RETRY_COUNT", OracleDbType.Int32, entity.RetryCount);
            AddInParameter(cmd, ":KEY_VALUE1", OracleDbType.Varchar2, entity.KeyValue1);
            AddInParameter(cmd, ":KEY_VALUE2", OracleDbType.Varchar2, entity.KeyValue2);
            AddInParameter(cmd, ":REQUEST_ENDPOINT_ID", OracleDbType.Int32, entity.RequestEndPointId);
            AddInParameter(cmd, ":PROCESSOR_INSTANCE_NAME", OracleDbType.Varchar2, ConfigurationManager.AppSettings["ProcessorInstanceName"].ToString());
        }

        public override string SelectAllSql
        {
            get
            {
                return "Select * from event_outbound";
            }
        }

        protected override EventOutboundEntity ConstructDbEntity(IDataReader dr)
        {
            throw new NotImplementedException();
        }

        public override IEnumerable<EventOutboundEntity> Get()
        {
            throw new NotImplementedException();
        }
    }
}
