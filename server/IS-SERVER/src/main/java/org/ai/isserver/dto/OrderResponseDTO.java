package org.ai.isserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {

    private Long id;
    private LocalDate purchaseDate;
    private String deliveryTime;
    private String deliveryLocation;
    private String productName;
    private Integer quantity;
    private String message;
}
