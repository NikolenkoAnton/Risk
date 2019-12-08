using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RiskDeskDev.Controllers
{
    public class GraphsController : Controller
    {
        public IActionResult Ercot()
        {
            return View();
        }
        public IActionResult Deal()
        {
            return View();
        }
        public IActionResult Aggregates()
        {
            return View();
        }

        public IActionResult Mape()
        {
            return View();
        }
        public IActionResult Peak()
        {
            return View();
        }
        public IActionResult Risk()
        {
            return View();
        }

        public IActionResult Monthly()
        {
            return View();
        }
        public IActionResult WeatherHourly()
        {
            return View();
        }

        public IActionResult HourlyScalar()
        {
            return View();
        }

        public IActionResult ScatterPlot()
        {
            return View();
        }

        public IActionResult WeatherMonthly()
        {
            return View("~/Views/Graphs/WeatherMonthlyChart.cshtml");
        }

        public IActionResult Pricing()
        {
            return View();
        }
        public IActionResult GrossMargin()
        {
            return View();
        }
        public IActionResult Mem()
        {
            return View();
        }

    }
}