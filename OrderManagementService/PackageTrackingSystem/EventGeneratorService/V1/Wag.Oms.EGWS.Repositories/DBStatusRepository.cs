using System;
using System.Collections.Generic;
using System.Configuration;
using Wag.Oms.EGWS.Common;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.EGWS.Repositories
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

        public override IEnumerable<DateTime> Get()
        {
            throw new NotImplementedException();
        }
    }
}
