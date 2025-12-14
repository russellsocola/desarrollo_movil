const express = require("express");
const router = express.Router();
const canchaController = require("../controllers/cancha.controller");


router.get("/search_canchas_by_name", canchaController.searchCanchasByName);
router.get("/search_cancha_by_id", canchaController.searchCanchaById);
router.get("/search_reservas_by_user", canchaController.searchReservasByUser);
router.get("/validar_login", canchaController.validarLogin);
router.post("/update_favorito", canchaController.updateFavorito);

router.delete("/delete_reserva", canchaController.deleteReserva);

module.exports = router;

