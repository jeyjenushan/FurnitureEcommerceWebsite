package org.ai.isserver.service;

import org.ai.isserver.dto.OrderRequestDTO;
import org.ai.isserver.dto.OrderResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public interface OrderService {
     OrderResponseDTO createOrder(String username, OrderRequestDTO orderRequest);
    List<OrderResponseDTO> getAllOrdersByUser(String username);
    List<OrderResponseDTO> getUpcomingOrdersByUser(String username);
    List<OrderResponseDTO> getPastOrdersByUser(String username);
    OrderResponseDTO getOrderById(String username, Long orderId);
    void deleteOrder(String username, Long orderId);


}
