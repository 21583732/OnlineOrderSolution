using ClientPortal.Api.DTOs;
using ClientPortal.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ClientPortal.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ClientPortalContext _context;

        public OrdersController(ClientPortalContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync();
        }

        // NEW - GET: api/Orders/client/5
        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersForClient(int clientId)
        {
            var orders = await _context.Orders
                .Where(o => o.ClientId == clientId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var dto = orders.Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                ClientId = o.ClientId,
                OrderDate = o.OrderDate,
                Status = o.Status,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    Product = oi.Product == null ? null : new ProductDto
                    {
                        ProductId = oi.Product.ProductId,
                        Name = oi.Product.Name,
                        Description = oi.Product.Description,
                        Price = oi.Product.Price,
                        InStock = oi.Product.InStock
                    }
                }).ToList()
            }).ToList();

            return Ok(dto);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var o = await _context.Orders
                .Include(x => x.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(x => x.OrderId == id);

            if (o == null) return NotFound();

            var dto = new OrderDto
            {
                OrderId = o.OrderId,
                ClientId = o.ClientId,
                OrderDate = o.OrderDate,
                Status = o.Status,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    Product = oi.Product == null ? null : new ProductDto
                    {
                        ProductId = oi.Product.ProductId,
                        Name = oi.Product.Name,
                        Description = oi.Product.Description,
                        Price = oi.Product.Price,
                        InStock = oi.Product.InStock
                    }
                }).ToList()
            };

            return Ok(dto);
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostOrder([FromBody] Order order)
        {
            // Basic server-side validation:
            if (order == null || order.OrderItems == null || !order.OrderItems.Any())
                return BadRequest("Invalid order payload");

            // Optional: verify client exists
            var clientExists = await _context.Clients.AnyAsync(c => c.ClientId == order.ClientId);
            if (!clientExists)
                return BadRequest("Client not found");

            // Optional: verify product existence & set unit prices from DB (recommended)
            foreach (var oi in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(oi.ProductId);
                if (product == null)
                    return BadRequest($"Product {oi.ProductId} not found");

                // ensure unit price corresponds to product price (avoid trusting client-provided price)
                oi.UnitPrice = product.Price;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // load the saved order with includes
            var saved = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

            // map to DTO
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
                    Product = oi.Product == null ? null : new ProductDto
                    {
                        ProductId = oi.Product.ProductId,
                        Name = oi.Product.Name,
                        Description = oi.Product.Description,
                        Price = oi.Product.Price,
                        InStock = oi.Product.InStock
                    }
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = dto.OrderId }, dto);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            // Load the order including items
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            // Optional: enforce that the current authenticated user owns this order
            // (Assumes you put client id into the NameIdentifier claim at login)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst("nameid")?.Value;
            if (!int.TryParse(userIdClaim, out var currentUserId))
            {
                // No valid claim found -> not authorized
                return Unauthorized();
            }

            if (order.ClientId != currentUserId)
            {
                // User trying to delete someone else's order
                return Forbid();
            }

            // Remove order items first (because DB FK uses no cascade)
            if (order.OrderItems != null && order.OrderItems.Any())
            {
                _context.OrderItems.RemoveRange(order.OrderItems);
            }

            // Remove the order
            _context.Orders.Remove(order);

            // Persist
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
    }
}
