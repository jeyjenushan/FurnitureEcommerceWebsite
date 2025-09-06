package org.ai.isserver.configuration;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        logger.error("OAuth2 authentication failed: {}", exception.getMessage());

        // Create error message
        String errorMessage = "Authentication failed";
        if (exception.getMessage() != null) {
            errorMessage = exception.getMessage();
        }

        // Encode error message for URL
        String encodedError = URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);

        // Redirect to frontend with error parameter
        String redirectUrl = frontendUrl + "/login?error=" + encodedError;
        response.sendRedirect(redirectUrl);
    }
}