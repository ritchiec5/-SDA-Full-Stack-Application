using Microsoft.EntityFrameworkCore;
using CloudPlusAPI.Models;

namespace CloudPlusAPI.Data
{
    public class DataContext : DbContext, IDataContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public DbSet<DistanceVideo> DistanceVideo { get; init; }

    }
}