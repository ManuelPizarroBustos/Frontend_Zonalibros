package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.entities.Categoria;

public interface CategoriaRepositories extends CrudRepository<Categoria, Long> {
    List<Categoria> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
