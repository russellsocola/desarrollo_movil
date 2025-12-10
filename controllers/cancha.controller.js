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

  if (!ls_name) {
    return sendError(res, 400, 'El parámetro name es requerido');
  }

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

/**
 * Buscar canchas por nombre usando stored procedure
 */
const searchCanchaById = (req, res) => {
  const li_id = req.query.id;

  if (!li_id) {
    return sendError(res, 400, 'El parámetro id es requerido');
  }

  const consulta = "CALL USP_Cancha_SearchById(?)";
  
  conexion.query(consulta, [li_id], (err, rpta) => {
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

module.exports = {
  searchCanchasByName,
  searchCanchaById,
};

