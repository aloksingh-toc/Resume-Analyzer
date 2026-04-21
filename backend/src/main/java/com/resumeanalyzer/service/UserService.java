package com.resumeanalyzer.service;

import com.resumeanalyzer.model.AppUser;
import com.resumeanalyzer.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.username}")
    private String adminUsername;

    @Value("${app.password}")
    private String adminPassword;

    private String encodedAdminPassword;

    @PostConstruct
    public void init() {
        this.encodedAdminPassword = passwordEncoder.encode(adminPassword);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (adminUsername.equals(username)) {
            return User.withUsername(adminUsername)
                .password(encodedAdminPassword)
                .roles("USER", "ADMIN")
                .build();
        }
        AppUser user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return User.withUsername(user.getUsername())
            .password(user.getPassword())
            .roles("USER")
            .build();
    }

    public AppUser register(String username, String password, String email) {
        if (adminUsername.equalsIgnoreCase(username) || userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }
        AppUser user = new AppUser();
        user.setUsername(username.trim());
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email != null ? email.trim() : null);
        return userRepository.save(user);
    }
}
