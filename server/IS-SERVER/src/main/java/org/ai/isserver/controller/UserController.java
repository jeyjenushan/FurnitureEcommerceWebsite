package org.ai.isserver.controller;

import org.ai.isserver.dto.ApiResponse;
import org.ai.isserver.dto.UserProfileDTO;
import org.ai.isserver.model.User;
import org.ai.isserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserProfile(OAuth2AuthenticationToken authentication) {
        try {
            OAuth2User oauth2User = authentication.getPrincipal();
            String username = oauth2User.getAttribute("sub");

            Optional<User> userOptional = userService.findByUsername(username);
            if (userOptional.isEmpty()) {
                // Create user if not exists
                String name = oauth2User.getAttribute("name");
                String email = oauth2User.getAttribute("email");
                String contactNumber = oauth2User.getAttribute("phone_number");
                String country = oauth2User.getAttribute("country");



                User user = userService.createOrUpdateUser(username, name, email, contactNumber, country);
                UserProfileDTO profile = new UserProfileDTO(
                        user.getUsername(), user.getName(), user.getEmail(),
                        user.getContactNumber(), user.getCountry()
                );
                return ResponseEntity.ok(ApiResponse.success(profile));
            }

            User user = userOptional.get();
            UserProfileDTO profile = new UserProfileDTO(
                    user.getUsername(), user.getName(), user.getEmail(),
                    user.getContactNumber(), user.getCountry()
            );

            return ResponseEntity.ok(ApiResponse.success(profile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch user profile"));
        }
    }
}