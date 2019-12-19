using System;
using System.Collections.Generic;

namespace RiskDesk.GraphsBLL.DTO
{
    public class PeakDBModel
    {
        public List<PeakMonthsDBModel> PeakMonths { get; set; }
        public List<PeakAccNumbersDBModel> PeakAccNumbers { get; set; }
    }

    public class PeakMonthsDBModel
    {
        public Int32 MonthsNamesID { get; set; }
        public string MonthsShortName { get; set; }
        public string MonthsLongName { get; set; }
        public double Maxsysmax { get; set; }
        public double AvgCP { get; set; }
        public double AvgNCP { get; set; }
        public double AvgCoincidenceFactor { get; set; }
    }

    public class PeakAccNumbersDBModel : PeakMonthsDBModel
    {
        public string UtilityAccountNumber { get; set; }
    }
}