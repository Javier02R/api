const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Añadir un usuario
const addUser = (name, email) => {
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      return console.error('Error al añadir el usuario:', err.message);
    }
    console.log('Usuario añadido con ID:', this.lastID);
  });
};

// Eliminar un usuario por ID
const deleteUser = (id) => {
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      return console.error('Error al eliminar el usuario:', err.message);
    }
    console.log(`Usuario con ID ${id} eliminado correctamente.`);
  });
};

// Editar un usuario por ID
const editUser = (id, name, email) => {
  db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
    if (err) {
      return console.error('Error al actualizar el usuario:', err.message);
    }
    console.log(`Usuario con ID ${id} actualizado correctamente.`);
  });
};

// Ejecutar el comando según los argumentos de la terminal
const [,, command, ...args] = process.argv;

switch (command) {
  case 'add':
    addUser(args[0], args[1]);
    break;
  case 'delete':
    deleteUser(args[0]);
    break;
  case 'edit':
    editUser(args[0], args[1], args[2]);
    break;
  default:
    console.log('Comando no reconocido. Usa "add", "delete" o "edit".');
    console.log('Ejemplo de uso:');
    console.log('  node user-cli.js add "Nombre Usuario" correo@ejemplo.com');
    console.log('  node user-cli.js delete 1');
    console.log('  node user-cli.js edit 1 "Nuevo Nombre" nuevo@correo.com');
    break;
}

// Cerrar la base de datos al finalizar
db.close();
