package com.kanban.board.oauth;

import com.kanban.board.security.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Value("${oauth2.authorized-redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String username = oAuth2User.getUser().getUsername();

        log.debug("OAuth2 Authentication Success - username: {}", username);

        String token = jwtUtil.generateToken(username);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("username", username)
                .queryParam("email", oAuth2User.getUser().getEmail())
                .queryParam("fullName", oAuth2User.getUser().getFullName())
                .queryParam("profileImageUrl", oAuth2User.getUser().getProfileImageUrl() != null ? oAuth2User.getUser().getProfileImageUrl() : "")
                .encode()
                .build().toUriString();

        log.debug("Redirecting to: {}", targetUrl);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
