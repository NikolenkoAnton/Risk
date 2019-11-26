using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{
    public class MontlyGraphDTO
    {
        public  string MonthName { get; set; }

        public double avg { get; set; }

        public double mild { get; set; }

        public double xtreme { get; set; }
    }
}
