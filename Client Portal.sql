CREATE DATABASE ClientPortal;
GO

USE ClientPortal;
GO

CREATE TABLE Clients (
  ClientId     INT            IDENTITY PRIMARY KEY,
  Username     NVARCHAR(100)  NOT NULL,
  PasswordHash NVARCHAR(256)  NOT NULL,
  Email        NVARCHAR(200)  NOT NULL,
  CreatedAt    DATETIME2      DEFAULT GETDATE()
);

CREATE TABLE Products (
  ProductId   INT            IDENTITY PRIMARY KEY,
  Name        NVARCHAR(200)  NOT NULL,
  Description NVARCHAR(1000),
  Price       DECIMAL(18,2)  NOT NULL,
  InStock     BIT            NOT NULL DEFAULT 1
);

CREATE TABLE Orders (
  OrderId   INT            IDENTITY PRIMARY KEY,
  ClientId  INT            NOT NULL,
  OrderDate DATETIME2      DEFAULT GETDATE(),
  Status    NVARCHAR(50)   NOT NULL DEFAULT 'New',
  FOREIGN KEY(ClientId) REFERENCES Clients(ClientId)
);

CREATE TABLE OrderItems (
  OrderItemId INT            IDENTITY PRIMARY KEY,
  OrderId     INT            NOT NULL,
  ProductId   INT            NOT NULL,
  Quantity    INT            NOT NULL,
  UnitPrice   DECIMAL(18,2)  NOT NULL,
  FOREIGN KEY(OrderId)   REFERENCES Orders(OrderId),
  FOREIGN KEY(ProductId) REFERENCES Products(ProductId)
);


INSERT INTO Products (Name, Description, Price, InStock)
VALUES
('Laptop Pro 15"', 'High-performance laptop for work and gaming.', 24999.99, 1),
('Wireless Headphones', 'Noise-cancelling over-ear headphones.', 1999.99, 1),
('Smartphone X', 'Latest-gen smartphone with OLED display.', 14999.50, 1),
('4K Monitor', 'Ultra HD 27-inch monitor.', 5499.00, 1),
('Gaming Mouse', 'Ergonomic mouse with programmable buttons.', 799.00, 0),
('Laptop Air 13"', 'Lightweight laptop with long battery life.', 5499.99, 1),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches.', 999.99, 1),
('Bluetooth Speaker', 'Portable speaker with deep bass and waterproof design.', 699.99, 1),
('Smartwatch Z', 'Fitness tracking smartwatch with heart rate monitor.', 2299.99, 1),
('USB-C Hub', 'Multi-port hub with HDMI, USB 3.0, and SD card reader.', 499.99, 1),
('External SSD 1TB', 'High-speed portable SSD with USB-C interface.', 1599.99, 1),
('Noise-Isolating Earbuds', 'In-ear headphones with passive noise isolation.', 399.99, 1),
('Smart Home Hub', 'Central controller for smart devices.', 899.99, 1),
('Wireless Charger Pad', 'Fast wireless charging pad for phones and earbuds.', 299.99, 1),
('Gaming Chair', 'Ergonomic chair with lumbar support and recline.', 2499.99, 1),
('Webcam HD', '1080p webcam with built-in microphone.', 599.99, 1),
('Graphics Tablet', 'Drawing tablet with pressure-sensitive stylus.', 1399.99, 1),
('VR Headset', 'Immersive virtual reality headset with motion tracking.', 3999.99, 1),
('Smart Light Bulb', 'Color-changing LED bulb with app control.', 199.99, 1),
('Wi-Fi 6 Router', 'High-speed router with mesh support.', 1299.99, 1),
('Laptop Stand', 'Adjustable aluminum stand for laptops.', 349.99, 1),
('Portable Projector', 'Compact projector with HDMI and wireless support.', 2999.99, 1),
('Smart Thermostat', 'Energy-saving thermostat with remote control.', 1899.99, 1),
('Noise-Cancelling Mic', 'USB microphone with background noise reduction.', 899.99, 1),
('Smart Plug', 'Wi-Fi enabled plug with scheduling features.', 149.99, 1),
('Fitness Tracker Band', 'Slim wearable for step and sleep tracking.', 799.99, 1),
('Laptop Sleeve 15"', 'Protective neoprene sleeve for laptops.', 249.99, 1),
('HDMI Cable 2m', 'High-speed HDMI cable for 4K video.', 99.99, 1),
('Surge Protector', 'Power strip with 6 outlets and USB ports.', 299.99, 1),
('Wireless Presenter', 'Laser pointer with slide control.', 399.99, 1),
('Smart Doorbell', 'Video doorbell with motion detection.', 1599.99, 1),
('Laptop Docking Station', 'Expand laptop connectivity with multiple ports.', 1899.99, 1),
('Streaming Stick', 'HD streaming device with voice remote.', 999.99, 1),
('Photo Printer', 'Compact printer for high-quality photo prints.', 2199.99, 1),
('Laptop Air 13"', 'Lightweight laptop with long battery life.', 5499.99, 1),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches.', 999.99, 1);