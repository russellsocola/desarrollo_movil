const express = require("express");
const router = express.Router();
const canchaController = require("../controllers/cancha.controller");

// Rutas para búsqueda de canchas
router.get("/search_canchas_by_name", canchaController.searchCanchasByName);
router.get("/search_cancha_by_id", canchaController.searchCanchaById);

module.exports = router;

