import {SQLiteProvider} from 'expo-sqlite';

export default function Database(){
    return(
        <SQLiteProvider 
            databaseName='Library.db'
            onInit={async (db) => {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS library (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        mangaId TEXT UNIQUE,
                        cover TEXT,
                        title TEXT,
                        slug TEXT
                    )
                `);   
            }}
        >
            < MyApp />
        </SQLiteProvider>
    )
}

