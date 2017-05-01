using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Numerics;

namespace Hakerrank
{
    public class Algorithms
    {
        #region Implementation
        //Not done
        public void SherlockandTheBeast()
        {
            Console.WriteLine("Enter No of cases");
            int countT = int.Parse(Console.ReadLine());
            for (int i = 0; i < countT; i++)
            {
                Console.WriteLine("Enter Number");
                int number = int.Parse(Console.ReadLine());
                if (number <= 1)
                    Console.WriteLine("-1");
                else
                {
                    for (int j = 0; j < 10; j++)
                    {

                    }
                }
            }
        }

        public void UtopianTree()
        {
            //The Utopian Tree goes through 2 cycles of growth every year.Each spring, it doubles in height.Each summer, its height increases by 1 meter.
            //Laura plants a Utopian Tree sapling with a height of 1 meter at the onset of spring. How tall will her tree be after NN growth cycles?
            //Input Format
            //The first line contains an integer, TT, the number of test cases. 
            //TT subsequent lines each contain an integer, NN, denoting the number of cycles for that test case.
            //Constraints
            //1≤T≤101≤T≤10
            //0≤N≤600≤N≤60
            //Output Format
            //For each test case, print the height of the Utopian Tree after NN cycles.Each height must be printed on a new line.
            int countT = int.Parse(Console.ReadLine());
            for (int i = 0; i < countT; i++)
            {
                int treeHeight = 1;
                int number = int.Parse(Console.ReadLine());
                for (int j = 1; j <= number; j++)
                {
                    if (j % 2 == 1)
                        treeHeight += treeHeight;
                    else
                        treeHeight += 1;
                }
                Console.WriteLine(treeHeight);
            }

        }

        public void FindDigits()
        {
            //Given an integer, NN, traverse its digits(dd1, dd2,..., ddn) and determine how many digits evenly divide NN (i.e.: count the number of times NN divided by each digit ddi has a remainder of 00). Print the number of evenly divisible digits.
            // Note: Each digit is considered to be unique, so each occurrence of the same evenly divisible digit should be counted (i.e.: for N = 111N = 111, the answer is 33).
            //     Input Format
            //     The first line is an integer, TT, indicating the number of test cases. 
            //The TT subsequent lines each contain an integer, NN.
            //Constraints
            //1≤T≤151≤T≤15
            //0 < N < 1090 < N < 109
            //Output Format
            //For every test case, count and print(on a new line) the number of digits in NN that are able to evenly divide NN.
            Console.WriteLine("Enter No of cases");
            int countT = int.Parse(Console.ReadLine());
            for (int i = 0; i < countT; i++)
            {
                int count = 0;
                Console.WriteLine("Enter Number");
                int number = int.Parse(Console.ReadLine());
                int newnum = number;
                do
                {
                    int divnum = newnum % 10;
                    newnum = newnum / 10;
                    if (divnum != 0)
                    {
                        if (number % divnum == 0)
                            count++;
                    }
                } while (newnum > 0);
                Console.WriteLine(count);
            }
        }

        //Timeout issue
        public void SherlockandSquares()
        {
            //Watson gives two integers (AA and BB) to Sherlock and asks if he can count the number of square integers between AA and BB(both inclusive).
            //Note: A square integer is an integer which is the square of any integer. For example, 1, 4, 9, and 16 are some of the square integers as they are squares of 1, 2, 3, and 4, respectively.
            //Input Format
            //The first line contains TT, the number of test cases.TT test cases follow, each in a new line.
            //Each test case contains two space - separated integers denoting AA and BB.
            // Output Format
            //For each test case, print the required answer in a new line.
            //Constraints
            //1≤T≤1001≤T≤100
            //1≤A≤B≤109
            Console.WriteLine("Enter No of cases");
            int countT = int.Parse(Console.ReadLine());
            for (int i = 0; i < countT; i++)
            {
                Console.WriteLine("Enter Number1 Number2");
                string str = Console.ReadLine();
                int number1 = int.Parse(str.Split(' ')[0]);
                int number2 = int.Parse(str.Split(' ')[1]);
                if (number1 < 1 || number1 > number2)
                    Console.WriteLine(0);
                else
                {
                    int totlasquares = 0;
                    for (int j = number1; j <= number2; j++)
                    {
                        long tst = (long)(Math.Sqrt(j) + 0.5);
                        if (tst * tst == j)
                            totlasquares++;
                    }
                    Console.WriteLine(totlasquares);
                }
            }
        }

        public void ServiceLane()
        {
            //Calvin is driving his favorite vehicle on the 101 freeway.He notices that the check engine light of his vehicle is on, and he wants to service it immediately to avoid any risks.Luckily, a service lane runs parallel to the highway. The length of the service lane is NN units.The service lane consists of NN segments of equal length and different width.
            //Calvin can enter to and exit from any segment.Let's call the entry segment as index ii and the exit segment as index jj. Assume that the exit segment lies after the entry segment (i≤ji≤j) and 0≤i0≤i. Calvin has to pass through all segments from index ii to index jj (both inclusive).
            //Paradise Highway
            //Calvin has three types of vehicles -bike, car, and truck -represented by 11, 22 and 33, respectively.These numbers also denote the width of the vehicle.
            //You are given an array widthwidth of length NN, where width[k]width[k] represents the width of the kkth segment of the service lane.It is guaranteed that while servicing he can pass through at most 10001000 segments, including the entry and exit segments.
            //If width[k] = 1width[k] = 1, only the bike can pass through the kkth segment.
            //    If width[k] = 2width[k] = 2, the bike and the car can pass through the kkth segment.
            //        If width[k] = 3width[k] = 3, all three vehicles can pass through the kkth segment.
            //            Given the entry and exit point of Calvin's vehicle in the service lane, output the type of the largest vehicle which can pass through the service lane (including the entry and exit segments).
            //Input Format
            //The first line of input contains two integers, NN and TT, where NN denotes the length of the freeway and TT the number of test cases. The next line has NN space-separated integers which represent the widthwidth array.
            //TT test cases follow. Each test case contains two integers, ii and jj, where ii is the index of the segment through which Calvin enters the service lane and jj is the index of the lane segment through which he exits.
            //Constraints
            //2≤N≤1000002≤N≤100000
            //1≤T≤10001≤T≤1000
            //0≤i < j < N0≤i < j < N
            //2≤j−i + 1≤min(N, 1000)2≤j−i + 1≤min(N, 1000)
            //1≤width[k]≤3,where 0≤k < N1≤width[k]≤3,where 0≤k < N
            //Output Format
            //For each test case, print the number that represents the largest vehicle type that can pass through the service lane.
            //Note: Calvin has to pass through all segments from index ii to index jj(both inclusive).
            string[] tokens_n = Console.ReadLine().Split(' ');
            int n = Convert.ToInt32(tokens_n[0]);
            int t = Convert.ToInt32(tokens_n[1]);
            string[] width_temp = Console.ReadLine().Split(' ');
            int[] width = Array.ConvertAll(width_temp, Int32.Parse);
            for (int a0 = 0; a0 < t; a0++)
            {
                string[] tokens_i = Console.ReadLine().Split(' ');
                int i = Convert.ToInt32(tokens_i[0]);
                int j = Convert.ToInt32(tokens_i[1]);
                int smallest = Convert.ToInt32(width[i]);
                for (int k = i; k <= j; k++)
                {
                    if (Convert.ToInt32(width[k]) < smallest)
                    {
                        smallest = Convert.ToInt32(width[k]);
                    }
                }
                Console.WriteLine(smallest);
            }
        }

        public void CutTheSticks()
        {
            //You are given sticks, where the length of each stick is a positive integer. A cut operation is performed on the sticks such that all of them are reduced by the length of the smallest stick.
            //Suppose we have six sticks of the following lengths:
            //            5 4 4 2 2 8
            //Then, in one cut operation we make a cut of length 2 from each of the six sticks. For the next cut operation four sticks are left(of non - zero length), whose lengths are the following:
            //            3 2 2 6
            //The above step is repeated until no sticks are left.
            //Given the length of  sticks, print the number of sticks that are left before each subsequent cut operations.
            //Note: For each cut operation, you have to recalcuate the length of smallest sticks (excluding zero - length sticks).
            //Input Format
            //The first line contains a single integer.
            //The next line contains  integers: a0, a1,...aN - 1 separated by space, where ai represents the length of ith stick.
            //Output Format
            //For each operation, print the number of sticks that are cut, on separate lines.
            //Constraints
            //1 ≤ N ≤ 1000
            //1 ≤ ai ≤ 1000
            Console.WriteLine("Enter sticks Count");
            int n = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(String.Format("Enter {0} sticks lengths", n));
            string[] arr_temp = Console.ReadLine().Split(' ');
            int[] arr = Array.ConvertAll(arr_temp, Int32.Parse);
            do
            {
                arr = GetArray(arr);
                int minLen = arr.Min();
                Console.WriteLine(arr.Length);
                for (int i = 0; i < arr.Length; i++)
                {
                    if (arr[i] == 0)
                        continue;
                    else
                        arr[i] -= minLen;
                }
            } while (n-- > 0 && arr.Length > 1);

        }
        private int[] GetArray(int[] inputarray)
        {
            string str = string.Empty;
            for (int i = 0; i < inputarray.Length; i++)
            {
                if (inputarray[i] > 0)
                    str += inputarray[i] + " ";
            }
            return Array.ConvertAll(str.TrimEnd().Split(' '), Int32.Parse);
        }

        public void ChocolateFeast()
        {
            //Little Bob loves chocolate, and he goes to a store with  in his pocket. The price of each chocolate is . 
            //The store offers a discount: for every wrappers he gives to the store, he gets one chocolate for free.How many chocolates does Bob get to eat ?
            //Input Format: 
            //The first line contains the number of test cases, .
            //lines follow, each of which contains three integers, , , and.
            //Output Format: 
            //Print the total number of chocolates Bob eats.
            Console.WriteLine("Enter Test Case Count");
            int t = Convert.ToInt32(Console.ReadLine());
            for (int a0 = 0; a0 < t; a0++)
            {
                string[] tokens_n = Console.ReadLine().Split(' ');
                Console.WriteLine("Enter amount $N Bob has");
                int n = Convert.ToInt32(tokens_n[0]);
                Console.WriteLine("Enter $C chocolate cost");
                int c = Convert.ToInt32(tokens_n[1]);
                Console.WriteLine("Enter M wrappers to get one Chocolate");
                int m = Convert.ToInt32(tokens_n[2]);
                int grandtotal = n / c;
                int count = n / c;
                while (count >= m)
                {
                    grandtotal += count / m;
                    count = count / m + count % m;
                }
                Console.WriteLine(grandtotal);
            }
        }

        public void LisasWorkbook()
        {
            //Lisa just got a new math workbook.A workbook contains exercise problems, grouped into chapters.
            //There are n chapters in Lisa's workbook, numbered from  to .
            //The - ith chapter has ti problems, numbered from 1 to ti.
            // Each page can hold up to k problems.There are no empty pages or unnecessary spaces, so only the last page of a chapter may contain fewer than problems.
            //Each new chapter starts on a new page, so a page will never contain problems from more than one chapter.
            //The page number indexing starts at .
            //Lisa believes a problem to be special if its index(within a chapter) is the same as the page number where it's located. Given the details for Lisa's workbook, can you count its number of special problems?
            //Note: See the diagram in the Explanation section for more details.
            //Input Format
            //The first line contains two integers  and  — the number of chapters and the maximum number of problems per page respectively.
            //The second line contains  integers, where  denotes the number of problems in the - th chapter.
            //Constraints
            //Output Format
            //Print the number of special problems in Lisa's workbook.
            //Console.WriteLine("Enter Chapters count :");
            //int chap=int.Parse(Console.ReadLine());
            //Console.WriteLine("Problems count in each page:");
            //int k = int.Parse(Console.ReadLine());
            //Console.WriteLine("Enter problems");
            string[] str = Console.ReadLine().Split(' ');
            int chap = int.Parse(str[0]);
            int k = int.Parse(str[1]);
            int[] problems = Array.ConvertAll(Console.ReadLine().Split(' '), Int32.Parse);
            int pageno = 1;
            int specialProblem = 0;
            for (int i = 0; i < chap; i++)
            {
                int temp = 0;
                for (int j = 1; j <= problems[i]; j++)
                {
                    if (temp == k)
                    {
                        pageno++;
                        temp = 0;
                    }
                    if (j == pageno)
                        specialProblem++;
                    temp++;

                }
                pageno++;
            }
            Console.WriteLine(specialProblem);
        }

        public void TheGridSearch()
        {
            //Given a 2D array of digits, try to find the occurrence of a given 2D pattern of digits.For example, consider the following 2D matrix:
            //1234567890
            //0987654321
            //1111111111
            //1111111111
            //2222222222
            //Assume we need to look for the following 2D pattern:
            //876543
            //111111
            //111111
            //If we scan through the original array, we observe that the 2D pattern begins at the second row and the third column of the larger grid(the  in the second row and third column of the larger grid is the top - left corner of the pattern we are searching for).
            // So, a 2D pattern of  digits is said to be present in a larger grid , if the latter contains a contiguous, rectangular 2D grid of digits matching with the pattern , similar to the example shown above.
            //Input Format
            //The first line contains an integer, , which is the number of test cases.  test cases follow, each having a structure as described below:
            //            The first line contains two space-separated integers,  and , indicating the number of rows and columns in the grid, respectively. 
            //This is followed by lines, each with a string of  digits, which represent the grid . 
            //The following line contains two space-separated integers,  and , indicating the number of rows and columns in the pattern grid.
            //This is followed by lines, each with a string of  digits, which represent the pattern .
            //Constraints
            //Test Case Generation
            //Each individual test case has been generated by first specifying the size (and)of the large 2D matrix, and then randomly generating the digits in it.A limited number of digits in the larger matrix may be changed by the problem setter(no more than 5 % of the total number of digits in the matrix).So the larger 2D matrix is almost - random.The pattern matrix has been manually - curated by the problem setter.
            //Output Format
            //Display 'YES' or 'NO', depending on whether(or not) you find that the larger grid  contains the rectangular pattern.The evaluation will be case sensitive.
            int t = Convert.ToInt32(Console.ReadLine());
            for (int a0 = 0; a0 < t; a0++)
            {
                string[] tokens_R = Console.ReadLine().Split(' ');
                int R = Convert.ToInt32(tokens_R[0]);
                int C = Convert.ToInt32(tokens_R[1]);
                string[] G = new string[R];
                for (int G_i = 0; G_i < R; G_i++)
                {
                    G[G_i] = Console.ReadLine();
                }
                string[] tokens_r = Console.ReadLine().Split(' ');
                int r = Convert.ToInt32(tokens_r[0]);
                int c = Convert.ToInt32(tokens_r[1]);
                string[] P = new string[r];
                for (int P_i = 0; P_i < r; P_i++)
                {
                    P[P_i] = Console.ReadLine();
                }
            }
        }

        public void CircularArrayRotation()
        {
            //John Watson performs an operation called a right circular rotation on an array of integers, . After performing one right circular rotation operation, the array is transformed from to.

            //Watson performs this operation times. To test Sherlock's ability to identify the current element at a particular position in the rotated array, Watson asks  queries, where each query consists of a single integer, , for which you must print the element at index  in the rotated array (i.e., the value of ).

            //Input Format

            //The first line contains 3 space - separated integers,n,k, and q, respectively.
            string[] elements = Console.ReadLine().Split(' ');
            int n = int.Parse(elements[0]);
            int k = int.Parse(elements[1]);
            int m = int.Parse(elements[2]);
            //  The second line contains  space - separated integers, where each integer describes array element  (where).
            string[] arrayelements = Console.ReadLine().Split(' ');
            //   Each of the  subsequent lines contains a single integer denoting m.
            int[] melements = new int[m];
            for (int i = 0; i < m; i++)
            {
                melements[i] = int.Parse(Console.ReadLine());
            }
            for (int i = 0; i < melements.Count(); i++)
            {
                int ktemp = k;
                if (k > n)
                    ktemp = k - n;
                int arrelement = (((n - ktemp) + melements[i]) % n);
                Console.WriteLine(arrayelements[arrelement]);
            }
        }

        public void FibonacciModified()
        {
            //For example, if term t1=0 and t2=1 , term t3=0+squear(1)=1 , term t4=1+squear(1)=2, term  t4=1+squear(2)=5, and so on.

            //Given three integers,t1 , t2, and n, compute and print term tn of a modified Fibonacci sequence.

            /*Note: The value of tn may exceed the range of a 64-bit integer.
             * Many submission languages have libraries that can handle such large results but, 
             * for those that don't (e.g., C++), you will need to be more creative in your solution 
             * to compensate for the limitations of your chosen submission language.*/

            //Input Format

            //A single line of three space - separated integers describing the respective values of t1,t2, and n.
            string[] elements = Console.ReadLine().Split(' ');
            BigInteger t1 = BigInteger.Parse(elements[0]);
            BigInteger t2 = BigInteger.Parse(elements[1]);
            int n = int.Parse(elements[2]);
            BigInteger finalvalue = 0;
            for (int i = 2; i < n; i++)
            {
                finalvalue = t1 + (t2*t2);
                t1 = t2;
                t2 = finalvalue;
            }
            Console.WriteLine(finalvalue);
            
        }

        public void SynchronousShopping()
        {

        }

        public void Kangaroo()
        {
            /*There are two kangaroos on an x - axis ready to jump in the positive direction
             * (i.e, toward positive infinity).The first kangaroo starts at location and moves 
             * at a rate of meters per jump. The second kangaroo starts at location  and moves at
             *  a rate of  meters per jump.Given the starting locations and movement rates for each 
             *  kangaroo, can you determine if they'll ever land at the same location at the same time?
             *  */
            //Input Format

            //A single line of four space-separated integers denoting the respective values of,x1 ,v1 ,x2 and v2.
            //Output Format

            //Print YES if they can land on the same location at the same time; otherwise, print NO.

            string[] tokens_x1 = Console.ReadLine().Split(' ');
            int x1 = Convert.ToInt32(tokens_x1[0]);
            int v1 = Convert.ToInt32(tokens_x1[1]);
            int x2 = Convert.ToInt32(tokens_x1[2]);
            int v2 = Convert.ToInt32(tokens_x1[3]);
            string output = "NO";
            if ((x2 > x1) && (v2 > v1))
                output = "NO";
            else
            {
                int maxvalue = 10000;
                do
                {
                    x1 = x1 + v1;
                    x2 = x2 + v2;
                    if (x1 == x2)
                    {
                        output = "YES";
                        break;
                    }
                    maxvalue--;
                } while (maxvalue > 0);
            }
            Console.WriteLine(output);
        }

        public void DivisibleSumPairs()
        {
            /* You are given an array of n integers,a0,a1,...,an-1, and a positive integer, k. 
            Find and print the number of pairs(i,j)where i<j and ai + aj is evenly divisible by k.*/

            //Input Format

            //The first line contains 2 space - separated integers,n  and k, respectively.
            //  The second line contains n space - separated integers describing the respective values of a0,a1,...,an-1 .

            //Constraints 2<=n<=100 ; 1<=k<=100; 1<=ai<=100

            //Output Format

            //Print the number of pairs(i,j)where i<j and ai + aj is evenly divisible by k.
            string[] tokens_n = Console.ReadLine().Split(' ');
            int n = Convert.ToInt32(tokens_n[0]);
            int k = Convert.ToInt32(tokens_n[1]);
            string[] a_temp = Console.ReadLine().Split(' ');
            int[] a = Array.ConvertAll(a_temp, Int32.Parse);
            int pairs = 0;
            for (int i = 0; i < a.Count() - 1; i++)
            {
                for (int j = i + 1; j < a.Count(); j++)
                {
                    if ((a[i] + a[j]) % k == 0)
                        pairs++;
                }
            }
            Console.WriteLine(pairs);
        }

        public void NonDivisibleSubset()
        {
            /* Given a set, S, of n distinct integers, print the size of a maximal subset,S' , 
            of S where the sum of any 2 numbers in S' are not evenly divisible by k.*/

            //Input Format

            //The first line contains 2 space - separated integers, n and k, respectively.
            //  The second line contains n space - separated integers(we'll refer to the ith value as ai) describing the unique values of the set.


            //    Constraints:1<=n<=105;


            //    All of the given numbers are distinct.
            //    Output Format


            //    Print the size of the largest possible subset().
        }

        #endregion
        //Not done
        #region Sorting
        public void InsertionSort()
        {

        }
        #endregion
    }
}
