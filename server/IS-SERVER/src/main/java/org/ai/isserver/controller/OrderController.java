package org.ai.isserver.controller;

import jakarta.validation.Valid;
import org.ai.isserver.dto.ApiResponse;
import org.ai.isserver.dto.OrderRequestDTO;
import org.ai.isserver.dto.OrderResponseDTO;
import org.ai.isserver.service.OrderService;
import org.ai.isserver.service.impl.OrderServiceHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "https://localhost:5173",allowCredentials = "true")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;


    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
            @Valid @RequestBody OrderRequestDTO orderRequest,
            OAuth2AuthenticationToken authentication) {

        try {
            System.out.println("OrderController.createOrder"+authentication);
            String username = authentication.getPrincipal().getAttribute("sub");
            System.out.println("OrderController.createOrder"+username);
            OrderResponseDTO order = orderService.createOrder(username, orderRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order created successfully", order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getAllOrders(OAuth2AuthenticationToken authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getPrincipal().getAttribute("sub");
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Unable to identify user"));
            }

            List<OrderResponseDTO> orders = orderService.getAllOrdersByUser(username);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch orders: " + e.getMessage()));
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUpcomingOrders(OAuth2AuthenticationToken authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getPrincipal().getAttribute("sub");
            List<OrderResponseDTO> orders = orderService.getUpcomingOrdersByUser(username);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch upcoming orders"));
        }
    }

    @GetMapping("/past")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getPastOrders(OAuth2AuthenticationToken authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            String username = authentication.getPrincipal().getAttribute("sub");
            List<OrderResponseDTO> orders = orderService.getPastOrdersByUser(username);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch past orders"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(
            @PathVariable Long id, OAuth2AuthenticationToken authentication) {

        try {
            String username = authentication.getPrincipal().getAttribute("sub");
            logger.info("Fetching order {} for user: {}", id, username);

            OrderResponseDTO order = orderService.getOrderById(username, id);
            return ResponseEntity.ok(ApiResponse.success(order));

        } catch (Exception e) {
            logger.error("Error fetching order {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteOrder(
            @PathVariable Long id, OAuth2AuthenticationToken authentication) {

        try {
            String username = authentication.getPrincipal().getAttribute("sub");
            logger.info("Deleting order {} for user: {}", id, username);

            orderService.deleteOrder(username, id);
            return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", "Order removed"));

        } catch (Exception e) {
            logger.error("Error deleting order {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> getOrderConfiguration() {
        try {
            Map<String, List<String>> config = new HashMap<>();
            config.put("districts", OrderServiceHandler.getValidDistricts());
            config.put("products", OrderServiceHandler.getValidProducts());
            config.put("deliveryTimes", OrderServiceHandler.getValidDeliveryTimes());

            return ResponseEntity.ok(ApiResponse.success(config));

        } catch (Exception e) {
            logger.error("Error fetching order configuration: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch configuration"));
        }
    }

}
