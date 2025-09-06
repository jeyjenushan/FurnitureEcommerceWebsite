package org.ai.isserver.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.ai.isserver.model.User;
import org.ai.isserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // Extract OAuth2 attributes
        String username = oauth2User.getAttribute("sub");   // unique ID
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String contactNumber = oauth2User.getAttribute("phone_number"); // may be null
        Map<String, Object> address = oauth2User.getAttribute("address");
        String country = (address != null) ? (String) address.get("country") : null;

        // Check DB for user
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            // Create new user if not exists
            user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setName(name);
            user.setContactNumber(contactNumber != null ? contactNumber : "N/A"); // avoid validation error
            user.setCountry(country);
            user = userRepository.save(user);
        }
        System.out.println(user);

        // Return DB user info instead of raw OAuth2User
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("contactNumber", user.getContactNumber());
        userInfo.put("country", user.getCountry());

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
