package org.ai.isserver.service.impl;

import org.ai.isserver.dto.OrderRequestDTO;
import org.ai.isserver.dto.OrderResponseDTO;
import org.ai.isserver.model.Order;
import org.ai.isserver.model.User;
import org.ai.isserver.repository.OrderRepository;
import org.ai.isserver.repository.UserRepository;
import org.ai.isserver.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceHandler implements OrderService
{

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    private static final List<String> VALID_DELIVERY_TIMES = Arrays.asList("10:00", "11:00", "12:00");
    private static final List<String> VALID_DISTRICTS = Arrays.asList(
            "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
            "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
            "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
            "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
            "Monaragala", "Ratnapura", "Kegalle"
    );
    private static final List<String> VALID_PRODUCTS = Arrays.asList(
            "Wooden Dining Table", "Office Chair", "Leather Sofa", "Bookshelf",
            "Coffee Table", "Wardrobe", "Bed Frame", "Night Stand", "TV Stand",
            "Recliner Chair", "Study Table", "Kitchen Cabinet"
    );

    @Override
    public OrderResponseDTO createOrder(String username, OrderRequestDTO orderRequest) {

        try {

            validateOrderRequest(orderRequest);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            // Parse delivery time
            LocalTime deliveryTime = LocalTime.parse(orderRequest.getDeliveryTime() + ":00");

            Order order = new Order(
                    user,
                    orderRequest.getPurchaseDate(),
                    deliveryTime,
                    orderRequest.getDeliveryLocation(),
                    orderRequest.getProductName(),
                    orderRequest.getQuantity(),
                    orderRequest.getMessage()
            );
            Order savedOrder = orderRepository.save(order);
            logger.info("Order created successfully for user: {}", username);

            return convertToDTO(savedOrder);
        }catch (Exception e) {
            logger.error("Error creating order for user {}: {}", username, e.getMessage());
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }


    }

    @Override
    public List<OrderResponseDTO> getAllOrdersByUser(String username) {
        List<Order> orders = orderRepository.findByUserUsernameOrderByPurchaseDateDesc(username);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getUpcomingOrdersByUser(String username) {
        List<Order> orders = orderRepository.findUpcomingOrdersByUsername(username, LocalDate.now());
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getPastOrdersByUser(String username) {
        List<Order> orders = orderRepository.findPastOrdersByUsername(username, LocalDate.now());
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO getOrderById(String username, Long orderId) {
        Order order = orderRepository.findByUserUsernameAndId(username, orderId);
        if (order == null) {
            throw new RuntimeException("Order not found or access denied");
        }
        return convertToDTO(order);
    }

    @Override
    public void deleteOrder(String username, Long orderId) {

        Order order = orderRepository.findByUserUsernameAndId(username, orderId);
        if (order == null) {
            throw new RuntimeException("Order not found or access denied");
        }

        // Only allow deletion of future orders
        if (order.getPurchaseDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot delete past orders");
        }

        orderRepository.delete(order);
        logger.info("Order {} deleted by user {}", orderId, username);

    }
    private OrderResponseDTO convertToDTO(Order order) {
        return new OrderResponseDTO(
                order.getId(),
                order.getPurchaseDate(),
                order.getDeliveryTime().toString(),
                order.getDeliveryLocation(),
                order.getProductName(),
                order.getQuantity(),
                order.getMessage()
        );
    }

    private void validateOrderRequest(OrderRequestDTO orderRequest) {
        // Validate purchase date
        if (orderRequest.getPurchaseDate().getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Delivery is not available on Sundays");
        }

        // Validate delivery time
        if (!VALID_DELIVERY_TIMES.contains(orderRequest.getDeliveryTime())) {
            throw new RuntimeException("Invalid delivery time. Valid times are: 10:00, 11:00, 12:00");
        }

        // Validate delivery location
        if (!VALID_DISTRICTS.contains(orderRequest.getDeliveryLocation())) {
            throw new RuntimeException("Invalid delivery location");
        }

        // Validate product name
        if (!VALID_PRODUCTS.contains(orderRequest.getProductName())) {
            throw new RuntimeException("Invalid product name");
        }

        // Validate quantity
        if (orderRequest.getQuantity() == null || orderRequest.getQuantity() < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        // Validate message length
        if (orderRequest.getMessage() != null && orderRequest.getMessage().length() > 500) {
            throw new RuntimeException("Message cannot exceed 500 characters");
        }
    }
    public static List<String> getValidDistricts() {
        return VALID_DISTRICTS;
    }

    public static List<String> getValidProducts() {
        return VALID_PRODUCTS;
    }

    public static List<String> getValidDeliveryTimes() {
        return VALID_DELIVERY_TIMES;
    }
}
