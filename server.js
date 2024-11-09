const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa cors

const app = express();

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configurar el middleware para parsear el body de las solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Crear una base de datos SQLite3
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión con SQLite3 establecida');
    // Crear una tabla si no existe
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
      );
    `);
  }
});

// Ruta para manejar la solicitud POST del formulario
app.post('/api/form', (req, res) => {
  const { name, email } = req.body;

  // Insertar los datos en la base de datos
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  stmt.run(name, email, function (err) {
    if (err) {
      return res.status(500).send('Error al guardar los datos');
    }
    res.status(200).send('Datos guardados correctamente');
  });
});

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error al obtener los datos');
      }
      res.status(200).json(rows);
    });
  });
  
  // Ruta para eliminar un usuario por ID
  app.delete('/api/user/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, (err) => {
      if (err) {
        return res.status(500).send('Error al eliminar el usuario');
      }
      res.status(200).send('Usuario eliminado correctamente');
    });
  });
  
  // Ruta para actualizar un usuario por ID
  app.put('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
      if (err) {
        return res.status(500).send('Error al actualizar el usuario');
      }
      res.status(200).send('Usuario actualizado correctamente');
    });
  });

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error al obtener los datos');
      }
      res.status(200).json(rows);
    });
  });

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
