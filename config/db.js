require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const dbPath = process.env.DATABASE_FILE
    || path.join(__dirname, '../traveltales.db');

const db = new sqlite3.Database(dbPath, err => {
    if (err) console.error('DB connect error:', err.message);
    else     console.log('SQLite connected at', dbPath);
});

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      email       TEXT    NOT NULL UNIQUE,
      username    TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id   INTEGER NOT NULL,
      title       TEXT    NOT NULL,
      content     TEXT    NOT NULL,
      country     TEXT    NOT NULL,
      visit_date  DATE    NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(author_id) REFERENCES users(id)
    )
  `);
});

// Promise-based wrappers
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else     resolve(this);     // `this.lastID`, `this.changes`
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else     resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else     resolve(rows);
        });
    });
}

module.exports = {
    db,
    run,
    get,
    all
};