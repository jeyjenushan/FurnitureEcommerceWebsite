package org.ai.isserver.service;


import org.ai.isserver.model.User;
import org.ai.isserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        System.out.println(oAuth2User);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String username = (String) attributes.get("sub"); // unique ID from provider
        String name = (String) attributes.get("name");
        String email = (String) attributes.get("email");
        String phone = (String) attributes.get("phone_number");
        Map<String, Object> address = (Map<String, Object>) attributes.get("address");
        String country = address != null ? (String) address.get("country") : "Unknown";

        // Save user if not in DB
        userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = new User(username, name, email, phone, country);
            System.out.println("newuser"+newUser);
            return userRepository.save(newUser);
        });


        return oAuth2User; // continue with the normal flow
    }
}
