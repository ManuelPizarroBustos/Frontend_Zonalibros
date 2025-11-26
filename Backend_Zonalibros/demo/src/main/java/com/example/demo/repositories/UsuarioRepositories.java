package com.example.demo.repositories;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.entities.Usuario;
import java.util.Optional;

public interface UsuarioRepositories extends CrudRepository <Usuario, Long>{
    
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
