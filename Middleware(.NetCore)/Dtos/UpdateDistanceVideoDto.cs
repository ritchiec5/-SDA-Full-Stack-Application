using System;

namespace CloudPlusAPI.Dtos
{
    public class UpdateDistanceVideoDto
    {
        public string Video { get; set; }
        public string Camera { get; set; }
        public string Duration { get; set; }
        public string Violation { get; set; }
        public string DateCreated { get; set; }
        public string TimeCreated { get; set; }
        public Boolean Notification { get; set; }

    }
}