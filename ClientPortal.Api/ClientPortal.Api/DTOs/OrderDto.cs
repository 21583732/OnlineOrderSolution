namespace ClientPortal.Api.DTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int ClientId { get; set; }
        public DateTime? OrderDate { get; set; }
        public string Status { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }
}
