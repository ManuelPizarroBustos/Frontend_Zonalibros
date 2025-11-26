import { useEffect, useState } from "react";
import api from "../api";

const emptyProduct = {
  id: null,
  nombre: "",
  codigoProducto: "",
  descripcion: "",
  precio: 0,
  stock: 0,
  categoriaId: "",
  imagenUrl: "",
  activo: true,
};

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formProd, setFormProd] = useState(emptyProduct);
  const [editando, setEditando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        api.get("/api/productos"),
        api.get("/api/categorias"),
      ]);
      setProductos(resProd.data || []);
      setCategorias(resCat.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProd((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "precio" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formProd.nombre || !formProd.descripcion) {
      setError("Nombre y descripción son obligatorios.");
      return;
    }

    if (!formProd.categoriaId) {
      setError("Debe seleccionar una categoría.");
      return;
    }

    const body = {
      ...formProd,
      categoria: { id: formProd.categoriaId },
    };

    try {
      if (editando && formProd.id != null) {
        await api.put(`/api/productos/${formProd.id}`, body);
      } else {
        await api.post("/api/productos", body);
      }

      setFormProd(emptyProduct);
      setEditando(false);
      cargarDatos();
    } catch (err) {
      console.error(err);
      setError("Error al guardar el producto.");
    }
  };

  const handleEdit = (p) => {
    setEditando(true);
    setFormProd({
      id: p.id,
      nombre: p.nombre,
      codigoProducto: p.codigoProducto,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      categoriaId: p.categoria?.id || "",
      imagenUrl: p.imagenUrl || "",
      activo: p.activo,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este producto?")) return;
    try {
      await api.delete(`/api/productos/${id}`);
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto.");
    }
  };

  const handleToggleEstado = async (p) => {
    try {
      await api.patch(`/api/productos/${p.id}/desactivar`);
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado del producto.");
    }
  };

  const filtrados = productos.filter((p) => {
    const term = busqueda.toLowerCase();
    const matchNombre = p.nombre?.toLowerCase().includes(term);
    const matchCat =
      !categoriaFiltro || p.categoria?.id === Number(categoriaFiltro);
    return matchNombre && matchCat;
  });

  return (
    <div className="container">
      <h2 className="mb-4">Gestión de Productos</h2>

      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                {editando ? "Editar Producto" : "Nuevo Producto"}
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formProd.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Código</label>
                  <input
                    type="text"
                    className="form-control"
                    name="codigoProducto"
                    value={formProd.codigoProducto}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formProd.descripcion}
                    onChange={handleChange}
                    rows="2"
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={formProd.precio}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={formProd.stock}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    name="categoriaId"
                    value={formProd.categoriaId}
                    onChange={handleChange}
                  >
                    <option value="">-- Seleccionar --</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Imagen (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imagenUrl"
                    value={formProd.imagenUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="activoProd"
                    name="activo"
                    checked={formProd.activo}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="activoProd">
                    Activo
                  </label>
                </div>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <button type="submit" className="btn btn-primary me-2">
                  {editando ? "Actualizar" : "Crear"}
                </button>
                {editando && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setFormProd(emptyProduct);
                      setEditando(false);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Listado */}
        <div className="col-md-7">
          <div className="d-flex flex-wrap justify-content-between mb-2">
            <h5>Listado de Productos</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select
                className="form-select"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.categoria?.nombre}</td>
                    <td>${p.precio}</td>
                    <td>
                      {p.stock < 5 ? (
                        <span className="badge text-bg-danger">
                          {p.stock} (Bajo)
                        </span>
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td>
                      {p.activo ? (
                        <span className="badge text-bg-success">Activo</span>
                      ) : (
                        <span className="badge text-bg-secondary">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning me-1"
                        onClick={() => handleToggleEstado(p)}
                      >
                        Activar/Desactivar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}