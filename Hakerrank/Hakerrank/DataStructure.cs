using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hakerrank
{
    class DataStructure
    {
        #region Linked List

        public void stringsfunc()
        {
            int i = 4;
            double d = 4.0;
            string s = "HackerRank ";
            // Declare second integer, double, and String variables.
            int ires;
            double dres;
            string sres;
            // Read and save an integer, double, and String to your variables.
            ires = Int32.Parse(Console.ReadLine());
            dres = double.Parse(Console.ReadLine());
            sres = Console.ReadLine();
            // Print the sum of both integer variables on a new line.
            Console.WriteLine(i + ires);
            // Print the sum of the double variables on a new line.
            Console.WriteLine(String.Format("{0:0.0}", d + dres));
            // Concatenate and print the String variables on a new line
            // The 's' variable above should be printed first.
            Console.WriteLine(s + "" + sres);
        }
        #endregion
    }
}
