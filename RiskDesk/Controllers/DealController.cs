using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.GraphsBLL.Services;
using RiskDeskDev.Models;

namespace RiskDeskDev.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DealController : ControllerBase
    {
        public IDealService service;
        public DealController(IConfiguration configuration, IDealService service)
        {
            this.service = service;
        }

        [HttpGet("GetTest")]
        public ActionResult GetTest([FromQuery]string[] arr)
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
        [HttpGet("Commit")]
        public dynamic Commit([FromQuery] int DealID)
        {
            var date = service.Commit(DealID);
            return new { date };
        }

        [HttpGet("Сalculate")]
        public async Task<dynamic> Calculate([FromQuery]int DealID)
        {
            var date = await service.Calculate(DealID);
            return new { CommitmentDate = date };
            //service.Save(obj);
        }

        [HttpPost("Save")]
        public async Task<dynamic> SaveeePost([FromBody] SaveRequest values)
        {
            var save = new SaveDTO1();
            save.values = new List<KeyValue>();
            for (var i = 0; i < values.Keys.Length; i++)
            {
                save.values.Add(new KeyValue { key = values.Keys[i], value = values.Values[i] });
            }
            await Task.Run(() => service.Save(save));
            return Ok();
        }

        [HttpGet("GetDealInfo/{id}")]
        public async Task<dynamic> GetDealInfo(int id)
        {
            return await service.GetDealInfo(id);
        }
        [HttpGet("dropdownsInfo")]
        public async Task<dynamic> DropDownsInfo()
        {
            return await service.DropDownsInfo();
        }

    }

}