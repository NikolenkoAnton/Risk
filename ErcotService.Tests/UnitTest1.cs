using System;
using Xunit;

namespace ErcotService.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var result = 1 < 10;

            Assert.True(result, "Should be true");
        }
    }
}
