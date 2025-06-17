// src/data/calendarData.ts (Modified for easier date handling)
import { parse } from 'date-fns'; // To parse DD/MM/YYYY strings

export type EventCategory = 'Lịch học' | 'Kiểm tra' | 'Kỳ thi' | 'Sự kiện' | 'Khác';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date; // Use Date objects
  end?: Date;
  allDay?: boolean;
  category: EventCategory;
  description?: string;
}

// Helper to parse DD/MM/YYYY to Date
export const parseDate = (dateStr: string, timeStr?: string): Date => {
  const formatString = timeStr ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy';
  const dateStringCombined = timeStr ? `${dateStr} ${timeStr}` : dateStr;
  try {
      const parsed = parse(dateStringCombined, formatString, new Date());
      if (isNaN(parsed.getTime())) { // Check if parsing failed
          console.error("Failed to parse date:", dateStringCombined);
          // Return a placeholder or throw an error, here returning 'now'
          return new Date();
      }
      return parsed;
  } catch(e) {
      console.error("Error parsing date:", e);
      return new Date(); // Fallback
  }
};


// Helper function to get dynamic dates around current month
const getCurrentDate = () => new Date();
const getCurrentMonth = () => getCurrentDate().getMonth();
const getCurrentYear = () => getCurrentDate().getFullYear();

// Mock Data using dynamic Date objects based on current date
// Events are distributed across previous month, current month, and next month
export const mockCalendarEvents: CalendarEvent[] = [
  // Previous month events
  { 
    id: 'e1', 
    title: 'Toán', 
    start: new Date(getCurrentYear(), getCurrentMonth() - 1, 25, 11, 30), 
    end: new Date(getCurrentYear(), getCurrentMonth() - 1, 25, 13, 0), 
    category: 'Lịch học' 
  },
  { 
    id: 'e2', 
    title: 'Design Review', 
    start: new Date(getCurrentYear(), getCurrentMonth() - 1, 28), 
    allDay: true, 
    category: 'Khác' 
  },
  
  // Current month events
  { 
    id: 'e3', 
    title: 'Văn 15 phút', 
    start: new Date(getCurrentYear(), getCurrentMonth(), 5, 10, 0), 
    end: new Date(getCurrentYear(), getCurrentMonth(), 5, 11, 0), 
    category: 'Kiểm tra' 
  },
  { 
    id: 'e4', 
    title: 'Thể dục giữa kỳ', 
    start: new Date(getCurrentYear(), getCurrentMonth(), 8, 10, 0), 
    end: new Date(getCurrentYear(), getCurrentMonth(), 8, 11, 0), 
    category: 'Kỳ thi' 
  },
  { 
    id: 'e5', 
    title: 'Sinh học', 
    start: new Date(getCurrentYear(), getCurrentMonth(), 12), 
    description: 'Something', 
    category: 'Lịch học', 
    allDay: true 
  },
  { 
    id: 'e6', 
    title: 'Hóa 45 phút', 
    start: new Date(getCurrentYear(), getCurrentMonth(), 18), 
    category: 'Kiểm tra', 
    description: 'Lý - Thuyết trình', 
    allDay: true 
  },
  { 
    id: 'e7', 
    title: 'Văn', 
    start: new Date(getCurrentYear(), getCurrentMonth(), 22), 
    category: 'Lịch học', 
    allDay: true 
  },
  { 
    id: 'e8', 
    title: 'Hóa 15 phút', 
    start: new Date(getCurrentYear(), getCurrentMonth(), 25), 
    category: 'Kiểm tra', 
    allDay: true 
  },
  
  // Next month events
  { 
    id: 'e9', 
    title: 'Họp lớp', 
    start: new Date(getCurrentYear(), getCurrentMonth() + 1, 3), 
    category: 'Sự kiện', 
    allDay: true 
  },
  { 
    id: 'e10', 
    title: 'Thi nghề', 
    start: new Date(getCurrentYear(), getCurrentMonth() + 1, 8), 
    category: 'Kỳ thi', 
    allDay: true 
  },
];