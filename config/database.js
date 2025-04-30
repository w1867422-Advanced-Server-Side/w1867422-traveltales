require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const dbPath = process.env.DATABASE_FILE
    || path.join(__dirname, '../traveltales.db');

const database = new sqlite3.Database(dbPath, err => {
    if (err) console.error('DB connect error:', err.message);
    else     console.log('SQLite connected at', dbPath);
});

database.serialize(() => {
    database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      email       TEXT    NOT NULL UNIQUE,
      username    TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    database.run(`
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
    database.run(`
    CREATE TABLE IF NOT EXISTS media (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id     INTEGER NOT NULL,
      url         TEXT    NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);
    database.run(`
    CREATE TABLE IF NOT EXISTS follows (
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
    database.run(`
    CREATE TABLE IF NOT EXISTS post_votes (
      user_id   INTEGER NOT NULL,
      post_id   INTEGER NOT NULL,
      is_like   BOOLEAN NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);
});

// Promise-based wrappers
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        database.run(sql, params, function(err) {
            if (err) reject(err);
            else     resolve(this);     // `this.lastID`, `this.changes`
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        database.get(sql, params, (err, row) => {
            if (err) reject(err);
            else     resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        database.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else     resolve(rows);
        });
    });
}

module.exports = {
    database,
    run,
    get,
    all
};