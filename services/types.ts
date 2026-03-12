export interface PhotoCardProps {
  item: any;
  onPress: (photo: any) => void;
  onEdit?: (photo: any) => void;
  onDelete?: (photo: any) => void;
}

export interface EditPhotoModalProps {
  visible: boolean;
  photo: any;
  onClose: () => void;
  onSave: () => void;
}

export interface CustomCalendarProps {
  markedDates: Record<string, any>;
  onDayPress: (day: any) => void;
}
