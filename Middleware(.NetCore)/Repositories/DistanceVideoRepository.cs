using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CloudPlusAPI.Data;
using CloudPlusAPI.Models;
using System.IO;
using System.Reflection;

namespace CloudPlusAPI.Repositories
{
    public class DistanceVideoRepository : IDistanceVideoRepository
    {
        private readonly IDataContext _context;
        public DistanceVideoRepository(IDataContext context)
        {
            _context = context;

        }

        /*  
            Function : Add
            Description: Add data to database
            Parameter: Videos - Video Class 
        */
        public async Task Add(DistanceVideo videos)
        {
            _context.DistanceVideo.Add(videos);
            await _context.SaveChangesAsync();
        }

        /*  
            Function : Delete
            Description: Delete data to database
            Parameter: Id - Int 
        */
        public async Task Delete(int id)
        {
            var itemToRemove = await _context.DistanceVideo.FindAsync(id);
            if (itemToRemove == null)
                throw new NullReferenceException();

            _context.DistanceVideo.Remove(itemToRemove);
            await _context.SaveChangesAsync();
        }

        /*  
            Function : Get
            Description: Get data from database
            Parameter: Id - Int 
        */
        public async Task<DistanceVideo> Get(int id)
        {
            return await _context.DistanceVideo.FindAsync(id);
        }

        /*  
            Function : GetAll
            Description: Get all data from database
            Parameter: Id - Int 
        */
        public async Task<IEnumerable<DistanceVideo>> GetAll()
        {
            return await _context.DistanceVideo.ToListAsync();
        }

        /*  
            Function : Update
            Description: Update data from database
            Parameter: Videos - Video Class 
        */
        public async Task Update(DistanceVideo videos)
        {
            var itemToUpdate = await _context.DistanceVideo.FindAsync(videos.Id);
            if (itemToUpdate == null)
                throw new NullReferenceException();
            itemToUpdate.Video = videos.Video;
            itemToUpdate.Camera = videos.Camera;
            itemToUpdate.Duration = videos.Duration;
            itemToUpdate.Violation = videos.Violation;
            itemToUpdate.DateCreated = videos.DateCreated;
            itemToUpdate.TimeCreated = videos.TimeCreated;
            itemToUpdate.Notification = videos.Notification;
            await _context.SaveChangesAsync();

        }
    }

}