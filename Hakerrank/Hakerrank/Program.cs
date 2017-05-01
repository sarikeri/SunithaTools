using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hakerrank
{
    class Program
    {
        static void Main(string[] args)
        {
            #region Algorithm
            Algorithms algorithm = new Algorithms();
            //algorithm.UtopianTree();
            //algorithm.FindDigits();
            //algorithm.SherlockandSquares();
            //algorithm.ServiceLane();
            //algorithm.CutTheSticks();
            //algorithm.ChocolateFeast();
            //algorithm.LisasWorkbook();
            //algorithm.TheGridSearch();
            //algorithm.CircularArrayRotation();
            //algorithm.FibonacciModified();
            //algorithm.Kangaroo();
            //algorithm.DivisibleSumPairs();
            #endregion
            #region DataStructure
            DataStructure ds = new DataStructure();
            //ds.stringsfunc();
            #endregion

            #region InterviewQuestions
            InvetrviewQuestions iq = new InvetrviewQuestions();
            //iq.GetShortString();
            #endregion
            Console.WriteLine("Plz press enter to exit.....");
            Console.ReadLine();
        }
    }
}
