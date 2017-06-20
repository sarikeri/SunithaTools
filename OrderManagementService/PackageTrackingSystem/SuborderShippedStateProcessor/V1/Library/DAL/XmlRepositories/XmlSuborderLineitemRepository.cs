using System;
using System.Collections.Generic;
using System.Data;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.XmlRepositories
{
    public class XmlSuborderLineitemRepository: ISuborderLineitemRepository
    {
        private DataTable dtSuborderLineitems;
        private string fileName = "suborder_lineitems";

        public string ConnectionString
        {
            get { return string.Empty; }
            set { }
        }

        public XmlSuborderLineitemRepository()
        {
            DataSet ds = Common.GetDataSet(fileName);

            if (ds != null && ds.Tables.Count > 0)
                dtSuborderLineitems = ds.Tables[0];
        }

        public IEnumerable<SuborderLineitemEntity> GetBySuborderId(string suborderId)
        {
            List<SuborderLineitemEntity> lstSOLIs = new List<SuborderLineitemEntity>();

            using (IDataReader dr = dtSuborderLineitems.CreateDataReader())
            {
                while (dr.Read())
                {
                    if (Convert.ToString(dr["SUBORDER_ID"]) == suborderId)
                        lstSOLIs.Add(ConstructDbEntity(dr));
                }
            }
            return lstSOLIs;
        }

        private int GetOrdinal(IDataReader dr, string column)
        {
            if (dtSuborderLineitems.Columns.Contains(column))
                return dr.GetOrdinal(column);
            else
                return -1;
        }

        private SuborderLineitemEntity ConstructDbEntity(System.Data.IDataReader dr)
        {
            SuborderLineitemEntity entity = new SuborderLineitemEntity();

            int index = GetOrdinal(dr,"CREDIT_DISTRIBUTION");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.CreditDistribution = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr,"DEMAND_DC_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DemandDcId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"LINE_ITEM_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.LineItemId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"OPS_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.OpsFlags = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"PROMO_DISTRIBUTION");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.PromoDistribution = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr,"QUANTITY");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Quantity = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr,"QUANTITY_RESERVED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.QuantityReserved = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr,"SUBORDER_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.SuborderId = dr.GetString(index);
            }

            // Save this for later, in case we change suborders.
            entity.OriginalSuborderId = entity.SuborderId;

            index = GetOrdinal(dr,"TAX_RATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxRate = Common.GetValue<decimal>(dr, index); 
            }

            index = GetOrdinal(dr,"TAXABLE_AMOUNT");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.TaxableAmount = Common.GetValue<decimal>(dr, index); 
            }

            return entity;
        }


        public void Add(SuborderLineitemEntity entity)
        {
            throw new NotImplementedException();
        }

        public int Update(SuborderLineitemEntity entity)
        {
            throw new NotImplementedException();
        }

        public int Update(SuborderLineitemEntity oldEntity, SuborderLineitemEntity newEntity)
        {
            throw new NotImplementedException();
        }
    }
}
