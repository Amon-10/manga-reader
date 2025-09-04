import {SQLiteProvider} from 'expo-sqlite';
import MyApp from './MyApp';

export default function App(){
    return(
        <SQLiteProvider 
            databaseName='Library.db'
            onInit={async (db) => {
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS library (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        mangaId INT UNIQUE,
                        cover TEXT NOT NULL,
                        title TEXT NOT NULL,
                        slug TEXT NOT NULL
                    )
                `);   
            }}
        >
            < MyApp />
        </SQLiteProvider>
    )
}

