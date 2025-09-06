package org.ai.isserver.service.impl;

import org.ai.isserver.model.User;
import org.ai.isserver.repository.UserRepository;
import org.ai.isserver.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceHandler implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;


    @Override
    public User createOrUpdateUser(String username, String name, String email, String contactNumber, String country) {
        try {
            Optional<User> existingUser = userRepository.findByUsername(username);

            if (existingUser.isPresent()) {
                User user = existingUser.get();
                user.setName(name);
                user.setEmail(email);
                user.setContactNumber(contactNumber);
                user.setCountry(country);
                return userRepository.save(user);
            } else {
                User newUser = new User(username, name, email, contactNumber, country);
                return userRepository.save(newUser);
            }
        } catch (Exception e) {
            logger.error("Error creating or updating user: {}", e.getMessage());
            throw new RuntimeException("Failed to create or update user", e);
        }
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
