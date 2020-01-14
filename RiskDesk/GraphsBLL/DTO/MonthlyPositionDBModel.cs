using System;
namespace RiskDesk.GraphsBLL.DTO
{
    public class MonthlyPositionDBModel
    {
        public string BookOfBussines { get; set; }
        public DateTime? deliverydate { get; set; }
        public string DeliveryDateString { get; set; }
        public double GrossUsageMWH { get; set; }
        public double GrossUsageDollars { get; set; }
        public double GrossUsageMW { get; set; }
    }
}