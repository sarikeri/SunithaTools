using System;
using System.Collections.Generic;
using System.Data;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.XmlRepositories
{
    public class XmlSuborderRepository: ISuborderRepository
    {
        private DataTable dtSuborders;
        private string fileName = "suborders";

        public string ConnectionString
        {
            get { return string.Empty; }
            set { }
        }

        public XmlSuborderRepository()
        {
            DataSet ds = Common.GetDataSet(fileName);

            if (ds != null && ds.Tables.Count > 0)
                dtSuborders = ds.Tables[0];
        }

        public IEnumerable<SuborderEntity> GetByOrderId(string orderId)
        {
            List<SuborderEntity> lstSuborders = new List<SuborderEntity>();

            using (IDataReader dr = dtSuborders.CreateDataReader())
            {
                while (dr.Read())
                {
                    if (Convert.ToString(dr["ORDER_ID"]) == orderId)
                        lstSuborders.Add(ConstructDbEntity(dr));
                }
            }
            return lstSuborders;
        }

        public SuborderEntity GetBySuborderId(string suborderId)
        {
            using (IDataReader dr = dtSuborders.CreateDataReader())
            {
                while (dr.Read())
                {
                    if (Convert.ToString(dr["SUBORDER_ID"]) == suborderId)
                        return ConstructDbEntity(dr);
                }
            }
            return null;
        }

        private int GetOrdinal(IDataReader dr, string column)
        {
            if (dtSuborders.Columns.Contains(column))
                return dr.GetOrdinal(column);
            else
                return -1;
        }

        private SuborderEntity ConstructDbEntity(System.Data.IDataReader dr)
        {
            SuborderEntity entity = new SuborderEntity();
            int index = 0;

            index = GetOrdinal(dr,"ACTUAL_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ActualShipping = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr,"ALTERNATE_PAYMENT_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.AlternatePaymentTotal = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr,"AP_PCT_PROMO");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ApPctPromo = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"AP_PROMO");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ApPromo = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"BASE_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.BaseShipping = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"BILLING_STATUS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.BillingStatus = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"CANCEL_PENDING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CancelPending = (0 != Common.GetValue<int>(dr, index));
            }

            index = GetOrdinal(dr,"CC_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcId = dr.GetString(index);
            }

            index = GetOrdinal(dr,"CHARGED_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ChargedShipping = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"CREATE_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CreateDate = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"CREATED_BY");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CreatedBy = dr.GetString(index);
            }

            index = GetOrdinal(dr,"CREDIT_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CreditAmount = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"DB_INSERT_DT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DbInsertDt = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"DB_UPDATE_DT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DbUpdateDt = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"DC_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DcId = Common.GetValue<long>(dr, index);   
            }

            index = GetOrdinal(dr,"DC_REQUEST_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DcRequestId = dr.GetString(index);
            }

            index = GetOrdinal(dr,"DIST_CENTER_TYPE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DistCenterType = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"FSA_PAYMENT_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.FsaPaymentTotal = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"FULFILL_SUBSTATUS_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.FulfillSubstatusID = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"GC_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GcAmount = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"GROUP_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GroupId = Common.GetValue<long>(dr, index);   
            }

            index = GetOrdinal(dr,"HOLD_REASON_CODE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.HoldReasonCode = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"HOLD_REASON_TEXT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.HoldReasonText = dr.GetString(index);
            }

            index = GetOrdinal(dr,"NUMBER_OF_BOXES_SHIPPED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.NumberOfBoxesShipped = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"ORDER_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderId = dr.GetString(index);
            }

            index = GetOrdinal(dr,"PICKEDUP_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PickedUpDate = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"PRIMARY_DC_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PrimaryDcId = Common.GetValue<long>(dr, index);   
            }

            index = GetOrdinal(dr,"PROMO_PERCENT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoPercent = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"READY_FOR_PICKUP_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ReadyForPickupDate = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"SCDY_CC_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ScdyCcId = dr.GetString(index);
            }

            index = GetOrdinal(dr,"SHIPPED_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippedDate = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"SHIPPING_CARRIER_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingCarrierId = Common.GetValue<long>(dr, index);   
            }

            index = GetOrdinal(dr,"SHIPPING_TAX_RATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTaxRate = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"SHIPPING_TAXABLE_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTaxableAmount = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"SHIPPING_TRACKING_INFO");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTrackingInfo = dr.GetString(index);
            }

            index = GetOrdinal(dr,"SHIPPING_TYPE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTypeId = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"STORE_RECEIVING_BARCODE_PREFIX");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.StoreReceivingBarcodePrefix = dr.GetString(index);
            }

            index = GetOrdinal(dr,"SUBORDER_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SuborderFlags = Common.GetValue<long>(dr, index);   
            }

            index = GetOrdinal(dr,"SUBORDER_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SuborderId = dr.GetString(index);
            }

            index = GetOrdinal(dr,"SUBORDER_STATUS_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SuborderStatusId = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"SUBORDER_TYPE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SuborderType = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"SURCHARGE_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SurchargeTotal = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"TAX_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxAmount = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"TAX_RATE_PROVIDER");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxRateProvider = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr,"TAXABLE_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxableTotal = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Total = Common.GetValue<decimal>(dr, index);   
            }

            index = GetOrdinal(dr,"UPDATE_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.UpdateDate = Common.GetValue<DateTime>(dr, index);   
            }

            index = GetOrdinal(dr,"VERSION");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Version = Common.GetValue<decimal>(dr, index);   
            }

            return entity;
        }

        public void Add(SuborderEntity entity)
        {
            throw new NotImplementedException();
        }

        public int Update(SuborderEntity entity)
        {
            throw new NotImplementedException();
        }

        public int Update(SuborderEntity oldSOEntity, SuborderEntity soEntity)
        {
            throw new NotImplementedException();
        }
    }
}
