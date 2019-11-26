using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{
    public class MonthlyDTO
    {
        public string MonthName { get; set; }

        public double firstBlock { get; set; }

        public double secondBlock { get; set; }

        public double thirdBlock { get; set; }
    }
}
