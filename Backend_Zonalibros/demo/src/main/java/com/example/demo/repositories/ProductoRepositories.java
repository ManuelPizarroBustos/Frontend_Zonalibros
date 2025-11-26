package com.example.demo.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.entities.Categoria;
import com.example.demo.entities.Producto;

public interface ProductoRepositories extends CrudRepository<Producto, Long>{
    List<Producto> findByNombre(String nombre);

    List<Producto> findByCategoria(Categoria categoria);

    // Productos con stock bajo (rubro: alerta de stock)
    List<Producto> findByStockLessThan(Integer cantidad);

    boolean existsByNombre(String nombre);
    
}
