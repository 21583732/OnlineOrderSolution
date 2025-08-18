using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace ClientPortal.Api.Models
{
    public class ClientPortalContextFactory : IDesignTimeDbContextFactory<ClientPortalContext>
    {
        public ClientPortalContext CreateDbContext(string[] args)
        {
            // Build config (so EF can load appsettings)
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddJsonFile("appsettings.Production.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ClientPortalContext>();
            var connectionString = config.GetConnectionString("DefaultConnection"); // adjust name

            optionsBuilder.UseSqlServer(connectionString);

            return new ClientPortalContext(optionsBuilder.Options);
        }
    }
}
