package org.ai.isserver.service;

import org.ai.isserver.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public interface UserService {

    public User createOrUpdateUser(String username, String name, String email,
                                   String contactNumber, String country);
    public Optional<User> findByUsername(String username);
    public boolean existsByEmail(String email);
    public boolean existsByUsername(String username);


}
