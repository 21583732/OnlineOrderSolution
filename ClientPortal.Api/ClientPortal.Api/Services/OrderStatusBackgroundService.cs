using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ClientPortal.Api.Models;
using Microsoft.AspNetCore.SignalR;
using ClientPortal.Api.Hubs;
using ClientPortal.Api.DTOs;

namespace ClientPortal.Api.Services
{

    /// <summary>
    /// Background service that periodically scans orders and advances statuses.
    /// </summary>
    public class OrderStatusBackgroundService: BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHubContext<OrderHub> _hub;

        // thresholds in seconds
        private const int PendingSeconds = 59;
        private const int ProcessedSeconds = 118; // Pending after 0-59, Processed after 59-118, Shipped after 118+

        public OrderStatusBackgroundService(IServiceScopeFactory scopeFactory, IHubContext<OrderHub> hub)
        {
            _scopeFactory = scopeFactory;
            _hub = hub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // run until cancelled
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ScanAndUpdateOrders(stoppingToken);
                }
                catch (Exception ex)
                {
                    // log but continue - in minimal setup we just write to console
                    Console.WriteLine($"OrderStatusBackgroundService error: {ex}");
                }

                // wait 10s between scans (fast for demo)
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        private async Task ScanAndUpdateOrders(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ClientPortalContext>();

            // Get orders that might need update (not Shipped) and with non-null OrderDate
            var candidates = await db.Orders
                .Where(o => o.OrderDate != null && o.Status != "Shipped")
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync(ct);

            var now = DateTime.UtcNow;
            var changedOrders = new List<Order>();

            foreach (var o in candidates)
            {
                var orderDate = o.OrderDate ?? now;
                var age = (now - orderDate).TotalSeconds;
                string newStatus = o.Status;

                if (age < PendingSeconds)
                {
                    newStatus = "New-Pending";
                }
                else if (age >= PendingSeconds && age < ProcessedSeconds)
                {
                    newStatus = "Processed";
                }
                else if (age >= ProcessedSeconds)
                {
                    newStatus = "Shipped";
                }

                if (newStatus != o.Status)
                {
                    o.Status = newStatus;
                    changedOrders.Add(o);
                }
            }

            if (changedOrders.Any())
            {
                await db.SaveChangesAsync(ct);

                // broadcast each changed order DTO
                foreach (var saved in changedOrders)
                {
                    var dto = new OrderDto
                    {
                        OrderId = saved.OrderId,
                        ClientId = saved.ClientId,
                        OrderDate = saved.OrderDate,
                        Status = saved.Status,
                        OrderItems = saved.OrderItems.Select(oi => new OrderItemDto
                        {
                            OrderItemId = oi.OrderItemId,
                            ProductId = oi.ProductId,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice,
                            Product = oi.Product == null ? null : new ClientPortal.Api.DTOs.ProductDto
                            {
                                ProductId = oi.Product.ProductId,
                                Name = oi.Product.Name,
                                Description = oi.Product.Description,
                                Price = oi.Product.Price,
                                InStock = oi.Product.InStock
                            }
                        }).ToList()
                    };

                    // broadcast
                    await _hub.Clients.All.SendAsync("OrderUpdated", dto, ct);
                }
            }
        }
    }
}
