using System;
using System.Collections.Generic;

namespace RiskDesk.GraphsBLL.DTO
{
    public class ErcotDTO
    {
        //public int WholeSaleBlocksID { get; set; }
        public string WholeSaleBlocks { get; set; }
        //public Int64 UtilityAccountNumber { get; set; }
        //public DateTime XDATE { get; set; }
        //public int XMONTH { get; set; }
        // public double HE { get; set; }
        public double TempF { get; set; }
        // public double RealTimePrice { get; set; }
        public double ErcotLoad { get; set; }
        public double LoadKW { get; set; }
    }

    public class ErcotMonthDTO
    {
        public List<ErcotDTO> data { get; set; }

        public int order { get; set; }
    }
}