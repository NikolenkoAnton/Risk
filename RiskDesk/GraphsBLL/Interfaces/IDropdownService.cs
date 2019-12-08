using System.Collections.Generic;

namespace RiskDesk.GraphsBLL.Interfaces
{
    public interface IDropdownService
    {
        List<T> GetData<T>(BaseEntity entity);
    }
}
