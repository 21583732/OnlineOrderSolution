using System.ComponentModel.DataAnnotations;

namespace ClientPortal.Api.DTOs
{
    public class LoginClientDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}