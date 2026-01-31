using CuddleBear.Models;
using CuddleBear.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CuddleBear.Controllers
{
    [Route("api/order")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly BearShopDbContext _context;
        private readonly IOrderService _orderService;
        public OrdersController(IOrderService orderService, BearShopDbContext context)
        {
            _orderService = orderService;
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userId = int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

            var order = new Order
            {
                UserId = userId,
                ShippingAddress = request.ShippingAddress,
                TotalAmount = request.TotalPrice,
                Status = "PENDING",
                StatusFee = request.PaymentMethod,
                CreatedAt = DateTime.Now
            };

            foreach (var item in request.Items)
            {
                order.OrderItems.Add(new OrderItem
                {
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    Price = item.Price
                });
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Create order success",
                orderId = order.Id
            });
        }
        [HttpGet("my-orders")]
        public IActionResult GetMyOrders()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var orders = _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.CreatedAt,
                    o.TotalAmount,
                    o.Status,
                    o.StatusFee,
                    o.ShippingAddress,
                    Items = o.OrderItems.Select(i => new
                    {
                        i.ProductName,
                        i.Quantity,
                        i.Price
                    })
                })
                .ToList();

            return Ok(orders);
        }

    }

}
