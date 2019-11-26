using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{
    public class AccIdGraphDTO
    {
        public string AccNumber { get; set; }

        public double Percentage { get; set; }

        public double RetailRiskAdder { get; set; }

        public double RevatRisk { get; set; }
    }
}
