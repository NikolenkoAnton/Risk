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
    public class ScatterPlotXMLModel
    {
        public string WholeBlockString { get; set; }
        public string CongestionZoneString { get; set; }
        public string UtilityAccountNumberString { get; set; }
        public string MonthsString { get; set; }
        public string HoursString { get; set; }
    }
}