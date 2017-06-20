using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.RepositoryContracts.Entities;
using Wag.Oms.OTUWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.OTUWS.Repositories
{
    public class SuborderPackagesRepository : DalBaseRepository<SuborderPackagesEntity>, ISuborderPackagesRepository
    {
        public SuborderPackagesRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }
        public override string SelectAllSql
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        private string UpdateSql
        {
            get
            {
                return "UPDATE SUBORDER_PACKAGES SET  TRACKING_STATUS = :TRACKING_STATUS, TRACKING_DATE = :TRACKING_DATE, DB_UPDATE_DT = :DB_UPDATE_DT " +
                        " WHERE SUBORDER_ID = :SUBORDER_ID AND TRACKING_NUMBER = :TRACKING_NUMBER";
            }
        }

        public int Update(string suborderId, string trackingNumber, string trackingStatus, DateTime trackingDate)
        {
            Action<OracleCommand> fnPrepareCommand = cmd => AddPrepareCommand(cmd, suborderId, trackingNumber, trackingStatus, trackingDate);

            if (Connection.State != ConnectionState.Open)
                Connection.Open();
            try
            {
                return ExecuteNonQuery(UpdateSql, fnPrepareCommand, Connection);
            }
            finally
            {
                if (Connection.State != ConnectionState.Closed)
                    Connection.Close();
            }
        }

        private void AddPrepareCommand(OracleCommand cmd, string suborderId, string trackingNumber, string trackingStatus, DateTime trackingDate)
        {
            AddInParameter(cmd, ":TRACKING_STATUS", OracleDbType.Varchar2, trackingStatus);
            AddInParameter(cmd, ":TRACKING_DATE", OracleDbType.Date, trackingDate);
            AddInParameter(cmd, ":DB_UPDATE_DT", OracleDbType.Date, DateTime.Now);
            AddInParameter(cmd, ":SUBORDER_ID", OracleDbType.Varchar2, suborderId);
            AddInParameter(cmd, ":TRACKING_NUMBER", OracleDbType.Varchar2, trackingNumber);
        }

        protected override SuborderPackagesEntity ConstructDbEntity(IDataReader dr)
        {
            throw new NotImplementedException();
        }
    }
}
