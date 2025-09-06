package org.ai.isserver.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {


    public Order(User user, LocalDate purchaseDate, LocalTime deliveryTime, String deliveryLocation, String productName, Integer quantity, String message) {
        this.user = user;
        this.purchaseDate = purchaseDate;
        this.deliveryTime = deliveryTime;
        this.deliveryLocation = deliveryLocation;
        this.productName = productName;
        this.quantity = quantity;
        this.message = message;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", nullable = false)
    @ToString.Exclude
    private User user;

    @NotNull(message = "Purchase date is required")
    @Column(nullable = false)
    private LocalDate purchaseDate;

    @NotNull(message = "Delivery time is required")
    @Column(nullable = false)
    private LocalTime deliveryTime;

    @NotBlank(message = "Delivery location is required")
    @Column(nullable = false)
    private String deliveryLocation;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String productName;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private Integer quantity;

    @Size(max = 500, message = "Message cannot exceed 500 characters")
    private String message;


}
