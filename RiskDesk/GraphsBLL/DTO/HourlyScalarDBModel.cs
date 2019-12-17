using System;

namespace RiskDesk.GraphsBLL.DTO
{
    public class HourlyScalarDBModel
    {
        public Int64 WholeSaleBlocksID { get; set; }

        public string WholeSaleBlocks { get; set; }

        public double HE { get; set; }
        public double AT { get; set; }

        public double ubar { get; set; }
        public double tbar { get; set; }
        public double sigmau { get; set; }
        public double pbar { get; set; }

    }
}
