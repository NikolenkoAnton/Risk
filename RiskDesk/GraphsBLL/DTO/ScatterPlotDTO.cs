namespace RiskDesk.GraphsBLL.DTO
{
    public class ScatterPlotDTO
    {
        public int WholeSaleBlocksID { get; set; }
        public string WholeSaleBlocks { get; set; }
        public double TempF { get; set; }
        public double RealTimePrice { get; set; }
        public double ErcotLoad { get; set; }
        public double LoadKW { get; set; }
    }
}