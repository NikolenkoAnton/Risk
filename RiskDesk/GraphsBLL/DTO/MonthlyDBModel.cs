using System;

namespace RiskDesk.GraphsBLL.DTO
{
    public class MonthlyDBModel
    {

        public Int32 WholeSaleBlocksID { get; set; }
        public string WholeSaleBlocks { get; set; }
        public Int32 MonthsNamesID { get; set; }
        public string MonthsShortName { get; set; }

        public string MonthsLongName { get; set; }
        public double ubarmwh { get; set; }
        public double ubarMW { get; set; }
        public double Pbar { get; set; }
        public double pshaped { get; set; }
        public double pvolrisk { get; set; }
        public double RetailRiskAdder { get; set; }
        public double RevatRiskMult { get; set; }
    }

}
