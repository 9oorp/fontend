export interface Option {
  name?: string;
  value: string;
  label: string;
  type?: string;
}
export interface MultiSelectProps {
  name: string;
  options: Option[];
  selectedValues: string[];
  placeholder: string;
  onChange: (selected: string[]) => void;
}
export interface SingleSelectProps {
  name: string;
  options: Option[];
  selectedValue: string;
  placeholder: string;
  onChange: (selectedValue: string, name?: string) => void; // Updated function signature
}

export interface ToggleProps {
  initial?: boolean;
  onToggle?: (state: boolean) => void;
}
export interface postDetail {
  classification: string;
  contactUrl: string;
  content: string;
  curriculumName: string;
  id: number;
  memberName: string;
  recruitNum: number;
  stack: string;
  status: string;
  subject: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  message: string;
}
