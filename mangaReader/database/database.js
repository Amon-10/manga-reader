import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('mangaReader.db');

export const initDB = () => {
    db.transaction (tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS library (
                mangaId TEXT PRIMARY KEY NOT NULL,
                title TEXT,
                coverURL TEXT,
                lastReadChapter TEXT DEFAULT 0
            );`
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mangaId TEXT NOT NULL,
                chapterId TEXT,
                lastReadPage INTEGER
            );`
        );
    });
};

export default db;