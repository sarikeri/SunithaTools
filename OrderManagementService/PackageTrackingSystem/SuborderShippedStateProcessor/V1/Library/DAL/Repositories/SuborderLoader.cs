using System.Linq;
using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data.Common;
using Wag.Oms.Common.MultiProcess;
using Wag.Oms.SOS.Common;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.Repositories
{
    public class SuborderLoader : DalBaseRepository<Suborder>, ISuborderLoader
    {
        #region Properties
        public override string SelectAllSql
        {
            get { throw new NotImplementedException(); }
        }

        public string SelectShippedSubordersSql
        {
            get
            {
                return
                    "SELECT O.SITE_ID AS SITE_ID, O.ORDER_ID, SO.SUBORDER_ID, NVL(cm.pts_carrier_id, 'Unknown') AS CARRIER_ID, SP.TRACKING_NUMBER AS TRACKING_ID, " +
                    "SO.SHIPPED_DATE AS SHIPPING_DATE, O.SHIP_ZIP AS DESTINATION_ZIP_CODE, " +
                    "CASE WHEN NVL(OEX.NOTIFY_TRACKING_STATUS,0) = 1 THEN (SELECT LISTAGG(PTS_CLIENT_ID,',') WITHIN GROUP (ORDER BY PTS_CLIENT_ID) FROM PTS_OMS_CLIENT_MAPPING WHERE OMS_CLIENT_ID = OEX.CLIENT_ID) ELSE NULL END AS SECONDARYSUBSCRIBINGCLIENTIDS " +
                    "FROM SUBORDERS SO " +
                    "INNER JOIN SHIPPED_SUBORDERS SS ON SO.SUBORDER_ID = SS.SUBORDER_ID " +
                    "INNER JOIN SUBORDER_PACKAGES SP ON SO.SUBORDER_ID = SP.SUBORDER_ID " +
                    "INNER JOIN ORDERS O ON SO.ORDER_ID = O.ORDER_ID " +
                    "INNER JOIN ORDERS_EX OEX ON O.ORDER_ID = OEX.ORDER_ID " +
                    "INNER JOIN SHIPPING_CARRIERS SC ON SO.SHIPPING_CARRIER_ID = SC.SHIPPING_CARRIER_ID " +
                    "LEFT OUTER JOIN PTS_OMS_CARRIER_MAPPING CM ON SC.SHIPPING_CARRIER_ID = CM.OMS_CARRIER_ID ";
            }
        }
        #endregion

        #region Public Methods
        public List<Suborder> GetShippedSuborders()
        {
            var query = SelectShippedSubordersSql + " WHERE NVL(SS.PTS_STATUS_ID,0) = :PTS_STATUS_ID AND (SS.PTS_NEXT_RETRY_DATE IS NULL OR SS.PTS_NEXT_RETRY_DATE <= :PTS_NEXT_RETRY_DATE)";
            Action<DbCommand> fnPrepareCommand = delegate(DbCommand cmd)
            {
                //Where Clause parameter
                AddInParameter(cmd, ":PTS_STATUS_ID", OracleDbType.Int32, (int)PTSStatus.New);
                AddInParameter(cmd, ":PTS_NEXT_RETRY_DATE", OracleDbType.Date, DateTime.Now);
            };
            return GetList(query, fnPrepareCommand);
        }
        #endregion

        protected override Suborder ConstructDbEntity(System.Data.IDataReader dr)
        {
            var entity = new Suborder();
            var index = 0;

            index = dr.GetOrdinal("SITE_ID");
            if (!dr.IsDBNull(index))
            {
                entity.SiteId = (long)dr.GetDecimal(index);
            }

            index = dr.GetOrdinal("ORDER_ID");
            if (!dr.IsDBNull(index))
            {
                entity.OrderId = dr.GetString(index);
            }

            index = dr.GetOrdinal("SUBORDER_ID");
            if (!dr.IsDBNull(index))
            {
                entity.SuborderId = dr.GetString(index);
            }

            index = dr.GetOrdinal("CARRIER_ID");
            if (!dr.IsDBNull(index))
            {
                entity.ShippingCarrierId = dr.GetString(index);
            }

            index = dr.GetOrdinal("TRACKING_ID");
            if (!dr.IsDBNull(index))
            {
                entity.ShippingTrackingInfo = dr.GetString(index);
            }

            index = dr.GetOrdinal("SHIPPING_DATE");
            if (!dr.IsDBNull(index))
            {
                entity.ShippedDate = dr.GetDateTime(index);
            }

            index = dr.GetOrdinal("DESTINATION_ZIP_CODE");
            if (!dr.IsDBNull(index))
            {
                entity.ShipZip = dr.GetString(index);
            }

            index = dr.GetOrdinal("SECONDARYSUBSCRIBINGCLIENTIDS");
            if (!dr.IsDBNull(index))
            {
                entity.SecondarySubscribingClientids = dr.GetString(index);
            }

            return entity;
        }
    }
}
