package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import com.example.demo.entities.Usuario;

public interface UsuarioServices {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Usuario save(Usuario usuario);        
    List<Usuario> findAll();          
    Optional<Usuario> findById(Long id);  
    void deleteById(Long id); 
}
