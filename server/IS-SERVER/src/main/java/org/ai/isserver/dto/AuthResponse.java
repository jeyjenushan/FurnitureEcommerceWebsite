package org.ai.isserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private UserProfileDTO user;

    public AuthResponse(String accessToken, UserProfileDTO user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}
