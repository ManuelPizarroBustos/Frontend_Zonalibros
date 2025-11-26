import { useEffect, useState } from "react";
import api from "../api";

const emptyUser = {
  id: null,
  nombre: "",
  username: "",
  email: "",
  password: "",
  rol: "ADMIN",
  activo: true,
};

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [formUser, setFormUser] = useState(emptyUser);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/api/usuarios");
      setUsuarios(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formUser.nombre || !formUser.username || !formUser.email) {
      setError("Nombre, usuario y email son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formUser.email)) {
      setError("Formato de email inválido.");
      return;
    }

    try {
      if (editando && formUser.id != null) {
        await api.put(`/api/usuarios/${formUser.id}`, formUser);
      } else {
        await api.post("/api/usuarios", formUser);
      }

      setFormUser(emptyUser);
      setEditando(false);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      setError("Error al guardar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setEditando(true);
    setFormUser({
      ...usuario,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este usuario?")) return;
    try {
      await api.delete(`/api/usuarios/${id}`);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario.");
    }
  };

  const filtrados = usuarios.filter((u) => {
    const term = busqueda.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container">
      <h2 className="mb-4">Gestión de Usuarios</h2>

      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                {editando ? "Editar Usuario" : "Nuevo Usuario"}
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formUser.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formUser.username}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formUser.email}
                    onChange={handleChange}
                  />
                </div>

                {!editando && (
                  <div className="mb-2">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formUser.password}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="mb-2">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    name="rol"
                    value={formUser.rol}
                    onChange={handleChange}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="VENDEDOR">VENDEDOR</option>
                    <option value="CLIENTE">CLIENTE</option>
                  </select>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formUser.activo}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="activo">
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
                      setFormUser(emptyUser);
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

        <div className="col-md-7">
          <div className="d-flex justify-content-between mb-2">
            <h5>Listado de Usuarios</h5>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Buscar por nombre, usuario o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      {u.activo ? (
                        <span className="badge text-bg-success">Activo</span>
                      ) : (
                        <span className="badge text-bg-secondary">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No se encontraron usuarios.
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
