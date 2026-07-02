using System.Collections.Generic;

namespace ClientPortal.Api.DTOs;

public class CartDto
{
    public int CartId { get; set; }
    public int ClientId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal Total { get; set; }
    public AddressDto Address { get; set; }
}
