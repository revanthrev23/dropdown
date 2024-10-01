export interface IDropdownProps {
  url: string;
  onSelect: (option: string | null) => void;
  internalSearch?: boolean;
}
