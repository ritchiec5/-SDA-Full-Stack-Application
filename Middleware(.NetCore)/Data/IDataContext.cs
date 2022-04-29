using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CloudPlusAPI.Models;

namespace CloudPlusAPI.Data
{
    public interface IDataContext
    {
        DbSet<DistanceVideo> DistanceVideo { get; init; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}