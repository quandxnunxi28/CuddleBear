using CuddleBear.Models;
using CuddleBear.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CuddleBear.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  
    public class CheckoutController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public CheckoutController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        public class CreateOrderDto
        {
            public string ShippingAddress { get; set; } = "";
            public List<OrderItem> Items { get; set; } = new();
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var order = await _orderService.CreateOrderAsync(
                userId,
                dto.ShippingAddress,
                dto.Items
            );

            return Ok(order);
        }
        [HttpGet("my-orders")]
        public async Task<IActionResult> MyOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await _orderService.GetOrdersByUserAsync(userId);

            return Ok(orders);
        }
    }
}
