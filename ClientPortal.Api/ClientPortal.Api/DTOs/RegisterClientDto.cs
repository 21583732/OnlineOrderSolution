namespace ClientPortal.Api.DTOs
{
    public class RegisterClientDto
    {
        public string Username { get; set; }
        public string Password { get; set; } // plain password from the UI
        public string Email { get; set; }
    }
}
