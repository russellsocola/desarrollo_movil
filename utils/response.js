/**
 * Utilidades para respuestas estandarizadas de la API
 * Estructura siempre: {data: null, isSuccessful: true|false, errorMessage: ""}
 */

const sendSuccess = (res, data) => {
  return res.json({
    data: data || null,
    isSuccessful: true,
    errorMessage: ""
  });
};

const sendError = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({
    data: null,
    isSuccessful: false,
    errorMessage: errorMessage
  });
};

module.exports = {
  sendSuccess,
  sendError
};

