using System;
using System.Configuration;
using Wag.Oms.OTUWS.Common;
using Wag.Oms.OTUWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.OTUWS.Repositories
{
    public class DBStatusRepository : DalBaseRepository<DateTime>, IDBStatusRepository
    {
        public DBStatusRepository()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings[Constants.ODS_DB].ToString();
        }

        public override string SelectAllSql
        {
            get { return "Select sysdate from dual"; }
        }

        protected override DateTime ConstructDbEntity(System.Data.IDataReader dr)
        {
            throw new NotImplementedException();
        }

        public DateTime GetCurrentDBDate()
        {
            return GetScalar<DateTime>(SelectAllSql, null, "sysdate");
        }
    }
}
