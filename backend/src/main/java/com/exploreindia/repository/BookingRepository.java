package com.exploreindia.repository;

import com.exploreindia.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);
    List<Booking> findByEmailOrderByBookingDateDesc(String email);
    Page<Booking> findByStatus(String status, Pageable pageable);
    long countByStatus(String status);
}
