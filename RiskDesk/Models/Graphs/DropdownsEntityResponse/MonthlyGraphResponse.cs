using System.Collections.Generic;
using RiskDesk.GraphsBLL.DTO;

namespace RiskDesk.Models.Graphs.DropdownsEntityResponse
{
    public class MonthlyGraphResponse
    {
        public List<MonthlyDBModel> Data { get; set; }

        public string[] SelectedBlocks { get; set; }

        public string[] SelectedMonths { get; set; }
    }
}
