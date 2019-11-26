﻿using RiskDeskDev.Controllers;
using RiskDeskDev.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.GraphsBLL.Interfaces
{
    public interface IDealService
    {
        Task<dynamic> DropDownsInfo();

        dynamic Commit(int id);
        Task<dynamic> Calculate(int id);
        void Save(SaveDTO1 obj);
        //Task<dynamic> Calculate(int id);
        Task<dynamic> GetDealInfo(int id);

        DealDrops DealDrops();

        Deal Deal(string WholeSales, string Counter, string Zone, string StartDate, string EndDate, string DealStart, string DealEnd);
    }
}
