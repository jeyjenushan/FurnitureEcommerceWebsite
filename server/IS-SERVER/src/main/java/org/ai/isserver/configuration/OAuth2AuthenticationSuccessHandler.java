package org.ai.isserver.configuration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            // Extract user info from OAuth2User
            String username = oauth2User.getAttribute("sub");
            String name = oauth2User.getAttribute("name");
            String email = oauth2User.getAttribute("email");

            // Store user info in session
            request.getSession().setAttribute("user", oauth2User);
            request.getSession().setAttribute("authenticated", true);

            System.out.println("=== OAuth Success Handler ===");
            System.out.println("User: " + username);
            System.out.println("Frontend URL: " + frontendUrl);

            // Ensure we have a valid redirect URL
            String redirectUrl = frontendUrl;
            if (redirectUrl == null || redirectUrl.isEmpty()) {
                redirectUrl = "https://localhost:5173";
            }

            // Add trailing slash if not present
            if (!redirectUrl.endsWith("/")) {
                redirectUrl += "/";
            }

            System.out.println("Redirecting to: " + redirectUrl);
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            System.err.println("Error in OAuth success handler: " + e.getMessage());
            e.printStackTrace();

            // Fallback redirect
            response.sendRedirect("https://localhost:5173/");
        }
    }
}