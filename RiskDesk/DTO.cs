using System;
using System.Collections.Generic;
using System.Text;

namespace Deal2
{
    public class DealListDTO
    {
        public string WholeSaleDealID { get; set; }

        public string WholeSaleDealName { get; set; }

        public DateTime StartDate { get; set; }

        public int Committed { get; set; }

    }

    public class DealInfoDTO : DealListDTO
    {
        public int CustomerID { get; set; }

        public int BrokerID { get; set; }

        public string Notes { get; set; }

        public IEnumerable<DealPartDataBase> Parts { get; set; }
    }
    public class BrokerInfo
    {
        public int BrokerID { get; set; }

        public string BrokerName { get; set; }
    }
    public class CustomerInfo
    {
        public int customerid { get; set; }

        public string customername { get; set; }
    }
    public class DealPartDataBase
    {

        public int Term { get; set; }

        public float BrokerFee { get; set; }

        public float DealMargin { get; set; }

        public float RiskPremium { get; set; }

    }
    public class DealPartDataBaseLowerList
    {
        public IEnumerable<DealPartDataBase> Parts { get; set; }
    }
    public class DealPartDataBaseLower
    {

        public int term { get; set; }

        public float brokerFee { get; set; }

        public float dealMargin { get; set; }

        public float riskPremium { get; set; }

    }
    public class DealPart
    {

        public double [] Values { get; set; }

    }
}
