import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { useState, useEffect } from "react";

// Create time slots from 07:00 to 22:00 with 30-minute intervals
const createTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  // Add final 22:00 slot
  slots.push('22:00');
  return slots;
};

const timeSlots = createTimeSlots();

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export function AdvancedScheduleTable({ schedules = [] }) {
  const [tableData, setTableData] = useState({});

  useEffect(() => {
    if (!schedules || !Array.isArray(schedules)) return;

    // Process schedules to map to time slots
    const processedData = {};
    
    // Initialize the table data structure
    daysOfWeek.forEach(day => {
      processedData[day] = {};
      timeSlots.forEach((time, index) => {
        processedData[day][time] = null;
      });
    });

    // Process each schedule item and mark the corresponding time slots
    schedules.forEach(schedule => {
      const { time: timeRange, day, user_name: doctorName } = schedule;
      
      // Parse the time range (e.g., "09:00-17:00")
      const [start, end] = timeRange.split('-');
      if (!start || !end) return;
      
      const startHour = parseInt(start.split(':')[0]);
      const startMinute = parseInt(start.split(':')[1]);
      const endHour = parseInt(end.split(':')[0]);
      const endMinute = parseInt(end.split(':')[1]);
      
      // Find which time slots this schedule occupies
      for (let i = 0; i < timeSlots.length - 1; i++) {
        const currentSlot = timeSlots[i];
        const nextSlot = timeSlots[i + 1];
        
        const [currHour, currMin] = currentSlot.split(':').map(Number);
        const [nextHour, nextMin] = nextSlot.split(':').map(Number);
        
        // Check if the schedule time range overlaps with this time slot
        const slotStart = currHour * 60 + currMin;
        const slotEnd = nextHour * 60 + nextMin;
        const scheduleStart = startHour * 60 + startMinute;
        const scheduleEnd = endHour * 60 + endMinute;
        
        if (scheduleStart < slotEnd && scheduleEnd > slotStart) {
          // This schedule overlaps with this time slot
          processedData[day][timeSlots[i]] = {
            doctor: doctorName,
            activity: schedule.activity || 'Praktek',
            isStart: slotStart >= scheduleStart && slotStart < slotEnd, // Marks the start position
            isEnd: slotEnd <= scheduleEnd && slotEnd > slotStart // Marks the end position
          };
        }
      }
    });

    setTableData(processedData);
  }, [schedules]);

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-beige">
            <TableHead className="text-navy font-bold uppercase text-xs tracking-wider border border-navy/20 p-2 w-32 sticky left-0 z-0 bg-beige">
              Waktu
            </TableHead>
            {daysOfWeek.map(day => (
              <TableHead
                key={day}
                className="text-navy font-bold uppercase text-xs tracking-wider border border-navy/20 p-2 text-center"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.slice(0, -1).map((time, index) => { // Exclude the last slot since it's just for ending
            const nextTime = timeSlots[index + 1];
            return (
              <TableRow key={time} className="hover:bg-sky-blue/20">
                <TableCell className="text-navy font-medium text-xs border border-navy/20 p-2 whitespace-nowrap sticky left-0 z-0 bg-white">
                  {time} - {nextTime}
                </TableCell>
                {daysOfWeek.map(day => {
                  const slotData = tableData[day]?.[time];
                  const nextSlotData = tableData[day]?.[nextTime];
                  
                  // Check if this is the start of a schedule
                  const isScheduleStart = slotData?.isStart;
                  const isScheduleContinuing = slotData && !isScheduleStart;
                  const isScheduleEnding = slotData?.isEnd && nextSlotData === null;
                  
                  let cellClass = "border border-navy/20 p-2 align-top ";

                  if (slotData) {
                    // For schedule start cells
                    if (isScheduleStart) {
                      cellClass += "bg-teal/30 border-2 border-teal font-medium text-navy align-top";
                    }
                    // For continuing schedule cells
                    else if (isScheduleContinuing) {
                      cellClass += "bg-teal/10 border-l border-teal/30 border-r border-teal/30 border-t border-transparent border-b border-transparent text-navy/70 align-top";
                    }
                    // For ending cells
                    else {
                      cellClass += "bg-teal/10 border-l border-teal/30 border-r-2 border-teal border-t border-transparent border-b-2 border-teal text-navy/70 align-top";
                    }
                  } else {
                    cellClass += "bg-white text-navy/40 align-top";
                  }
                  
                  return (
                    <TableCell key={`${day}-${time}`} className={cellClass}>
                      {slotData && isScheduleStart && (
                        <div className="text-xs">
                          <div className="font-semibold">{slotData.doctor}</div>
                          <div className="text-xs opacity-80">{slotData.activity}</div>
                        </div>
                      )}
                      {slotData && isScheduleContinuing && (
                        <div className="w-full text-center text-xs opacity-60">•</div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}