using System;

namespace RiskDesk.GraphsBLL.DTO
{
    public class RiskDBModel
    {
        public string MonthsShortName { get; set; }
        public string MonthsLongName { get; set; }
        public double RetailAdder { get; set; }
        public double volriskstdevNorm { get; set; }
        public Int32 xMonth { get; set; }

    }
}