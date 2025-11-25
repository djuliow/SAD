import sqlite3

def cleanup_orphaned_schedules():
    try:
        conn = sqlite3.connect('backend/database/sqlite.db')
        cursor = conn.cursor()
        
        # Find orphaned schedules
        cursor.execute("""
            SELECT id, user_name, user_id FROM scheduleentry 
            WHERE user_id NOT IN (SELECT id FROM employee)
        """)
        orphans = cursor.fetchall()
        
        if not orphans:
            print("No orphaned schedules found.")
        else:
            print(f"Found {len(orphans)} orphaned schedules:")
            for orphan in orphans:
                print(f"Deleting schedule ID {orphan[0]} for {orphan[1]} (User ID {orphan[2]})")
            
            # Delete them
            cursor.execute("""
                DELETE FROM scheduleentry 
                WHERE user_id NOT IN (SELECT id FROM employee)
            """)
            conn.commit()
            print("Orphaned schedules deleted successfully.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    cleanup_orphaned_schedules()
