using RiskDeskDev.Models.Graphs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.GraphsBLL.DTO
{
    public class DropsPeak //month, scenario, accnumbers
    {
        public List<AccNumberDTO> numbers { get; set; }

        public List<MonthDTO> months { get; set; }

        public List<ScenarioDTO> scenarios { get; set; }

    }
    public class DropsMape //month, zones, accnumbersm blocks
    {
        public List<AccNumberDTO> numbers { get; set; }
        public List<WholeSalesDTO> blocks { get; set; }

        public List<MonthDTO> months { get; set; }
    }

    public class PeakGraph
    {
        public string month { get; set; }

        public double cp { get; set; }

        public double ncp { get; set; }
    }

    public class PeakTable
    {
        public string acc;

        public double[] cp = new double[12];

        public double[] ncp = new double[12];

        public double[] factor = new double[12];

        public double Conv(object num) => Math.Round(Convert.ToDouble(num), 2);
        public void SetLoad(int month, object cp, object ncp, object factor)
        {
            this.cp[month] = Conv(cp);
            this.ncp[month] = Conv(ncp);
            this.factor[month] = Conv(factor);

        }
    }

    public class Peak
    {
        public IEnumerable<PeakGraph> graphs { get; set; }

        public IEnumerable<PeakTable> tables { get; set; }
    }

    public class MapeGraph
    {
        public int month { get; set; }

        public double frst { get; set; }

        public double scnd { get; set; }

        public double thrd { get; set; }

        public void setLoad(string wholesales, object value)
        {
            switch (wholesales)
            {
                case "2x16":
                    frst = Math.Round(Convert.ToDouble(value)*100,1);
                    break;
                case "5x16":
                    scnd = Math.Round(Convert.ToDouble(value) * 100, 1);
                    break;
                case "7x8":
                    thrd = Math.Round(Convert.ToDouble(value) * 100, 1);
                    break;
            }
        }
    }

    public class MapeTable
    {
        public string acc;

        public double[] frst = new double[12];

        public double[] scnd = new double[12];

        public double[] thrd = new double[12];

        public void Set(DataRow row)
        {
            List<string> arr = new List<string>{ "2x16", "5x16", "7x8" };
            int month = Convert.ToInt32(row["MonthsNamesID"])-1;
            string wholeSale = row["WholeSaleBlocks"].ToString();
            double value = Math.Round(Convert.ToDouble(row["AVGMAPE"]) * 100, 1);
            int index = arr.IndexOf(wholeSale);
            switch (index)
            {
                case 0:
                    frst[month] = value;
                    break;

                case 1:
                    scnd[month] = value;
                    break;

                case 2:
                    thrd[month] = value;
                    break;
            }
        }
        
    }

    

    public class Mape
    {
        public IEnumerable<MapeGraph> graphs { get; set; }

        public IEnumerable<MapeTable> tables { get; set; }

    }
}
