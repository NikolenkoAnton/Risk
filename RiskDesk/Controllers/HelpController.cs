using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.Models;

namespace RiskDeskDev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelpController : ControllerBase
    {
        IDealService service;
        public HelpController(IDealService service)
        {
            this.service = service;
        }
        [HttpGet]
        public ActionResult Get([FromQuery]string[] arr)
        {
            int count = arr.Length / 2;

            List<KeyValue> lists = new List<KeyValue>();
            for (var a = 0; a < count; a++)
            {
                var key = arr[a];
                var value = arr[count + a];
                lists.Add(new KeyValue { key = key, value = value });
            }
            service.Save(new SaveDTO1 { values = lists });
            return Ok(lists);
            //service.Save(obj);
        }
    }
}