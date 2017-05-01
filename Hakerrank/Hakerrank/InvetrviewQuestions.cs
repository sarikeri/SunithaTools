using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hakerrank
{
    class InvetrviewQuestions
    {
        public void GetShortString()
        {
            string str = "aFFFfffca";
            //"AAAA";
            //"a";
            //"123334566775588888888888";
            //"ABCDEFGHIJ";
            //"AAAccXXXXfDDDDDDDDEFFF";
            // "aFFFfffca"
            StringBuilder res = new StringBuilder();
            int k = 1;
            if (str.Length > 2)
            {
                for (int i = 1; i < str.Length; i++)
                {
                    if (i == str.Length - 1 || str[i - 1] != str[i])
                    {
                        if (str[i - 1] != str[i])
                            res.Append(k > 1 ? str[i - 1].ToString() + k.ToString() : str[i - 1].ToString());
                        if (i == str.Length - 1)
                            res.Append(k > 1 ? str[i].ToString() + (k + 1).ToString() : str[i].ToString());
                        k = 1;
                    }
                    else
                    {
                        k++;
                    }
                }
            }
            else { res.Append(str); }
            Console.WriteLine(res.ToString());
        }
    }
}
