using System;
namespace RiskDesk.GraphsBLL.DTO
{
    public class ErcotDBModel
    {
        public Int64 WholeSaleBlocksID { get; set; }
        public string WholeSaleBlocks { get; set; }

        public string UtilityAccountNumber { get; set; }

        public DateTime XDATE { get; set; }

        public Int32 XMONTH { get; set; }

        public Int32 HE { get; set; }
        public double TempF { get; set; }

        public double RealTimePrice { get; set; }
        public double ErcotLoad { get; set; }
        public double LoadKW { get; set; }


    }
}