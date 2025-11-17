package com.kanban.board.oauth;

import com.kanban.board.entity.User;
import com.kanban.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        log.debug("OAuth2 Login - registrationId: {}, userNameAttributeName: {}",
                registrationId, userNameAttributeName);

        OAuth2Attributes attributes = OAuth2Attributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        User user = saveOrUpdate(attributes);

        return new CustomOAuth2User(user, oAuth2User.getAttributes(), userNameAttributeName);
    }

    private User saveOrUpdate(OAuth2Attributes attributes) {
        User user = userRepository.findByEmail(attributes.getEmail())
                .map(entity -> entity.updateFullName(attributes.getName()))
                .orElse(User.builder()
                        .username(attributes.getEmail().split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 8))
                        .email(attributes.getEmail())
                        .fullName(attributes.getName())
                        .password(passwordEncoder.encode(UUID.randomUUID().toString())) // OAuth 사용자는 비밀번호 사용 안 함
                        .build());

        return userRepository.save(user);
    }
}
