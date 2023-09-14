export type Option = {
  value: string;
  label: string;
  type: string;
};
export type MultiSelectProps = {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
};
export type ToggleProps = {
  initial?: boolean;
  onToggle?: (state: boolean) => void;
};
