import {SQLiteProvider} from 'expo-sqlite';
import MyApp from './MyApp';

export default function App(){
    return(
        <SQLiteProvider 
            databaseName='Library.db'
            onInit={async (db) => {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS library (
                        mangaId TEXT UNIQUE PRIMARY KEY,
                        cover TEXT NOT NULL,
                        title TEXT NOT NULL,
                        desc TEXT
                    )
                `);   
                await db.execAsync(`
                    
                    CREATE TABLE IF NOT EXISTS chapters (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        chapterId TEXT NOT NULL,
                        mangaId TEXT NOT NULL,
                        createdAt TEXT,
                        chapterNumber TEXT,
                        FOREIGN KEY (mangaId) REFERENCES library(mangaId) ON DELETE CASCADE
                    )
                `)
            }}
        >
            < MyApp />
        </SQLiteProvider>
    )
}

