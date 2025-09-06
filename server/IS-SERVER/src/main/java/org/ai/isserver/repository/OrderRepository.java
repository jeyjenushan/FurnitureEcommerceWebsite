package org.ai.isserver.repository;

import org.ai.isserver.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    List<Order> findByUserUsernameOrderByPurchaseDateDesc(String username);

    @Query("SELECT o FROM Order o WHERE o.user.username = :username AND o.purchaseDate >= :currentDate ORDER BY o.purchaseDate ASC")
    List<Order> findUpcomingOrdersByUsername(@Param("username") String username, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT o FROM Order o WHERE o.user.username = :username AND o.purchaseDate < :currentDate ORDER BY o.purchaseDate DESC")
    List<Order> findPastOrdersByUsername(@Param("username") String username, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.username = :username")
    long countByUserUsername(@Param("username") String username);

    @Query("SELECT o FROM Order o WHERE o.user.username = :username AND o.id = :orderId")
    Order findByUserUsernameAndId(@Param("username") String username, @Param("orderId") Long orderId);






}
