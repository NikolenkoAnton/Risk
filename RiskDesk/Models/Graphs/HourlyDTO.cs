using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models.Graphs
{

    public class HourlyRecordDTO 
    {
        public string MonthID { get; set; }

        public string ScenarioID { get; set; }

        public DateTime Date { get; set; }

        public double TotalLoad { get; set; }
    }
    public class HourlyDTO
    {
        public DateTime date { get; set; }

        public double avg { get; set; }

        public double mild { get; set; }

        public double xtreme { get; set; }

        public void setLoad(string id, double value)
        {
            switch (id)
            {
                case "1":
                    avg = value;
                    break;
                case "2":
                    mild = value;
                    break;
                case "3":
                    xtreme = value;
                    break;
            }
        }
    }
}
