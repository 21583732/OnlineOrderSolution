using ClientPortal.Api.Models;
using ClientPortal.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClientPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ClientPortalContext _context;

        public CartController(ClientPortalContext context)
        {
            _context = context;
        }

        // GET: api/cart/{clientId}
        [HttpGet("{clientId}")]
        public async Task<ActionResult<CartDto>> GetCart(int clientId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.ClientId == clientId);

            if (cart == null)
                return Ok(new CartDto { ClientId = clientId });

            var dto = MapCart(cart);
            return Ok(dto);
        }

        // POST: api/cart/add
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.ClientId == request.ClientId);

            if (cart == null)
            {
                cart = new Cart
                {
                    ClientId = request.ClientId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var existingItem = cart.CartItems
                .FirstOrDefault(i => i.ProductId == request.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/cart/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartItemRequest request)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(i => i.CartItemId == request.CartItemId);

            if (item == null)
                return NotFound();

            item.Quantity = request.Quantity;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/cart/remove/{cartItemId}
        [HttpDelete("remove/{cartItemId}")]
        public async Task<IActionResult> RemoveItem(int cartItemId)
        {
            var item = await _context.CartItems.FindAsync(cartItemId);

            if (item == null)
                return NotFound();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST: api/cart/checkout/{clientId}
        [HttpPost("checkout/{clientId}")]
        public async Task<IActionResult> Checkout(int clientId)
        {
            // First check that the client exists
            var client = await _context.Clients
                .Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.ClientId == clientId);

            if (client == null)
                return NotFound();

            // Prevent checkout until profile is completed
            if (client.Address == null)
            {
                return BadRequest(new
                {
                    message = "Please complete your profile before placing an order."
                });
            }

            // Load the cart exactly as before
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.ClientId == clientId);

            if (cart == null || !cart.CartItems.Any())
                return BadRequest("Cart is empty");

            // Create the order
            var order = new Order
            {
                ClientId = clientId,

                Status = "New",

                ShippingFirstName = client.FirstName,
                ShippingLastName = client.LastName,

                ShippingStreetAddress = client.Address.StreetAddress,
                ShippingCity = client.Address.City,
                ShippingProvince = client.Address.Province,
                ShippingPostalCode = client.Address.PostalCode,
                ShippingCountry = client.Address.Country,

                OrderItems = cart.CartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.Product.Price
                }).ToList()
            };

            _context.Orders.Add(order);

            // Clear the cart
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Order created successfully"
            });
        }

        // helper
        private CartDto MapCart(Cart cart)
        {
            var client = _context.Clients
                .Include(c => c.Address)
                .FirstOrDefault(c => c.ClientId == cart.ClientId);

            var items = cart.CartItems.Select(ci => new CartItemDto
            {
                CartItemId = ci.CartItemId,
                ProductId = ci.ProductId,
                ProductName = ci.Product?.Name,
                UnitPrice = ci.Product?.Price ?? 0,
                Quantity = ci.Quantity
            }).ToList();

            return new CartDto
            {
                CartId = cart.CartId,
                ClientId = cart.ClientId,
                Items = items,
                Total = items.Sum(i => i.UnitPrice * i.Quantity),

                Address = client?.Address == null
                    ? null
                    : new AddressDto
                    {
                        StreetAddress = client.Address.StreetAddress,
                        City = client.Address.City,
                        Province = client.Address.Province,
                        PostalCode = client.Address.PostalCode,
                        Country = client.Address.Country
                    }
            };
        }

        // request models (kept inside controller to reduce clutter)
        public class AddToCartRequest
        {
            public int ClientId { get; set; }
            public int ProductId { get; set; }
            public int Quantity { get; set; } = 1;
        }

        public class UpdateCartItemRequest
        {
            public int CartItemId { get; set; }
            public int Quantity { get; set; }
        }
    }
}