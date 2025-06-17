export interface LearningData {
  subject: string;
  goal: string;
  progress: string;
  startDate: string;
  endDate: string;
  category: string;
  description: string;
  title: string;
}

export const getLearningData = (): LearningData[] => {
  return [
    {
      subject: "Toán",
      goal: "Đạt 9 điểm",
      progress: "80",
      startDate: "1/1/25",
      endDate: "01/06/2025",
      category: "Chính",
      description: "Cần cải thiện kỹ năng giải bài tập hình học. Đặc biệt chú ý đến các bài toán liên quan đến hình tròn và tam giác.",
      title: "Cải thiện điểm yếu"
    },
    {
      subject: "Văn",
      goal: "Đạt 8 điểm",
      progress: "60",
      startDate: "1/1/25",
      endDate: "1/6/25",
      category: "Phụ",
      description: "Tập trung vào phân tích tác phẩm văn học hiện đại. Đọc thêm các bài phân tích mẫu để nâng cao kỹ năng viết luận.",
      title: "Cải thiện điểm yếu"
    },
    {
      subject: "Anh",
      goal: "Đạt 7.5 IELTS",
      progress: "50",
      startDate: "1/1/25",
      endDate: "1/6/25",
      category: "Chính",
      description: "Luyện tập kỹ năng nghe và nói hàng ngày. Tham gia các câu lạc bộ tiếng Anh để thực hành giao tiếp.",
      title: "Cải thiện điểm yếu"
    },
  ];
};

// --- Interfaces ---

export type TodoStatus = 'Hoàn thành' | 'Quá hạn' | 'Đang làm';
export type PriorityLevel = 'Cao' | 'TB' | 'Thấp'; // TB = Trung bình

export interface TodoItemData {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // Format: DD/MM/YYYY
  priority: PriorityLevel;
  status: TodoStatus;
}

export interface ScheduleItemData {
  id: string;
  title: string;
  subject: string;
  date: string; // Format: DD/MM/YYYY
  time: string; // Format: HH:mm
}

// --- Mock Data ---

export const mockTodoItems: TodoItemData[] = [
  {
    id: 'todo-1',
    title: 'Giải đề Hóa 2024',
    subject: 'Hóa',
    dueDate: '24/04/2025',
    priority: 'TB',
    status: 'Hoàn thành',
  },
  {
    id: 'todo-2',
    title: 'Đọc sách tham khảo',
    subject: 'Văn',
    dueDate: '26/04/2025',
    priority: 'Thấp',
    status: 'Quá hạn',
  },
  {
    id: 'todo-3',
    title: 'Đề cương toán HK II',
    subject: 'Toán',
    dueDate: '28/04/2025',
    priority: 'Cao',
    status: 'Đang làm',
  },
];

export const mockScheduleItems: ScheduleItemData[] = [
  {
    id: 'sch-1',
    title: 'Chữa đề cương HKII',
    subject: 'Văn',
    date: '27/04/2025',
    time: '15:00',
  },
  {
    id: 'sch-2',
    title: 'Học thêm',
    subject: 'Toán',
    date: '27/04/2025',
    time: '19:00',
  },
    {
    id: 'sch-3',
    title: 'Ôn tập Lý thuyết',
    subject: 'Lý',
    date: '29/04/2025',
    time: '09:30',
  },
];