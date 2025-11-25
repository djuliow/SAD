import sqlite3

def fix_employee_table():
    try:
        conn = sqlite3.connect('backend/database/sqlite.db')
        cursor = conn.cursor()
        
        # Check if columns exist
        cursor.execute("PRAGMA table_info(employee)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'username' not in columns:
            print("Adding username column to employee table...")
            cursor.execute("ALTER TABLE employee ADD COLUMN username TEXT")
        
        if 'password' not in columns:
            print("Adding password column to employee table...")
            cursor.execute("ALTER TABLE employee ADD COLUMN password TEXT")
            
        conn.commit()
        print("Columns added successfully.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_employee_table()
