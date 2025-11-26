package com.example.demo.services;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Categoria;
import com.example.demo.repositories.CategoriaRepositories;

@Service
public class CategoriaServicesImpl implements CategoriaServices{
    
    @Autowired
    private CategoriaRepositories categoriaRepositories;

    @Override
    public Categoria crear(Categoria categoria){
    if (categoria == null) {
            throw new IllegalArgumentException("La categoría no puede ser null.");
        }

        Categoria guardada = categoriaRepositories.save(categoria);
        return Objects.requireNonNull(guardada, "La categoría guardada no puede ser null");
    }


    @Override
    public Categoria obtenerId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser null.");
            }   

        return categoriaRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Override
    public List<Categoria> listarTodas() {
        return (List<Categoria>) categoriaRepositories.findAll();
    }

    @Override
    public void eliminar(Long id) {

        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser null.");
        }

        if (!categoriaRepositories.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }

        categoriaRepositories.deleteById(id);
    }


    @Override
    public Categoria actualizar(Long id, Categoria categoriaActualizada) {
        Categoria existente = obtenerId(id);
        existente.setNombre(categoriaActualizada.getNombre());
        return categoriaRepositories.save(existente);
    }

}
