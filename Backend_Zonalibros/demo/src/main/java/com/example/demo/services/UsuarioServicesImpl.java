package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Usuario;
import com.example.demo.repositories.UsuarioRepositories;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioServicesImpl implements UsuarioServices{
    @Autowired
    private UsuarioRepositories usuarioRepositories;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepositories.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepositories.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return usuarioRepositories.findByUsername(username).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return usuarioRepositories.findByEmail(email).isPresent();
    }

    @Override
    @Transactional
    public Usuario save(Usuario usuario) {
        if (usuario.getPassword() != null && !usuario.getPassword().startsWith("$2a$")) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        return usuarioRepositories.save(usuario);
       
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return (List<Usuario>)usuarioRepositories.findAll();
    }
    

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
       if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser null.");
        }
        return usuarioRepositories.findById(id);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (id == null) {
           throw new IllegalArgumentException("El ID no puede ser null.");
        }
        usuarioRepositories.deleteById(id);
    }
}
