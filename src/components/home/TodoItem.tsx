// src/components/TodoItem.tsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import type { PriorityLevel, TodoItemData, TodoStatus } from '../../services/home/learningService';

interface TodoItemProps {
  item: TodoItemData;
}

// Helper to determine Chip color based on status
const getStatusChipProps = (status: TodoStatus): { color: 'success' | 'warning' | 'error' | 'info' | 'default', label: string } => {
  switch (status) {
    case 'Hoàn thành':
      return { color: 'success', label: status };
    case 'Quá hạn':
      return { color: 'default', label: status }; // Default greyish chip for 'Quá hạn'
    case 'Đang làm':
      return { color: 'error', label: status }; // Use 'error' (red) to match 'Đang làm' in image
    default:
      return { color: 'default', label: status };
  }
};

// Helper for Priority color (optional, can use sx prop directly too)
const getPriorityColor = (priority: PriorityLevel): string => {
    switch(priority) {
        case 'Cao': return '#FF6B6B'; // Reddish for High
        case 'TB': return '#FFA500';   // Orange for Medium
        case 'Thấp': return '#4CAF50'; // Green for Low (adjust if needed)
        default: return 'inherit';
    }
}

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  const chipProps = getStatusChipProps(item.status);

  return (
    <Box sx={{ mb: 2.5 }}> {/* Add margin bottom for spacing */}
      {/* Top Row: Title and Status Chip */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          {item.title}
        </Typography>
        <Chip
          label={chipProps.label}
          color={chipProps.color}
          size="small"
          sx={{
            borderRadius: '6px', // Slightly less rounded
            fontWeight: 'medium',
            backgroundColor: chipProps.color === 'success' ? '#E0F2E9' // Custom background colors matching image
                        : chipProps.color === 'default' ? '#EEEEEE'
                        : chipProps.color === 'error' ? '#FFEBEE'
                        : undefined, // Let MUI handle other colors if needed
            color: chipProps.color === 'success' ? '#4CAF50' // Custom text colors matching image
                        : chipProps.color === 'default' ? '#757575'
                        : chipProps.color === 'error' ? '#D32F2F'
                        : undefined,
          }}
        />
      </Box>

      {/* Bottom Row: Subject, Date, Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}> {/* Use gap for spacing */}
        <Typography variant="body2" color="text.secondary">
          {item.subject}
        </Typography>
        <Typography variant="body2" color="#FF6B6B" sx={{fontWeight: 'medium'}}> {/* Reddish Date */}
          | {item.dueDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
           | MĐ Ưu tiên: <Box component="span" sx={{ color: getPriorityColor(item.priority), fontWeight: 'medium' }}>{item.priority}</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default TodoItem;
