using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{
    public class HourlyScalarDTO
    {
        public string WholeSaleID { get; set; }

        public string Hour { get; set; }

        public double ubar { get; set; }
       

        public double sigmau { get; set; }


    }
}
