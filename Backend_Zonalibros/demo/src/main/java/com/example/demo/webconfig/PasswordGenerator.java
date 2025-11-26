package com.example.demo.webconfig;


import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 
@Configuration
public class PasswordGenerator {

    @Bean
    public CommandLineRunner generatePassword() {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String hash = encoder.encode("admin123");
            System.out.println("BCrypt para admin = " + hash);
        };
    }
} 