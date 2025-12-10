const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'decidetucancha'
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

conexion.connect((error) => {
  if (error) throw error
  console.log('Conexión exitosa a la base de datos decidetucancha.');
});

app.get('/', (req, res) => {
  res.send('API DecideTuCancha Activa');
});

app.get('/canchas', (req, res) => {
  const sql = 'SELECT * FROM cancha';

  conexion.query(sql, (error, resultado) => {
    if (error) return res.status(500).send(error.message);

    const respuesta = {};
    if (resultado.length > 0) {
        respuesta.listaCanchas = resultado;
        res.json(respuesta);
    } else {
        res.json({ listaCanchas: [] });
    }     
  });
});

app.get('/canchas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM cancha WHERE id = ?';
  
    conexion.query(sql, [id], (error, resultado) => {
      if (error) return res.status(500).send(error.message);
  
      if (resultado.length > 0) {
          res.json(resultado[0]);
      } else {
          res.status(404).json({ mensaje: 'Cancha no encontrada' });
      }     
    });
});

app.post('/reservar', (req, res) => {
    const { usuario_id, cancha_id, fecha, hora, metodo_pago, monto_total } = req.body;

    const sqlVerificar = 'SELECT * FROM reserva WHERE cancha_id = ? AND fecha = ? AND hora = ?';

    conexion.query(sqlVerificar, [cancha_id, fecha, hora], (error, resultados) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error al verificar disponibilidad' });
        }

        if (resultados.length > 0) {
            return res.status(409).json({ 
                mensaje: 'Lo sentimos, este horario ya está reservado por otra persona.' 
            });
        }
        
        const sqlInsertar = `INSERT INTO reserva (usuario_id, cancha_id, fecha, hora, metodo_pago, monto_total) 
                             VALUES (?, ?, ?, ?, ?, ?)`;

        conexion.query(sqlInsertar, [usuario_id, cancha_id, fecha, hora, metodo_pago, monto_total], (errorInsert, resultadoInsert) => {
            if (errorInsert) {
                console.error(errorInsert);
                return res.status(500).json({ mensaje: 'Error al registrar la reserva' });
            }

            res.json({ 
                mensaje: 'Reserva registrada con éxito',
                id_reserva: resultadoInsert.insertId 
            });
        });
    });
});

app.get('/mis-reservas/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    
    const sql = `
        SELECT r.id, r.fecha, r.hora, r.estado, r.monto_total, 
               c.nombre as nombre_cancha, c.sede, c.imagen_url
        FROM reserva r
        INNER JOIN cancha c ON r.cancha_id = c.id
        WHERE r.usuario_id = ?
        ORDER BY r.id DESC
    `;

    conexion.query(sql, [usuario_id], (error, resultado) => {
        if (error) return res.status(500).send(error.message);

        const respuesta = {};
        if (resultado.length > 0) {
            respuesta.listaReservas = resultado;
            res.json(respuesta);
        } else {
            respuesta.listaReservas = [];
            res.json(respuesta);
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuario WHERE email = ? AND password = ?';

    conexion.query(sql, [email, password], (error, resultado) => {
        if (error) return res.status(500).send(error.message);

        if (resultado.length > 0) {
            res.json({ 
                mensaje: 'Login exitoso', 
                usuario: resultado[0] 
            });
        } else {
            res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
    });
});

app.get('/disponibilidad/:cancha_id/:fecha', (req, res) => {
    const { cancha_id, fecha } = req.params;

    const sql = 'SELECT hora FROM reserva WHERE cancha_id = ? AND fecha = ? AND estado = "Confirmada"';

    conexion.query(sql, [cancha_id, fecha], (error, resultados) => {
        if (error) return res.status(500).send(error.message);

        const horasOcupadas = resultados.map(fila => fila.hora);
        
        res.json({ horasOcupadas: horasOcupadas });
    });
});