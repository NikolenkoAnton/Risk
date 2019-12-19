using System;

namespace RiskDesk.GraphsBLL.DTO
{
    public class ScatterPlotDBModel
    {
        public Int64 WholeSaleBlocksID { get; set; }
        public string WholeSaleBlocks { get; set; }
        public Int32 TempF { get; set; }
        public double RealTimePrice { get; set; }
        public double ErcotLoad { get; set; }
        public double LoadKW { get; set; }
    }
}