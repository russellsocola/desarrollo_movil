const conexion = require("../config/database");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * Buscar canchas por nombre usando consulta SQL directa
 */
const searchProductsByNameSelect = (req, res) => {
  const ls_name = req.query.name;

  if (!ls_name) {
    return sendError(res, 400, 'El parámetro name es requerido');
  }

  const consulta = "SELECT * FROM cancha c WHERE c.deporte LIKE CONCAT('%', ?, '%')";
  
  conexion.query(consulta, [ls_name], (err, rpta) => {
    if (err) {
      console.error("Error en la consulta:", err.message);
      return sendError(res, 500, err.message);
    }

    // Si hay resultados, devolverlos; si no, devolver null
    const data = (rpta && rpta.length > 0) ? rpta : null;
    return sendSuccess(res, data);
  });
};

/**
 * Buscar canchas por nombre usando stored procedure
 */
const searchCanchasByName = (req, res) => {
  const ls_name = req.query.name;

  /*if (!ls_name) {
    return sendError(res, 400, 'El parámetro name es requerido');
  }*/

  const consulta = "CALL USP_Cancha_SearchByName(?)";
  
  conexion.query(consulta, [ls_name], (err, rpta) => {
    if (err) {
      console.error("Error al ejecutar el stored procedure:", err.message);
      return sendError(res, 500, err.message);
    }

    // Los stored procedures pueden devolver múltiples resultados
    // El primer elemento del array es generalmente el resultado principal
    const resultado = Array.isArray(rpta) && rpta.length > 0 ? rpta[0] : rpta;
    const data = (resultado && resultado.length > 0) ? resultado : null;
    
    return sendSuccess(res, data);
  });
};

const searchReservasByUser = (req, res) => {
  const li_id_usuario = req.query.id_usuario;

  if (!li_id_usuario) {
    return sendError(res, 400, 'El parámetro id_usuario es requerido');
  }

  if (isNaN(li_id_usuario)) {
    return sendError(res, 400, 'El parámetro id_usuario debe ser un número');
  }

  const consulta = "CALL USP_Reserva_Listado(?)";
  
  conexion.query(consulta, [li_id_usuario], (err, rpta) => {
    if (err) {
      console.error("Error al ejecutar el stored procedure:", err.message);
      return sendError(res, 500, err.message);
    }

    // Los stored procedures pueden devolver múltiples resultados
    // El primer elemento del array es generalmente el resultado principal
    const resultado = Array.isArray(rpta) && rpta.length > 0 ? rpta[0] : rpta;
    const data = (resultado && resultado.length > 0) ? resultado : null;
    
    return sendSuccess(res, data);
  });
};

/**
 * Buscar cancha por ID usando stored procedure
 * Recibe: id (cancha) e id_usuario como query parameters
 */
const searchCanchaById = (req, res) => {
  const li_id = req.query.id;
  const li_id_usuario = req.query.id_usuario;

  if (!li_id) {
    return sendError(res, 400, 'El parámetro id es requerido');
  }

  if (!li_id_usuario) {
    return sendError(res, 400, 'El parámetro id_usuario es requerido');
  }

  // Validar que sean números
  if (isNaN(li_id)) {
    return sendError(res, 400, 'El parámetro id debe ser un número');
  }

  if (isNaN(li_id_usuario)) {
    return sendError(res, 400, 'El parámetro id_usuario debe ser un número');
  }

  const consulta = "CALL USP_Cancha_SearchById(?, ?)";
  
  conexion.query(consulta, [parseInt(li_id), parseInt(li_id_usuario)], (err, rpta) => {
    if (err) {
      console.error("Error al ejecutar el stored procedure:", err.message);
      return sendError(res, 500, err.message);
    }

    // Los stored procedures pueden devolver múltiples resultados
    // El primer elemento del array es generalmente el resultado principal
    const resultado = Array.isArray(rpta) && rpta.length > 0 ? rpta[0] : rpta;
    
    // Para searchCanchaById, devolver un solo objeto, no un array
    let data = null;
    if (resultado) {
      if (Array.isArray(resultado) && resultado.length > 0) {
        // Si es un array, tomar el primer elemento (objeto único)
        data = resultado[0];
      } else if (!Array.isArray(resultado)) {
        // Si ya es un objeto, usarlo directamente
        data = resultado;
      }
    }
    
    return sendSuccess(res, data);
  });
};

/**
 * Actualizar favorito de cancha usando stored procedure
 * Recibe JSON: { id_usuario: 0, id_cancha: 0, estado: true/false }
 */
const updateFavorito = (req, res) => {
  const { id_usuario, id_cancha, estado } = req.body;

  // Validar que todos los parámetros requeridos estén presentes
  if (id_usuario === undefined || id_usuario === null) {
    return sendError(res, 400, 'El parámetro id_usuario es requerido');
  }

  if (id_cancha === undefined || id_cancha === null) {
    return sendError(res, 400, 'El parámetro id_cancha es requerido');
  }

  if (estado === undefined || estado === null) {
    return sendError(res, 400, 'El parámetro estado es requerido');
  }

  // Validar que id_usuario e id_cancha sean números
  if (typeof id_usuario !== 'number' || isNaN(id_usuario)) {
    return sendError(res, 400, 'El parámetro id_usuario debe ser un número');
  }

  if (typeof id_cancha !== 'number' || isNaN(id_cancha)) {
    return sendError(res, 400, 'El parámetro id_cancha debe ser un número');
  }

  // Validar que estado sea un booleano
  if (typeof estado !== 'boolean') {
    return sendError(res, 400, 'El parámetro estado debe ser un booleano (true o false)');
  }

  // Convertir booleano a bit (0 o 1) para el stored procedure
  const estadoBit = estado ? 1 : 0;

  const consulta = "CALL USP_Cancha_FavoritoUpdate(?, ?, ?)";
  
  conexion.query(consulta, [id_usuario, id_cancha, estadoBit], (err, rpta) => {
    if (err) {
      console.error("Error al ejecutar el stored procedure:", err.message);
      return sendError(res, 500, err.message);
    }

    // Los stored procedures de actualización pueden devolver diferentes estructuras
    // Devolver el resultado del stored procedure
    const resultado = Array.isArray(rpta) && rpta.length > 0 ? rpta[0] : rpta;
    const data = resultado || null;
    
    return sendSuccess(res, data);
  });
};

/**
 * Eliminar reserva usando stored procedure
 * Recibe: id_reserva como query parameter o en el body
 * SP: USP_Reserva_Eliminar(in p_id_reserva int, out p_mensaje string)
 */
const deleteReserva = (req, res) => {
  // Intentar obtener id_reserva desde query params, body o params
  const li_id_reserva = req.query.id_reserva || req.body.id_reserva || req.params.id_reserva;

  if (!li_id_reserva) {
    return sendError(res, 400, 'El parámetro id_reserva es requerido');
  }

  // Validar que sea un número
  if (isNaN(li_id_reserva)) {
    return sendError(res, 400, 'El parámetro id_reserva debe ser un número');
  }

  // Llamar al stored procedure con variable de sesión para capturar el parámetro OUT
  const consulta = "CALL USP_Reserva_Eliminar(?, @p_mensaje)";
  
  conexion.query(consulta, [parseInt(li_id_reserva)], (err, rpta) => {
    if (err) {
      console.error("Error al ejecutar el stored procedure:", err.message);
      return sendError(res, 500, err.message);
    }

    // Obtener el valor del parámetro OUT desde la variable de sesión
    conexion.query("SELECT @p_mensaje as mensaje", (err2, resultado) => {
      if (err2) {
        console.error("Error al obtener el mensaje del stored procedure:", err2.message);
        return sendError(res, 500, err2.message);
      }

      // El mensaje viene en el resultado del SELECT
      const mensaje = resultado && resultado.length > 0 ? resultado[0].mensaje : null;
      
      // Si el mensaje está vacío o es null, la operación fue exitosa
      // Si el mensaje tiene valor, hubo un error y se debe mostrar en errorMessage
      if (!mensaje || mensaje === '' || mensaje.trim() === '') {
        // Operación exitosa
        return sendSuccess(res, null);
      } else {
        // Hubo un error, el mensaje contiene la descripción del error
        return sendError(res, 400, mensaje);
      }
    });
  });
};

const validarLogin = (req, res) => {
  const ls_email = req.query.email;
  const ls_password = req.query.password;

  if (!ls_email) {
    return sendError(res, 400, 'El parámetro email es requerido');
  }

  if (!ls_password) {
    return sendError(res, 400, 'El parámetro password es requerido');
  }

  const consulta = "CALL USP_Login_IniciarSesion(?, ?)";
  
  conexion.query(consulta, [ls_email, ls_password], (err, rpta) => {
    if (err) {
      console.error("Error al ejecutar el stored procedure:", err.message);
      return sendError(res, 500, err.message);
    }

    const resultado = Array.isArray(rpta) && rpta.length > 0 ? rpta[0] : rpta;
    
    let data = null;
    if (resultado) {
      if (Array.isArray(resultado) && resultado.length > 0) {
        data = resultado[0];
      } else if (!Array.isArray(resultado)) {
        data = resultado;
      }
    }
    
    return sendSuccess(res, data);
  });
};

module.exports = {
  searchCanchasByName,
  searchCanchaById,
  updateFavorito,
  searchReservasByUser,
  deleteReserva,
  validarLogin,
};

