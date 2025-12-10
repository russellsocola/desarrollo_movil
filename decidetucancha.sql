DROP DATABASE IF EXISTS decidetucancha;
CREATE DATABASE decidetucancha;
USE decidetucancha;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(50)
);

CREATE TABLE cancha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,       
    deporte VARCHAR(50) NOT NULL,       
    sede VARCHAR(100) NOT NULL,         
    precio_hora DECIMAL(10,2) NOT NULL, 
    dimensiones VARCHAR(50),            
    tipo_piso VARCHAR(50),              
    imagen_url VARCHAR(255)             
);

CREATE TABLE reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    cancha_id INT,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,          
    metodo_pago VARCHAR(50),            
    estado VARCHAR(20) DEFAULT 'Confirmada',
    monto_total DECIMAL(10,2),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (cancha_id) REFERENCES cancha(id)
);

-- ==========================================
-- DATOS DE EJEMPLO
-- ==========================================

-- Usuario
INSERT INTO usuario (nombre, email, password) VALUES 
('Juan Pérez', 'juan.perez@email.com', '123456');

-- Canchas
INSERT INTO cancha (nombre, deporte, sede, precio_hora, dimensiones, tipo_piso, imagen_url) VALUES 
('Cancha de Fútbol 7', 'Fútbol', 'Sede San Borja', 40.00, '30m x 20m', 'Césped Sintético', 'cancha_futbol7'),
('Cancha de Fulbito', 'Fútbol', 'Sede Miraflores', 40.00, '20m x 15m', 'Parquet', 'cancha_fulbito'),
('Cancha de Tenis 1', 'Tenis', 'Complejo Deportivo Central', 40.00, '20m x 10m', 'Césped Sintético', 'cancha_tenis'),
('Cancha de Vóley', 'Vóley', 'Sede Surco', 30.00, '18m x 9m', 'Losa Deportiva', 'cancha_voley');

-- Una reserva de ejemplo
INSERT INTO reserva (usuario_id, cancha_id, fecha, hora, metodo_pago, monto_total) VALUES
(1, 4, '2025-12-08', '18:00 - 19:00', 'Yape', 30.00);