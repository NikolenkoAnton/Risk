using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{
    public class PeakGraphDTO
    {
        public int id;

        public string month;

        public double cp;

        public double ncp;
    }
    public class PeakTableDTO
    {
        public string number;
        public double[] values = new double[12];
        public PeakTableDTO()
        {
            values = new double[12];
        }
    }

    public class PeakDTO
    {
        List<PeakGraphDTO> graphs { get; set; }
            
        List<PeakTableDTO> tables { get; set; }

    }
}
