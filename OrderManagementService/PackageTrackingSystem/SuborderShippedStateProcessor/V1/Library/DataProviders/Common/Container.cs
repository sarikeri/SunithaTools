using System;
using System.Configuration;
using System.IO;
using System.Reflection;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;

namespace Wag.Oms.SOS.DataProviders.Common
{
    public class Container
    {
        private static readonly object lockInstance = new object();
        private static bool inited;
        private static Container instance;
        private UnityContainer unityContainerInstance;
        private static string dataSource;

        private Container()
        {
        }

        public static Container GetUnityContainer
        {
            get
            {
                OneTimeInit();
                return instance;
            }
        }

        private static void OneTimeInit()
        {
            if (inited)
                return;

            lock (lockInstance)
            {
                if (inited)
                    return;

                var unityContainer = new UnityContainer();

                string assemblyPath = new Uri(Assembly.GetExecutingAssembly().CodeBase).AbsolutePath;
                string configFile = Path.Combine(Path.GetDirectoryName(assemblyPath), Constants.DbConfig);
                Configuration config = ConfigurationManager.OpenExeConfiguration(configFile);
                UnityConfigurationSection section = (UnityConfigurationSection)config.GetSection("unity");

                if (section != null)
                    unityContainer.LoadConfiguration(section);

                instance = new Container { unityContainerInstance = unityContainer };

                dataSource = ConfigurationManager.AppSettings["DataSource"];

                inited = true;
            }
        }

        public static T Resolve<T>()
        {
            return GetUnityContainer.unityContainerInstance.Resolve<T>();
        }

        public static T Resolve<T>(string name)
        {
            return GetUnityContainer.unityContainerInstance.Resolve<T>(name);
        }


        public static T GetInstance<T>()
        {
            return GetUnityContainer.unityContainerInstance.Resolve<T>(dataSource);
        }

    }
}
