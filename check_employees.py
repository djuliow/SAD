import sqlite3

def check_employees():
    try:
        conn = sqlite3.connect('backend/database/sqlite.db')
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM employee")
        employees = cursor.fetchall()
        
        # Get column names
        names = [description[0] for description in cursor.description]
        print(f"Columns: {names}")
        
        if not employees:
            print("No employees found.")
        else:
            print(f"Found {len(employees)} employees:")
            for emp in employees:
                print(emp)
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_employees()
