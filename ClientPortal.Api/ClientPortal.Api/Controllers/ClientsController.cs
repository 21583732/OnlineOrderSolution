using ClientPortal.Api.DTOs;
using ClientPortal.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using ClientPortal.Api.Helpers;

namespace ClientPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ClientPortalContext _context;

        public ClientsController(ClientPortalContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            return await _context.Clients.ToListAsync();
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients
                .Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.ClientId == id);

            if (client == null)
            {
                return NotFound();
            }

            return client;
        }

        // PUT: api/Clients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.ClientId)
            {
                return BadRequest();
            }

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Clients
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("register")]
        public async Task<IActionResult> RegisterClient([FromBody] RegisterClientDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

            if (dto.Password != dto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            if (!ValidationHelper.IsValidEmail(normalizedEmail))
            {
                return BadRequest("Please enter a valid email address.");
            }

            if (!ValidationHelper.IsStrongPassword(dto.Password))
            {
                return BadRequest(
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.");
            }

            if (await _context.Clients.AnyAsync(c =>
                    c.Email.ToLower() == normalizedEmail))
            {
                return BadRequest("Email already exists.");
            }

            if (await _context.Clients.AnyAsync(c =>
                    c.Username.ToLower() == dto.Username.Trim().ToLower()))
            {
                return BadRequest("Username already exists.");
            }

            var client = new Client
            {
                Username = dto.Username.Trim(),
                PasswordHash = HashPassword(dto.Password),
                Email = normalizedEmail,
                CreatedAt = DateTime.UtcNow
            };

            _context.Clients.Add(client);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Username or email already exists.");
            }

            return Ok(new
            {
                message = "Registration successful"
            });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        [HttpPut("{id}/profile")]
        public async Task<IActionResult> UpdateProfile(int id, UpdateProfileDto dto)
        {
            var client = await _context.Clients
                .Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.ClientId == id);

            if (client == null)
                return NotFound();

            client.FirstName = dto.FirstName;
            client.LastName = dto.LastName;

            if (client.Address == null)
            {
                client.Address = new Address
                {
                    ClientId = client.ClientId
                };
            }

            client.Address.StreetAddress = dto.StreetAddress;
            client.Address.City = dto.City;
            client.Address.Province = dto.Province;
            client.Address.PostalCode = dto.PostalCode;
            client.Address.Country = dto.Country;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginClientDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var client = await _context.Clients
                .Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.Username == dto.Username);

            if (client == null || client.PasswordHash != HashPassword(dto.Password))
                return Unauthorized(new { message = "Invalid username or password" });

            // Create JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("ThisIsAVeryLongSuperSecretKey1234567890!!"); // Store securely in appsettings
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, client.ClientId.ToString()),
            new Claim(ClaimTypes.Name, client.Username)
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);


            var profileComplete =
                client.Address != null &&
                !string.IsNullOrWhiteSpace(client.FirstName) &&
                !string.IsNullOrWhiteSpace(client.LastName);

            return Ok(new
            {
                token = tokenString,
                username = client.Username,
                profileComplete = profileComplete
            });
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.ClientId == id);
        }
    }
}
