using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ClientPortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Description", "InStock", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "High-performance laptop with 15-inch display", true, "Laptop Pro 15", 1499.99m },
                    { 2, "Ergonomic wireless mouse", true, "Wireless Mouse", 29.99m }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Description", "Name", "Price" },
                values: new object[] { 3, "RGB backlit mechanical keyboard", "Mechanical Keyboard", 89.99m });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Description", "InStock", "Name", "Price" },
                values: new object[,]
                {
                    { 4, "4K UHD IPS monitor", true, "27-inch Monitor", 349.99m },
                    { 5, "Over-ear noise-cancelling headphones", true, "Noise Cancelling Headphones", 199.99m },
                    { 6, "Portable 1TB external SSD", true, "External SSD 1TB", 129.99m }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Description", "Name", "Price" },
                values: new object[] { 7, "Latest-gen smartphone with OLED display", "Smartphone X", 999.99m });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Description", "InStock", "Name", "Price" },
                values: new object[,]
                {
                    { 8, "Lightweight tablet with stylus support", true, "Tablet Air 11", 599.99m },
                    { 9, "Portable waterproof speaker", true, "Bluetooth Speaker", 79.99m },
                    { 10, "Fitness-focused smartwatch", true, "Smartwatch S", 249.99m },
                    { 11, "Ergonomic chair for long sessions", true, "Gaming Chair", 199.99m },
                    { 12, "High-resolution webcam for streaming", true, "4K Webcam", 129.99m },
                    { 13, "Immersive virtual reality headset", true, "VR Headset", 399.99m },
                    { 14, "High-capacity power bank", true, "Portable Charger 20k mAh", 49.99m },
                    { 15, "Compact drone with 4K camera", true, "Drone 4K", 599.99m },
                    { 16, "Voice-controlled smart hub", true, "Smart Home Hub", 99.99m },
                    { 17, "Next-gen gaming console", true, "Gaming Console Z", 499.99m },
                    { 18, "Foldable e-scooter with long range", true, "Electric Scooter", 699.99m },
                    { 19, "Wi-Fi enabled LED bulbs", true, "Smart Light Bulb Pack", 59.99m },
                    { 20, "Waterproof 4K action camera", true, "Action Camera", 249.99m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20);
        }
    }
}
