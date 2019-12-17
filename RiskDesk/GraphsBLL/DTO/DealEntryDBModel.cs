using System;
using System.Collections.Generic;

namespace RiskDesk.GraphsBLL.DTO
{
    public class DealEntryDBModel
    {
        public List<DealDBModel> Deals { get; set; }

        public List<DealBlock> Blocks { get; set; }

        public List<CounterpartyVolumeDeal> CounterVolumes { get; set; }
        public List<CounterpartyGrossMarginDeal> CounterGrossMargins { get; set; }
    }
    public class DealDBModel
    {
        public Int64 SupplyID { get; set; }
        public DateTime CurveDate { get; set; }
        public Int64 DealID { get; set; }
        public string CounterParty { get; set; }
        public string CounterPartySecond { get; set; }
        public DateTime DealDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string WholeSaleBlock { get; set; }
        public string SetPoint { get; set; }
        public string SetLocation { get; set; }
        public Int32 VolumeMW { get; set; }
        public double Price { get; set; }
        public double Fee { get; set; }
        public Int64 VolumeMWh { get; set; }
        public double Cost { get; set; }
        public double MTM { get; set; }
        public double GrossMargin { get; set; }
        public Int32 Active { get; set; }


    }

    public class DealBlock
    {
        public string WholeSaleBlock { get; set; }
        public double VolumeMWh { get; set; }
    }

    public class CounterpartyVolumeDeal
    {
        public string CounterParty { get; set; }

        public double VolumeMWh { get; set; }

    }

    public class CounterpartyGrossMarginDeal
    {
        public string CounterParty { get; set; }

        public double GrossMargin { get; set; }

    }
}