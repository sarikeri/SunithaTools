using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wag.Oms.Common.MultiProcess;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.Repositories
{
    public class ShippedSuborderRepository : DalBaseRepository<ShippedSuborder>, IShippedSuborderRepository
    {
        #region Properties
        public override string SelectAllSql
        {
            get
            {
                return "SELECT A.SHIPPED_SUBORDERS_ID, A.SUBORDER_ID, A.PTS_STATUS_ID, A.PTS_NEXT_RETRY_DATE FROM SHIPPED_SUBORDERS A ";
            }
        }
        #endregion

        #region Public methods
        public int UpdateStatus(string suborderId, int ptsStatusId)
        {
            var query = "UPDATE SHIPPED_SUBORDERS SET PTS_STATUS_ID = :PTS_STATUS_ID  WHERE SUBORDER_ID = :SUBORDER_ID";
            Action<DbCommand> fnPrepareCommand = delegate(DbCommand cmd)
            {
                //Where Clause parameters
                AddInParameter(cmd, ":PTS_STATUS_ID", OracleDbType.Int32, ptsStatusId);
                AddInParameter(cmd, ":SUBORDER_ID", OracleDbType.Varchar2, suborderId);
            };
            return ExecuteNonQuery(query, fnPrepareCommand);
        }

        public int UpdatePtsNextRetryDate(string suborderId, DateTime ptsNextRetryDate)
        {
            var query = "UPDATE SHIPPED_SUBORDERS SET PTS_NEXT_RETRY_DATE = :PTS_NEXT_RETRY_DATE  WHERE SUBORDER_ID = :SUBORDER_ID";
            Action<DbCommand> fnPrepareCommand = delegate(DbCommand cmd)
            {
                //Where Clause parameters
                AddInParameter(cmd, ":PTS_NEXT_RETRY_DATE", OracleDbType.Date, ptsNextRetryDate);
                AddInParameter(cmd, ":SUBORDER_ID", OracleDbType.Varchar2, suborderId);
            };
            return ExecuteNonQuery(query, fnPrepareCommand);
        }

        public bool TryLocking(string id, int ptsStatusId)
        {
            try
            {
                var query = SelectAllSql + " WHERE A.SUBORDER_ID ='" + id + "' AND NVL(A.PTS_STATUS_ID,0) = " + ptsStatusId;

                // Use common locking framework to lock the record
                ISyncObject sync = new DbSynchronizer(Connection, query);
                var lockObj = new Lock(sync);

                return true;
            }
            catch (LockFailedException lfe)
            {
                // The exception need not be logged since it is expected to occur 
                // when the same record is locked by another instance of New Order Service.
                return false;
            }
        }
        #endregion

        #region Protected methods
        protected override ShippedSuborder ConstructDbEntity(System.Data.IDataReader dr)
        {
            var entity = new ShippedSuborder();
            var index = 0;

            index = dr.GetOrdinal("SHIPPED_SUBORDERS_ID");
            if (!dr.IsDBNull(index))
            {
                entity.ShippedSubordersId = dr.GetString(index);
            }

            index = dr.GetOrdinal("SUBORDER_ID");
            if (!dr.IsDBNull(index))
            {
                entity.SuborderId = dr.GetString(index);
            }

            index = dr.GetOrdinal("PTS_STATUS_ID");
            if (!dr.IsDBNull(index))
            {
                entity.PtsStatusId = (int)dr.GetDecimal(index);
            }

            index = dr.GetOrdinal("PTS_NEXT_RETRY_DATE");
            if (!dr.IsDBNull(index))
            {
                entity.PtsNextRetryDate = dr.GetDateTime(index);
            }

            return entity;
        }
        #endregion
    }
}
