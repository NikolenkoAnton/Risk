using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{
    public class HourlyGraphsDataDTO
    {
        public IEnumerable<HourlyDTO> data { get; set; }

        public DateTime? minDate { get; set; }

        public DateTime? maxDate { get; set; }
    }
}
