using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RiskDeskDev.GraphsBLL.Services;
using RiskDeskDev.Models;

namespace RiskDeskDev.Controllers
{
    public class DealScreenController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Screen2()
        {
            return View("~/Views/DealScreen/Screen3.cshtml");
        }

        [HttpPost]
        [Route("TEST")]
        public void TestPost(IConfiguration IConfiguration, [FromBody]SaveRequest values)
        {
        }
        [HttpPost]
        [Route("Save")]
        public dynamic Save(IConfiguration IConfiguration,[FromBody]SaveRequest values)
        {
            var save = new SaveDTO1();
            save.values = new List<KeyValue>();
            for (var i = 0; i < values.Keys.Length; i++)
            {
                save.values.Add(new KeyValue { key = values.Keys[i], value = values.Values[i] });
            }
            new DealService(IConfiguration).Save(save);
            return Ok();
        }
    }
}