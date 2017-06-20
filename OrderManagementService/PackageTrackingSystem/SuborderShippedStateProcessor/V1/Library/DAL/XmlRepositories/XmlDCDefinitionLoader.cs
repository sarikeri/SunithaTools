using System;
using System.Collections.Generic;
using System.Data;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.XmlRepositories
{
    public class XmlDCDefinitionLoader: IDcDefinitionLoader
    {
        private DataTable dtDCDefinition;
        private string fileName = "dc_definition";

        public string ConnectionString
        {
            get { return string.Empty; }
            set { }
        }

        public XmlDCDefinitionLoader()
        {
            DataSet ds = Common.GetDataSet(fileName);

            if (ds != null && ds.Tables.Count > 0)
                dtDCDefinition = ds.Tables[0];
        }

        public List<DcDefinition> GetByDcId(long dcId)
        {
            List<DcDefinition> lstDCDefs = new List<DcDefinition>();

            using (IDataReader dr = dtDCDefinition.CreateDataReader())
            {
                while (dr.Read())
                {
                    if (Convert.ToInt32(dr["DC_ID"]) == dcId)
                        lstDCDefs.Add(ConstructDbEntity(dr));
                }
            }
            return lstDCDefs;
        }

        private int GetOrdinal(IDataReader dr, string column)
        {
            if (dtDCDefinition.Columns.Contains(column))
                return dr.GetOrdinal(column);
            else
                return -1;
        }

        private DcDefinition ConstructDbEntity(IDataReader dr)
        {
            var entity = new DcDefinition();
            int index = 0;

            index = GetOrdinal(dr,"CITY");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.City = dr.GetString(index);
            }

            index = GetOrdinal(dr,"COUNTRY");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Country = dr.GetString(index);
            }

            index = GetOrdinal(dr,"DC_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DcFlags = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"DC_GROUP_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DcGroupId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"DC_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DcId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"DIST_CENTER_TYPE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DistCenterType = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr,"ENABLED");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Enabled = (0 != Common.GetValue<int>(dr, index));
            }

            index = GetOrdinal(dr,"DISTCENTER");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Type = Common.GetValue<int>(dr, index); 
            }

            index = GetOrdinal(dr,"STARTING_SUBORDER_STATUS_ID");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.StartingSuborderStatusId = Common.GetValue<long>(dr, index); 
            }

            index = GetOrdinal(dr,"STATE");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.State = dr.GetString(index);
            }

            index = GetOrdinal(dr,"ZIP");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.Zip = dr.GetString(index);
            }

            index = GetOrdinal(dr,"TYPE_FLAGS");
            if (index != -1 && !dr.IsDBNull(index) && Convert.ToString(dr[index]).Length > 0)
            {
                entity.DcFlags = Common.GetValue<long>(dr, index); 
            }
            return entity;
        }       
    }
}
