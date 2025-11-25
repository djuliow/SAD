import sqlite3

def fix_database():
    try:
        conn = sqlite3.connect('backend/database/sqlite.db')
        cursor = conn.cursor()
        
        # Check if column exists
        cursor.execute("PRAGMA table_info(queueentry)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'doctor_id' not in columns:
            print("Adding doctor_id column to queueentry table...")
            cursor.execute("ALTER TABLE queueentry ADD COLUMN doctor_id INTEGER")
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column doctor_id already exists.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_database()
