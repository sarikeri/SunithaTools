using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Oracle.DataAccess.Client;
using Wag.Oms.SOS.DAL.Contracts;

namespace Wag.Oms.SOS.DAL.Repositories
{
    public abstract class DalBaseRepository<I> where I : IDalEntity
    {
        private string connString;
        protected OracleConnection Connection { get; set; }

        public string ConnectionString
        {
            get
            {
                return connString;
            }
            set
            {
                if (string.IsNullOrEmpty(connString) || connString != value || Connection == null)
                {
                    connString = value;
                    Connection = new OracleConnection(connString);
                }
            }
        }

        public abstract string SelectAllSql { get; }
        protected abstract I ConstructDbEntity(IDataReader dr);

        #region Protected methods

        protected List<I> GetList(string query)
        {
            var lstResult = new List<I>();

            lstResult.AddRange(ExecuteQuery(query));

            return lstResult;
        }

        protected List<I> GetList(string query, Action<DbCommand> fnPrepareCommand)
        {
            var lstResult = new List<I>();

            lstResult.AddRange(ExecuteQuery(query, fnPrepareCommand));

            return lstResult;
        }

        protected IEnumerable<I> ExecuteQuery(string query)
        {
            return ExecuteQuery(query, null);
        }

        protected IEnumerable<I> ExecuteQuery(string query, Action<DbCommand> fnPrepareCommand)
        {
            Connection.Open();
            try
            {
                using (var command = new OracleCommand(query, Connection))
                {
                    command.CommandType = CommandType.Text;

                    if (null != fnPrepareCommand)
                    {
                        fnPrepareCommand(command);
                    }

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            yield return ConstructDbEntity(reader);
                        }
                    }
                }
            }
            finally
            {
                Connection.Close();
            }
        }

        protected int ExecuteNonQuery(string sqlStmt)
        {
            return ExecuteNonQuery(sqlStmt, null);
        }

        protected int ExecuteNonQuery(string sqlStmt, Action<DbCommand> fnPrepareCommand)
        {
            int rowsAffected = 0;

            Connection.Open();
            try
            {
                using (var command = new OracleCommand(sqlStmt, Connection))
                {
                    command.CommandType = CommandType.Text;

                    if (null != fnPrepareCommand)
                    {
                        fnPrepareCommand(command);
                    }

                    rowsAffected = command.ExecuteNonQuery();
                }
            }
            finally
            {
                Connection.Close();
            }

            return rowsAffected;
        }

        protected void ExecuteNonQuery(string sqlStmt, Action<DbCommand> fnPrepareCommand, OracleConnection conn)
        {
            using (var command = new OracleCommand(sqlStmt, conn))
            {
                command.CommandType = CommandType.Text;

                if (null != fnPrepareCommand)
                    fnPrepareCommand(command);

                command.ExecuteNonQuery();
            }
        }

        protected I GetEntity(string query, Action<DbCommand> fnPrepareCommand)
        {
            Connection.Open();
            try
            {
                using (var command = new OracleCommand(query, Connection))
                {
                    command.CommandType = CommandType.Text;

                    if (null != fnPrepareCommand)
                    {
                        fnPrepareCommand(command);
                    }

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return ConstructDbEntity(reader);
                        }
                    }
                    return default(I);
                }
            }
            finally
            {
                Connection.Close();
            }
        }

        protected void AddInParameter(DbCommand cmd, string paramName, OracleDbType type, object value)
        {
            if (null == cmd)
                return;

            cmd.Parameters.Add(new OracleParameter { ParameterName = paramName, OracleDbType = type, Value = value, Direction = ParameterDirection.Input });
        }

        // Add 'in' param only if it has changed, 
        // i.e., only if the param (having same name as column) is in the list of modified columns 
        protected void CheckAndAddInParameter(DbCommand cmd, List<string> modifiedCols, string paramName, OracleDbType type, object value)
        {
            if (null == cmd)
                return;

            // Param names will be of the form: ":<column_name>".  
            // Remove the prefix (":") and compare with column name
            if (modifiedCols != null && modifiedCols.Contains(paramName.Substring(1, paramName.Length - 1)))
                cmd.Parameters.Add(new OracleParameter { ParameterName = paramName, OracleDbType = type, Value = value, Direction = ParameterDirection.Input });
        }

        #endregion

    }
}
