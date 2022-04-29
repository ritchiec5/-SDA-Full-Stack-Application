using System.Collections.Generic;
using System.Threading.Tasks;
using CloudPlusAPI.Models;


namespace CloudPlusAPI.Repositories
{
    public interface IDistanceVideoRepository
    {
        Task<DistanceVideo> Get(int id);
        Task<IEnumerable<DistanceVideo>> GetAll();
        Task Add(DistanceVideo DistanceVideo);
        Task Delete(int id);
        Task Update(DistanceVideo DistanceVideo);
    }
}