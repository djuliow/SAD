import sqlite3

def sync_schedule_names():
    try:
        conn = sqlite3.connect('backend/database/sqlite.db')
        cursor = conn.cursor()
        
        # Get all employees
        cursor.execute("SELECT id, name FROM employee")
        employees = cursor.fetchall()
        
        updated_count = 0
        
        for emp_id, emp_name in employees:
            # Check for schedules with mismatched names
            cursor.execute("SELECT id, user_name FROM scheduleentry WHERE user_id = ?", (emp_id,))
            schedules = cursor.fetchall()
            
            for sch_id, sch_name in schedules:
                if sch_name != emp_name:
                    print(f"Updating schedule {sch_id}: '{sch_name}' -> '{emp_name}'")
                    cursor.execute("UPDATE scheduleentry SET user_name = ? WHERE id = ?", (emp_name, sch_id))
                    updated_count += 1
        
        conn.commit()
        conn.close()
        
        if updated_count > 0:
            print(f"Successfully synced {updated_count} schedules.")
        else:
            print("All schedules are already in sync.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_schedule_names()
