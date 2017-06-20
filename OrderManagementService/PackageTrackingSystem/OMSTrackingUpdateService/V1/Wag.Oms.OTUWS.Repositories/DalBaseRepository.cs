using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Oracle.DataAccess.Client;

namespace Wag.Oms.OTUWS.Repositories
{
    public abstract class DalBaseRepository<T>
    {
        private string _connString;
        private OracleConnection _connection { get; set; }

        protected OracleConnection Connection
        {
            get
            {
                if (_connection == null)
                {
                    _connection = new OracleConnection(_connString);
                }

                return _connection;
            }
        }

        public string ConnectionString
        {
            get
            {
                return _connString;
            }
            set
            {
                _connString = value;
            }
        }

        public abstract string SelectAllSql { get; }
        protected abstract T ConstructDbEntity(IDataReader dr);

        #region Protected methods

        protected List<T> GetList(string query)
        {
            var lstResult = new List<T>();

            lstResult.AddRange(ExecuteQuery(query));

            return lstResult;
        }

        protected List<T> GetList(string query, Action<OracleCommand> fnPrepareCommand)
        {
            var lstResult = new List<T>();

            lstResult.AddRange(ExecuteQuery(query, fnPrepareCommand));

            return lstResult;
        }

        protected IEnumerable<T> ExecuteQuery(string query)
        {
            return ExecuteQuery(query, null);
        }

        protected IEnumerable<T> ExecuteQuery(string query, Action<OracleCommand> fnPrepareCommand)
        {
            if (Connection.State != ConnectionState.Open)
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
                if (Connection.State != ConnectionState.Closed)
                    Connection.Close();
            }
        }

        protected I GetScalar<I>(string query, Action<OracleCommand> fnPrepareCommand, string column)
        {
            if (Connection.State != ConnectionState.Open)
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
                            return PullScalar<I>(reader, column);
                        }
                    }
                }
            }
            finally
            {
                if (Connection.State != ConnectionState.Closed)
                    Connection.Close();
            }

            return default(I);
        }

        private static I PullScalar<I>(IDataReader dr, string column)
        {
            int index = dr.GetOrdinal(column);

            if (!dr.IsDBNull(index))
            {
                if (!ScalarConversion.ContainsKey(typeof(I)))
                    throw new InvalidCastException("Unsupported type: " + typeof(I).FullName);

                return (I)ScalarConversion[typeof(I)](dr, index);
            }

            return default(I);
        }

        private static readonly Dictionary<Type, Func<IDataReader, int, object>> ScalarConversion =
            new Dictionary<Type, Func<IDataReader, int, object>>
            {
                { typeof (long), (dr, i) => (long)dr.GetDecimal(i) },
                { typeof (string), (dr, i) => dr.GetString(i) },
                { typeof (int), (dr, i) => (int)dr.GetDecimal(i) },
                { typeof (bool), (dr, i) => (decimal.Zero == dr.GetDecimal(i)) },
                { typeof (decimal), (dr, i) => dr.GetDecimal(i) },
                { typeof (DateTime), (dr, i) => dr.GetDateTime(i) }
            };

        protected int ExecuteNonQuery(string sqlStmt)
        {
            return ExecuteNonQuery(sqlStmt, null);
        }

        protected int ExecuteNonQuery(string sqlStmt, Action<OracleCommand> fnPrepareCommand)
        {
            int rowsAffected = 0;

            if (Connection.State != ConnectionState.Open)
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
                if (Connection.State != ConnectionState.Closed)
                    Connection.Close();
            }

            return rowsAffected;
        }

        protected int ExecuteNonQuery(string sqlStmt, Action<OracleCommand> fnPrepareCommand, OracleConnection conn)
        {
            using (var command = new OracleCommand(sqlStmt, conn))
            {
                command.CommandType = CommandType.Text;

                if (null != fnPrepareCommand)
                    fnPrepareCommand(command);

                return command.ExecuteNonQuery();
            }
        }

        protected T GetEntity(string query, Action<OracleCommand> fnPrepareCommand)
        {
            if (Connection.State != ConnectionState.Open)
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
                    return default(T);
                }
            }
            finally
            {
                if (Connection.State != ConnectionState.Closed)
                    Connection.Close();
            }
        }

        protected void AddInParameter(DbCommand cmd, string paramName, OracleDbType type, object value)
        {
            if (null == cmd)
                return;

            cmd.Parameters.Add(new OracleParameter { ParameterName = paramName, OracleDbType = type, Value = value, Direction = ParameterDirection.Input });
        }

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
