using System;
using System.Collections;
using System.Configuration.Install;
using System.Reflection;
using System.ServiceProcess;
using Wag.Oms.SOS.Logging;

namespace Wag.Oms.SOS.SuborderShippedStateProcessorService
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            var cmd = string.Empty;
            if (args.Length > 0)
            {
                cmd = args[0];
            }

            switch (cmd)
            {
                case "/install":
                    if (args.Length < 3)
                    {
                        //LogIt(null, "Usage: OMRefresh.exe /install <uid> <pwd>");
                        return;
                    }
                    InstallService(args[1], args[2]);
                    break;

                case "/uninstall":
                    UninstallService();
                    break;

                case "/run":
                    var suborderShippedStateProcessorService = new SuborderShippedStateProcessorService();
                    suborderShippedStateProcessorService.StartService(args);

                    AppDomain.CurrentDomain.UnhandledException += (sender, eventArgs) =>
                    {
                        var ex = eventArgs.ExceptionObject as Exception;
                        if (ex != null)
                        {
                            Logger.Log(LogLevel.Error, new LogBag().AddToBag(ex), "Caught unhandled exception");
                        }
                        else
                        {
                            Logger.Log(LogLevel.Error, "Something bad happened. The process may exit.");
                        }
                    };

                    AppDomain.CurrentDomain.ProcessExit += (sender, eventArgs) => suborderShippedStateProcessorService.StopService();

                    Console.WriteLine("Press 'Q' to exit");
                    ConsoleKeyInfo key = Console.ReadKey();
                    while (key.KeyChar != 'Q' && key.KeyChar != 'q')
                    {
                        key = Console.ReadKey();
                    }

                    suborderShippedStateProcessorService.StopService();
                    break;


                default:
                    ServiceBase.Run(new SuborderShippedStateProcessorService());
                    break;
            }
        }

        private static void InstallService(string uid, string pwd)
        {
            SetupService(true, uid, pwd);
        }

        private static void UninstallService()
        {
            SetupService(false, null, null);
        }

        private static void SetupService(bool install, string uid, string pwd)
        {
            try
            {
                Logger.Log(LogLevel.Information, new LogBag(), "{0} service {1}", install ? "installing" : "uninstalling", "SuborderShippedStateProcessorService");

                var processInstaller = new System.ServiceProcess.ServiceProcessInstaller();
                processInstaller.Account = ServiceAccount.User;
                processInstaller.Username = uid;
                processInstaller.Password = pwd;

                var serviceInstaller = new System.ServiceProcess.ServiceInstaller();
                serviceInstaller.ServiceName = "SuborderShippedStateProcessorService";
                serviceInstaller.DisplayName = "SuborderShippedStateProcessorService";
                serviceInstaller.Description = "SuborderShippedStateProcessorService";
                serviceInstaller.StartType = ServiceStartMode.Automatic;

                var path = String.Format("/assemblypath={0}", Assembly.GetExecutingAssembly().Location);

                var ti = new TransactedInstaller();
                var ctx = new InstallContext(string.Empty, new String[] { path });
                ti.Installers.Add(processInstaller);
                ti.Installers.Add(serviceInstaller);
                ti.Context = ctx;

                if (install)
                    ti.Install(new Hashtable());
                else
                    ti.Uninstall(null);

                Logger.Log(LogLevel.Information, new LogBag(), "Done with {0} service {1}", install ? "installing" : "uninstalling", "SuborderShippedStateProcessorService");
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Information, new LogBag().AddToBag(ex), "Caught unhandled exception");
            }
        }
    }
}



