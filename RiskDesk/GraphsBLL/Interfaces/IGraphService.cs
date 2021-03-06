using System.Collections.Generic;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;

namespace RiskDesk.GraphsBLL.Interfaces
{
    public interface IGraphService
    {
        DealEntryDBModel GetDealEntry(DealGraphFilters filters);
        List<HourlyScalarDBModel> GetHourlyScalar(HourlyScalarGraphFilters filters);
        List<RiskDBModel> GetRisk(RiskGraphFilters filters);
        List<WeatherScenarioDBModel> GetWeatherScenario(WeatherScenarioGraphFilters filters);
        List<ScatterPlotDBModel> GetScatterPlot(ScatterPlotGraphFilters filters);
        List<ErcotDBModel> GetErcot(ErcotGraphFilters filters);
        List<MonthlyDetailDBModel> GetMonthlyDetail(MonthlyDetailPositionGraphFilters filters);
        IEnumerable<MonthlyPositionDBModel> GetMonthlyPosition(MonthlyDetailPositionGraphFilters filters);
        PeakDBModel GetPeak(PeakGraphFilters filters);

    }
}