using System;
using System.Collections.Generic;
using System.Data;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.XmlRepositories
{
    public class XmlOrderRepository: IOrderRepository
    {
        private DataTable dtOrders;
        private string fileName = "orders";

        public string ConnectionString
        {
            get { return string.Empty; }
            set { }
        }

        public XmlOrderRepository()
        {
            DataSet ds = Common.GetDataSet(fileName);

            if (ds != null && ds.Tables.Count > 0)
                dtOrders = ds.Tables[0];
        }

        public List<OrderEntity> GetByStatusId(int statusId, int rowCount)
        {
            List<OrderEntity> lstOrders = new List<OrderEntity>();

            using (IDataReader dr = dtOrders.CreateDataReader())
            {
                while (dr.Read())
                {
                    if (Convert.ToInt32(dr["STATUS_ID"]) == statusId)
                        lstOrders.Add(ConstructDbEntity(dr));

                    if (lstOrders.Count == rowCount)
                        break;
                }
            }
            return lstOrders;
        }

        private int GetOrdinal(IDataReader dr, string column)
        {
            if (dtOrders.Columns.Contains(column))
                return dr.GetOrdinal(column);
            else
                return -1;
        }

        private OrderEntity ConstructDbEntity(System.Data.IDataReader dr)
        {
            OrderEntity entity = new OrderEntity();
            int index = 0;

            index = GetOrdinal(dr, "AFFILIATE_REIMBURSE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.AffiliateReimburse = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "ALTERNATE_PAYMENT_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.AlternatePaymentTotal = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "AP_PCT_PROMO");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ApPctPromo = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "AP_PROMO");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ApPromo = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "CC_BILLING_ADDR_ZIP");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CcBillingAddrZip = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_BILLING_ADDRESS1");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CcBillingAddress1 = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_CARDHOLDER_NAME");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CcCardholderName = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_CUR_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CcCurId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_CUR_TOKEN");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CcCurToken = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_EXPIRATION_MONTH");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcExpirationMonth = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "CC_EXPIRATION_YEAR");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcExpirationYear = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "CC_NUMBER_HINT");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CcNumberHint = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_TYPE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcTypeId = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "CREATED_BY");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.CreatedBy = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CREDIT_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CreditAmount = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "CURRENCY_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CurrencyId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "DATE_CLOSED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DateClosed = Common.GetValue<DateTime>(dr, index); 
            }

            index = GetOrdinal(dr, "DATE_RECEIVED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DateReceived = Common.GetValue<DateTime>(dr, index); 
            }

            index = GetOrdinal(dr, "DC_HACKS");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.DcHacks = dr.GetString(index);
            }

            index = GetOrdinal(dr, "EXCHANGE_RATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ExchangeRate = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "EXPECTED_SHIP_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ExpectedShipDate = Common.GetValue<DateTime>(dr, index); 
            }

            index = GetOrdinal(dr, "FSA_PAYMENT_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.FsaPaymentTotal = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "GC_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GcAmount = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "GIFTWRAP_SKU");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GiftwrapSku = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "GROUP_ORDER_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.GroupOrderId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "MAX_SUBORDER_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.MaxSuborderId = dr.GetString(index);
            }

            //index = GetOrdinal(dr, "MAX_LINEITEM_ID");
            //if (index != -1 && !dr.IsDBNull(index))
            //{
            //    entity.MaxLineItemId = (long)(int)Common.StringConversion[entity.AffiliateReimburse.GetType()](dr, index);
            //}

            index = GetOrdinal(dr, "MEMBER_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.MemberId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "ORDER_CONTENT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderContent = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "ORDER_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderFlags = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "ORDER_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.OrderId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "ORDER_SUBTOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderSubtotal = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "ORDER_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderTotal = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "ORDER_TYPE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderType = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "PP_TRANSACTION_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.PpTransactionId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "PROMO_PERCENT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoPercent = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "PROMO_TEXT");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.PromoText = dr.GetString(index);
            }

            index = GetOrdinal(dr, "QUOTED_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.QuotedShipping = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "REASON");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.Reason = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SCDY_CC_CUR_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ScdyCcCurId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SECONDARY_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SecondaryShipping = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "SHIP_ADDRESS1");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipAddress1 = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_ADDRESS2");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipAddress2 = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_CITY");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipCity = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_COUNTRY_CODE");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipCountryCode = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_NAME");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipName = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_PHONE");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipPhone = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_SECONDARY_PHONE");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipSecondaryPhone = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_STATE");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipState = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_ZIP");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.ShipZip = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIPPING_DISCOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingDiscount = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "SHIPPING_ETA_DAYS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingEtaDays = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "SHIPPING_TYPE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTypeId = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "SITE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SiteId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "SITE_ORDER_ID");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.SiteOrderId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SOURCE_AFFILIATE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SourceAffiliateId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "SOURCE_AFFILIATE_PARAM");
            if (index != -1 && !dr.IsDBNull(index))
            {
                entity.SourceAffiliateParam = dr.GetString(index);
            }

            index = GetOrdinal(dr, "STATUS_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.StatusId = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "SUPPRESS_EMAIL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SuppressEmail = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr, "TAX");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Tax = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "TAX_RATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxRate = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "TAX_RATE_PROVIDER");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxRateProvider = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr, "UPDATE_DATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.UpdateDate = Common.GetValue<DateTime>(dr, index); 
            }

            index = dr.GetOrdinal("VERSION");
            if (!dr.IsDBNull(index))
            {
                entity.Version = Common.GetValue<decimal>(dr, index); 
            }

            return entity;
        }

        public void Add(OrderEntity entity)
        {
            throw new NotImplementedException();
        }

        public int Update(OrderEntity entity)
        {
            throw new NotImplementedException();
        }

        public int Update(OrderEntity oldEntity, OrderEntity newEntity)
        {
            throw new NotImplementedException();
        }
    }
}
