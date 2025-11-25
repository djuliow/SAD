import sqlite3

def check_doctors():
    try:
        conn = sqlite3.connect('backend/database/sqlite.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM employee WHERE role='dokter'")
        doctors = cursor.fetchall()
        
        if not doctors:
            print("No doctors found.")
            # Create a dummy doctor
            print("Creating dummy doctor...")
            cursor.execute("INSERT INTO employee (name, role, username, password) VALUES ('Dr. Adriel', 'dokter', 'adriel', 'password')")
            conn.commit()
            print("Dummy doctor created.")
        else:
            print(f"Found {len(doctors)} doctors:")
            for doc in doctors:
                print(doc)
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_doctors()
