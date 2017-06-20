using System;
using System.Collections.Generic;
using System.Data;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.XmlRepositories
{
    public class XmlOrderLoader : IOrderLoader
    {
        private DataTable dtOrders;
        private string fileName = "complex_orders";

        public string ConnectionString
        {
            get { return string.Empty; }
            set { }
        }

        public XmlOrderLoader()
        {
            DataSet ds = Common.GetDataSet(fileName);

            if (ds != null && ds.Tables.Count > 0)
                dtOrders = ds.Tables[0];
        }

        public List<Order> GetByOrderId(string orderId)
        {
			// NOT USED
            throw new NotImplementedException();
        }

        List<Order> IOrderLoader.GetByStatusId(int statusId, int maxRowCount)
        {
            List<Order> lstOrders = new List<Order>();

            using (IDataReader dr = dtOrders.CreateDataReader())
            {
                while (dr.Read())
                {
                    if (Convert.ToInt32(dr["STATUS_ID"]) == statusId)
                        lstOrders.Add(ConstructDbEntity(dr));

                    if (lstOrders.Count == maxRowCount)
                        break;
                }
            }
            return lstOrders;
        }

        int GetOrdinal(IDataReader dr, string column)
        {
            if (dtOrders.Columns.Contains(column))
                return dr.GetOrdinal(column);
            else
                return -1;
        }

        private Order ConstructDbEntity(IDataReader dr)
        {
            var entity = new Order();
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcBillingAddrZip = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_BILLING_ADDRESS1");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcBillingAddress1 = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_CARDHOLDER_NAME");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcCardholderName = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_CUR_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcCurId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_CUR_TOKEN");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcNumberHint = dr.GetString(index);
            }

            index = GetOrdinal(dr, "CC_TYPE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CcTypeId = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr, "CREATED_BY");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GroupOrderId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "MAX_SUBORDER_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.MaxSuborderId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "MEMBER_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PpTransactionId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "PROMO_PERCENT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoPercent = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "PROMO_TEXT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoText = dr.GetString(index);
            }

            index = GetOrdinal(dr, "QUOTED_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.QuotedShipping = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "REASON");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Reason = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SCDY_CC_CUR_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ScdyCcCurId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SECONDARY_SHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SecondaryShipping = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIP_ADDRESS1");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipAddress1 = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_ADDRESS2");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipAddress2 = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_CITY");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipCity = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_COUNTRY_CODE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipCountryCode = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_NAME");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipName = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_PHONE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipPhone = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_SECONDARY_PHONE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipSecondaryPhone = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_STATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShipState = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SHIP_ZIP");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SiteOrderId = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SOURCE_AFFILIATE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SourceAffiliateId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "SOURCE_AFFILIATE_PARAM");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
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

            index = GetOrdinal(dr, "VERSION");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Version = Common.GetValue<decimal>(dr, index);
            }
            index = GetOrdinal(dr, "DIVISION_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DivisionId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "ORDER_INFO_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Flags = Common.GetValue<long>(dr, index); 
            }

            //index = GetOrdinal(dr, "GROUP_ID");
            //if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            //{
            //    entity.GroupId = (long)(int)Common.StringConversion[entity.AffiliateReimburse.GetType()](dr, index);
            //}

            index = GetOrdinal(dr, "HANDLING_FEE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.HandlingFee = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "INSTALLMENT_PLAN_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.InstallmentPlanId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "ORDER_CYCLE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderCycle = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr, "ORDERINFO_SECSHIPPING");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderInfoSecondaryShipping = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIPPING_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingAmount = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIPPING_METHOD_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingMethodId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "SHIPPING_SURCHARGE_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingSurchargeAmount = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIPPING_TAX_RATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTaxRate = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIPPING_TAXABLE_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingTaxableAmount = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIPPING_WEIGHT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingWeight = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "SHIPPING_WEIGHT_SURCHARGE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ShippingWeightSurcharge = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "ORDERINFO_TAXRATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OrderInfoTaxRate = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "AVAILABILITY_MSG_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.AvailabilityMsgId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "AVAILABILITY_TYPE_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.AvailabilityTypeId = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr, "BASE_RETAIL_PRICE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.BaseRetailPrice = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "CREDIT_DISTRIBUTION");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CreditDistribution = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "OTC_LINEITEMS_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OtcLineItemFlags = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "GROUP_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GroupId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "GROUP_STORECAT_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.GroupStorecatId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "LINE_ITEM_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.LineItemId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "MERCH_PROMO_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.MerchPromoId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "PARENT_PRODUCT_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ParentProductId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "PER_UNIT_SHIP_SURCHARGE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PerUnitShipSurcharge = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "PRODUCT_ATTRIBUTES");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ProductAttributes = dr.GetString(index);
            }

            index = GetOrdinal(dr, "PRODUCT_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.ProductId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "PROMO_DISTRIBUTION");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoDistribution = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "PROMO_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "QUANTITY_ORDERED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.QuantityOrdered = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr, "QUANTITY_SHIPPED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.QuantityShipped = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr, "OTC_SITEID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OtcSiteId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "OTC_TAXRATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OtcTaxRate = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "OTC_PROMO_TEXT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OtcPromoText = dr.GetString(index);
            }

            index = GetOrdinal(dr, "SOURCE_STORECAT_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SourceStorecatId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "STATUS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Status = Common.GetValue<int>(dr, index);   
            }

            index = GetOrdinal(dr, "TAXABLE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Taxable = (0 != Common.GetValue<int>(dr, index));
            }

            index = GetOrdinal(dr, "TAXABLE_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxableAmount = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "UNIT_PRICE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.UnitPrice = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "UPC");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Upc = dr.GetString(index);
            }

            index = GetOrdinal(dr, "WAS_ON_ORDER");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.WasOnOrder = (0 != Common.GetValue<int>(dr, index));
            }

            index = GetOrdinal(dr, "MEMBERS_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.MemberFlags = Common.GetValue<decimal>(dr, index);
            }

            index = GetOrdinal(dr, "INSTALLMENTPLANFLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Flags = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr, "INSTALLMENT_INTERVAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.InstallmentInterval = Common.GetValue<short>(dr, index); 
            }

            index = GetOrdinal(dr, "NUM_INSTALLMENTS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.NumInstallments = Common.GetValue<short>(dr, index); 
            }

            index = GetOrdinal(dr, "SURCHARGE_TOTAL");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SurchargeTotal = Common.GetValue<decimal>(dr, index);
            }

            return entity;
        }



        
    }
}
