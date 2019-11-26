using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace RiskDeskDev.Controllers
{
    public class CustFacController : Controller
    {
        //async static void Asd()
        //{
        //    HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://api.privatbank.ua/p24api/exchange_rates");
        //    request.Headers.Add("json");
        //    request.Headers.Add("date","01.12.2014");

        //    HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync();
            
        //    string s = "";
        //    using (Stream stream = response.GetResponseStream())
        //    {

        //        using (StreamReader reader = new StreamReader(stream))
        //        {
                    
        //            s += reader.ReadToEnd();
        //        }
        //    }
        //    response.Close();
        //}
        public CustFacController(IConfiguration conf )
        {
           string s = conf.GetValue<string>("ConnectionString");
           // Asd();
        }
        public IActionResult Index()
        {

            return View();
        }

        public IActionResult FacilityUpdate()
        {
            return View();
        }

       


    }
}