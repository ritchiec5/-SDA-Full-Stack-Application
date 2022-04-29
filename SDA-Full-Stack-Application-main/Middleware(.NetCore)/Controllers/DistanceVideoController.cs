using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CloudPlusAPI.Dtos;
using CloudPlusAPI.Models;
using CloudPlusAPI.Repositories;


/*
Distance Video Controller: Control response to HTTP commands (GET, GETALL, POST, DELETE, UPDATE)
*/

namespace CloudPlusAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class DistanceVideoController : ControllerBase
    {
        /* Create variable for Product Repository. Product Repository: communicates with database */
        private readonly IDistanceVideoRepository _DistanceVideoRepository;
        
        /* Limit the amount of video that has been saved */
        private const int limit = 3;
        
        /* File path where the Videos are stored */
        private readonly string react_path = "../React/my-app/public/"; 

        /* Create Product Repository class: to communicate with the Database */
        public DistanceVideoController(IDistanceVideoRepository DistanceVideoRepository)
        {
            _DistanceVideoRepository = DistanceVideoRepository;
        }


        /* HTTP GET ALL Command: To get all data from Database AI CAMERA Table */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DistanceVideo>>> GetProducts()
        {
            var distance_video = await _DistanceVideoRepository.GetAll();
            return Ok(distance_video);
        }

        /* HTTP GET Command: To get specific data from Database AI CAMERA Table */
        [HttpGet("{id}")]
        public async Task<ActionResult<DistanceVideo>> GetProduct(int id)
        {
            var distance_video = await _DistanceVideoRepository.Get(id);
            if (distance_video == null)
                return NotFound();

            return Ok();
        }

        /* HTTP POST Command: To Insert data into the Database for AI CAMERA Table */
        [HttpPost]
        public async Task<ActionResult> CreateProduct(CreateDistanceVideoDto createProductDto)
        {            

            /* Create video to be inserted */
            DistanceVideo distance_video = new()
            {
                Video = createProductDto.Video,
                Camera = createProductDto.Camera,
                Duration = createProductDto.Duration,
                DateCreated = DateTime.Now.ToString("dd-MM-yyyy"),
                TimeCreated = DateTime.Now.ToString("hh:mm:ss"),
                Violation = createProductDto.Violation,
                Notification = true
            };


            /* 
                Feature: Limit
                Functionality: Limit the amount of videos saved
                
                Implementation: 
                    1. Get All data
                    2. Filter out data where Video filepath states "Video Deleted" 
                    3. Sort the data from earliest to latest by Video ID
                    4. Delete the earliest Video ID & Update Video file path to "Video Deleted"
            */
            List<int> saved_video_id = new List<int>();

            var distance_videos = await _DistanceVideoRepository.GetAll(); // Get All Data

            /* Loops through all data */
            foreach (DistanceVideo current_video in distance_videos){
                /* Filter out Video filepath where Video file path has been Deleted */
                if (current_video.Video != "Video Deleted")
                {
                    saved_video_id.Add(current_video.Id);
                }
            }

            /* Sort Int Array */
            saved_video_id.Sort();

            /* Delete Oldest Videos when Video stored is above the limit*/
            while (saved_video_id.Count >= 3){
                var video_todelete = await _DistanceVideoRepository.Get(saved_video_id[0]);
                try
                {
                System.IO.File.Delete(react_path + video_todelete.Video);    // Deletes the Video file
                }
                catch {

                }
                finally
                {
                video_todelete.Video = "Video Deleted";                      
                await _DistanceVideoRepository.Update(video_todelete);             // Updates Video File Path that video has been deleted    
                saved_video_id.Remove(saved_video_id[0]);
                }
            }

            /* Save video if Filepath meets proper requirement */
            if (createProductDto.Video.Contains("AI_Video"))
            {
            await _DistanceVideoRepository.Add(distance_video); // Add the Video into the Repo
            }
            return Ok(saved_video_id);
        }

        /* HTTP Delete Command: To Delete data from the Database for AI CAMERA Table */
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var distanceVideo = await _DistanceVideoRepository.Get(id);
            System.IO.File.Delete(react_path + distanceVideo.Video.ToString());

            await _DistanceVideoRepository.Delete(id);
            return Ok();
        }

        /* HTTP Delete Command: To Update data from the Database for AI CAMERA Table */
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, UpdateDistanceVideoDto updateDistanceVideoDto)
        {
            var distanceVideo = await _DistanceVideoRepository.Get(id);
            DistanceVideo videos = distanceVideo;

            if(updateDistanceVideoDto.Video != null)
            videos.Video = updateDistanceVideoDto.Video;

            if (updateDistanceVideoDto.Camera != null)
                videos.Camera = updateDistanceVideoDto.Camera;

            if (updateDistanceVideoDto.Duration != null)
                videos.Duration = updateDistanceVideoDto.Duration;

            if (updateDistanceVideoDto.DateCreated != null)
                videos.DateCreated = updateDistanceVideoDto.DateCreated;

            if(updateDistanceVideoDto.TimeCreated != null)
                videos.TimeCreated = updateDistanceVideoDto.TimeCreated;

            if(updateDistanceVideoDto.Notification == false)
                videos.Notification = false;

            await _DistanceVideoRepository.Update(videos);
            return Ok(videos);
        }

    }
}