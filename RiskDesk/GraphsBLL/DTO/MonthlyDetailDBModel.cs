using System;

namespace RiskDesk.GraphsBLL.DTO
{
    public class MonthlyDetailDBModel
    {
        public string BookOfBusiness { get; set; }
        public DateTime? deliverydate { get; set; }
        public string DeliveryDateString { get; set; }
        public double NetUsage { get; set; }
        public double GrossUsage { get; set; }
        public double CostTotal { get; set; }
        public double C_Energy { get; set; }
        public double C_Losses { get; set; }
        public double C_Basis { get; set; }
        public double C_VolRisk { get; set; }
        public double C_ANC { get; set; }
        public double C_ADMIN_MISC { get; set; }
        public double C_CRR { get; set; }
        public double Revenue { get; set; }
        public double NetRevenue { get; set; }
    }
}