package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Usuario;
import com.example.demo.services.UsuarioServices;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {
    
         private final UsuarioServices usuarioServices;

    

    public UsuarioRestController(UsuarioServices usuarioServices) {
        this.usuarioServices = usuarioServices;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return usuarioServices.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        if (usuarioServices.existsByUsername(usuario.getUsername())
                || usuarioServices.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().build();  
        }
        Usuario saved = usuarioServices.save(usuario);
        return ResponseEntity.ok(saved);
    }


    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = new ArrayList<>();
        usuarioServices.findAll().forEach(usuarios::add);
        return ResponseEntity.ok(usuarios);
    }
}
