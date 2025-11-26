package com.example.demo.services;

import java.util.List;

import com.example.demo.entities.Categoria;

public interface CategoriaServices {
    
    Categoria crear(Categoria categoria);
    Categoria obtenerId(Long id);
    List<Categoria> listarTodas();    
    void eliminar(Long id);
    Categoria actualizar(Long id, Categoria categoriaActualizada);
}
