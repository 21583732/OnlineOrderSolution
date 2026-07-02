namespace ClientPortal.Api.DTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int ClientId { get; set; }
        public DateTime? OrderDate { get; set; }
        public string Status { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public string? ShippingFirstName { get; set; }

        public string? ShippingLastName { get; set; }

        public string? ShippingStreetAddress { get; set; }

        public string? ShippingCity { get; set; }

        public string? ShippingProvince { get; set; }

        public string? ShippingPostalCode { get; set; }

        public string? ShippingCountry { get; set; }
    }
}
