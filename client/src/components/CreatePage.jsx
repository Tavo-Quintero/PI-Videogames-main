import React, { useEffect, useState } from "react";
import "../styles/CreatePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MultiSelect from "./MultiSelect";


const CreatePage = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [generos, setGeneros] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    imagen: "",
    descripcion: "",
    plataformas: "",
    fechaLanzamiento: "",
    rating: "",
    genero: [],
  });
  const [errors, setErrors] = useState({
    nombre: false,
    imagen: false,
    descripcion: false,
    plataformas: false,
    fechaLanzamiento: false,
    rating: false,
    genero: false,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchGenres();
  }, []);

  const onClickVolver = () => {
    navigate("/home");
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://localhost:3001/genres/");
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al obtener los géneros:", error);
    }
  };

  const handleMultiSelectChange = (ids) => {
    setSelectedIds(ids);
    setFormData({ ...formData, genero: ids });
    if (ids.length > 0 && ids.length <= 3) {
      setErrors({ ...errors, genero: false });
    } else {
      setErrors({ ...errors, genero: true });
    }
    // Limpiar mensajes de éxito y error al cambiar selección
    setShowSuccessMessage(false);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "nombre":
        const nombreRegex = /^[a-zA-Z\s]+$/;
        if (value.length > 80 || !nombreRegex.test(value)) {
          setErrors({ ...errors, nombre: true });
        } else {
          setErrors({ ...errors, nombre: false });
        }
        break;
      case "imagen":
        const urlRegex = /^https:\/\/.+/;
        if (!urlRegex.test(value)) {
          setErrors({ ...errors, imagen: true });
        } else {
          setErrors({ ...errors, imagen: false });
        }
        break;
      case "descripcion":
        if (value.length === 0) {
          setErrors({ ...errors, descripcion: true });
        } else {
          setErrors({ ...errors, descripcion: false });
        }
        break;
      case "plataformas":
        if (value.length === 0) {
          setErrors({ ...errors, plataformas: true });
        } else {
          setErrors({ ...errors, plataformas: false });
        }
        break;
        case "fechaLanzamiento":
          const dateValue = new Date(value); // Convierte el valor de fecha a un objeto Date
    
          // Validación de fecha
          if (isNaN(dateValue.getTime())) {
            // Si no es una fecha válida
            setErrors({ ...errors, fechaLanzamiento: true });
          } else {
            const year = dateValue.getFullYear();
    
            // Validar rango de años
            if (year < 1200 || year > new Date().getFullYear()) {
              setErrors({ ...errors, fechaLanzamiento: true });
            } else {
              setErrors({ ...errors, fechaLanzamiento: false });
            }
          }
          break;
      case "rating":
        const ratingValue = parseFloat(value);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
          setErrors({ ...errors, rating: true });
        } else {
          setErrors({ ...errors, rating: false });
        }
        break;
      default:
        break;
    }
    setFormData({ ...formData, [name]: value });

    // Limpiar mensajes de éxito y error al comenzar a llenar el formulario
    setShowSuccessMessage(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones adicionales
    if (
      formData.nombre.trim() === "" ||
      formData.imagen.trim() === "" ||
      formData.descripcion.trim() === "" ||
      formData.plataformas.trim() === "" ||
      formData.fechaLanzamiento === "" ||
      formData.rating === "" ||
      errors.nombre ||
      errors.imagen ||
      errors.descripcion ||
      errors.plataformas ||
      errors.rating ||
      errors.fechaLanzamiento ||
      formData.genero.length === 0 ||
      formData.genero.length > 3
    ) {
      setErrorMessage("Todos los campos deben ser completados correctamente.");
      setErrors({
        ...errors,
        nombre: formData.nombre.trim() === "",
        imagen: formData.imagen.trim() === "",
        descripcion: formData.descripcion.trim() === "",
        plataformas: formData.plataformas.trim() === "",
        genero: formData.genero.length === 0 || formData.genero.length > 3,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/videogames/", {
        nombre: formData.nombre,
        imagen: formData.imagen,
        descripcion: formData.descripcion,
        plataforma: formData.plataformas,
        fecha_lanzamiento: formData.fechaLanzamiento,
        rating: formData.rating,
        genero: formData.genero,
      });
      console.log("Videojuego creado:", response.data);
      setShowSuccessMessage(true);
      setErrorMessage("");
      // Limpiar el formulario después de la creación exitosa
      setFormData({
        nombre: "",
        imagen: "",
        descripcion: "",
        plataformas: "",
        fechaLanzamiento: "",
        rating: "",
        genero: [],
      });
      setSelectedIds([]);
      setErrors({
        nombre: false,
        imagen: false,
        descripcion: false,
        plataformas: false,
        fechaLanzamiento: false,
        rating: false,
        genero: false,
      });
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.data);
        setErrorMessage("Error al crear el videojuego: " + error.response.data.message);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        setErrorMessage("No se recibió respuesta del servidor.");
      } else {
        console.error("Error al configurar la solicitud:", error.message);
        setErrorMessage("Error al configurar la solicitud: " + error.message);
      }
    }
  };

  return (
    <div className="background-container">
      <div className="form-container">
        <h1>Crear Videojuego</h1>
    
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <p>Solo se admiten 80 caracteres máximo</p>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={{ width: "80%" }}
              className={errors.nombre ? "input-error" : ""}
            />
            {errors.nombre && (
              <p className="error-message">El nombre no puede exceder los 80 caracteres y solo debe contener letras.</p>
            )}
          </div>
          <div>
            <label>Imagen:</label>
            <p>Solo se admiten enlaces URL</p>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              style={{ width: "80%" }}
              className={errors.imagen ? "input-error" : ""}
            />
            {errors.imagen && (
              <p className="error-message">La URL de la imagen debe comenzar con HTTPS.</p>
            )}
          </div>
          <div>
            <label>Descripción:</label>
            <p>La descripción no puede estar vacía</p>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              style={{ width: "80%" }}
              className={errors.descripcion ? "input-error" : ""}
            />
            {errors.descripcion && (
              <p className="error-message">La descripción no puede estar vacía.</p>
            )}
          </div>
          <div>
            <label>Plataformas:</label>
            <p>Las plataformas no pueden estar vacías</p>
            <input
              type="text"
              name="plataformas"
              value={formData.plataformas}
              onChange={handleChange}
              style={{ width: "80%" }}
              className={errors.plataformas ? "input-error" : ""}
            />
            {errors.plataformas && (
              <p className="error-message">Las plataformas no pueden estar vacías.</p>
            )}
          </div>
          <div className="date-picker-container">
            <label htmlFor="fechaLanzamiento">Fecha de Lanzamiento:</label>
            <input
              type="date"
              name="fechaLanzamiento"
              value={formData.fechaLanzamiento}
              onChange={handleChange}
             
              className={`custom-date-picker ${errors.fechaLanzamiento ? "input-error" : ""}`}
            />
            {errors.fechaLanzamiento && (
              <p className="error-message">La fecha de lanzamiento debe estar en formato dd/mm/aaaa y ser válida.</p>
            )}
          </div>
          <div>
            <label>Rating:</label>
            <p>El rating se mide de 1 a 5</p>
            <input
              type="number"
              min="1"
              max="5"
              step="1"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              style={{ width: "80%" }}
              className={errors.rating ? "input-error" : ""}
            />
            {errors.rating && (
              <p className="error-message">El rating debe ser un número entre 1 y 5.</p>
            )}
          </div>
          <div>
            <label>Géneros:</label>
            <p>Debe seleccionar al menos un género y no más de tres</p>
            <MultiSelect
              options={generos}
              name="genero"
              onChange={handleMultiSelectChange}
              value={selectedIds}
            />
            {errors.genero && (
              <p className="error-message">Debe seleccionar entre 1 y 3 géneros.</p>
            )}
          </div>
          <div className="submit-button-container">
            <button type="submit" className="submit-button">
              Crear Videojuego
            </button>
            {showSuccessMessage && (
              <div className="success-message">
                ¡El videojuego fue creado exitosamente!
              </div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
          <div className="button-container">
            <button className="create-button" onClick={onClickVolver}>
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
