package org.ai.isserver.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {


    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @NotBlank(message = "Delivery time is required")
    @Pattern(regexp = "^(10:00|11:00|12:00)$", message = "Delivery time must be 10:00, 11:00, or 12:00")
    private String deliveryTime;

    @NotBlank(message = "Delivery location is required")
    private String deliveryLocation;

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100, message = "Quantity cannot exceed 100")
    private Integer quantity;

    @Size(max = 500, message = "Message cannot exceed 500 characters")
    private String message;
}
