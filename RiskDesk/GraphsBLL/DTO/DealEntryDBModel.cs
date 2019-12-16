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
        public Int32 SupplyID { get; set; }

        public DateTime CurveDate { get; set; }
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