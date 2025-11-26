import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resUsuarios, resProductos] = await Promise.all([
          api.get("/api/usuarios"),
          api.get("/api/productos"),
        ]);

        setUsuarios(resUsuarios.data || []);
        setProductos(resProductos.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const stockBajo = productos.filter((p) => p.stock < 5);

  if (cargando) {
    return (
      <div className="container">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Dashboard Administrativo</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Usuarios Registrados</h5>
              <p className="card-text display-6">{usuarios.length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Productos en Inventario</h5>
              <p className="card-text display-6">{productos.length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Productos con Stock Bajo (&lt; 5)</h5>
              <p className="card-text display-6">{stockBajo.length}</p>
            </div>
          </div>
        </div>
      </div>

      <h4>Productos con stock crítico</h4>
      {stockBajo.length === 0 ? (
        <p>No hay productos con stock crítico.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockBajo.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria?.nombre}</td>
                  <td>
                    <span className="badge text-bg-danger">{p.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
