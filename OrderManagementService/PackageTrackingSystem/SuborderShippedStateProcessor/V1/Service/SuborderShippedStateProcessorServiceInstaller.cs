using System.ComponentModel;
using System.ServiceProcess;

namespace Wag.Oms.SOS.SuborderShippedStateProcessorService
{
    [RunInstaller(true)]
    public partial class SuborderShippedStateProcessorServiceInstaller : System.Configuration.Install.Installer
    {

        public SuborderShippedStateProcessorServiceInstaller(string username, string password)
        {
            InitializeComponent();

            var processInstaller = new ServiceProcessInstaller();

            processInstaller.Account = ServiceAccount.User;
            processInstaller.Username = username;
            processInstaller.Password = password;

            Installers.Add(processInstaller);

            var serviceInstaller = new ServiceInstaller();
            serviceInstaller.DisplayName = "SuborderShippedStateProcessorService";
            serviceInstaller.StartType = ServiceStartMode.Manual;
            serviceInstaller.ServiceName = "SuborderShippedStateProcessorService";//must be the same as what was set in Program's constructor

            Installers.Add(serviceInstaller);

        }

        public SuborderShippedStateProcessorServiceInstaller(ServiceAccount serviceAccount, string displayName, ServiceStartMode serviceStartMode, string serviceName)
        {
            InitializeComponent();

            var processInstaller = new ServiceProcessInstaller();
            processInstaller.Account = serviceAccount; //set the privileges


            Installers.Add(processInstaller);

            var serviceInstaller = new ServiceInstaller();
            serviceInstaller.DisplayName = displayName;
            serviceInstaller.StartType = serviceStartMode;
            serviceInstaller.ServiceName = serviceName;//must be the same as what was set in Program's constructor

            Installers.Add(serviceInstaller);

        }
    }
}
