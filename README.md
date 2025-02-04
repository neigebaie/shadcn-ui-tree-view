# Interactive Tree View Demo

Custom shadcn/ui tree view component with selection, folder management, and visual feedback.

![screenshot](./screenshot.png)


## Installation

```bash
npx shadcn add "https://github.com/neigebaie/shadcn-ui-tree-view/releases/download/v1.0.0/schema.json"
```

## Usage

### TreeViewItem
```tsx
interface TreeViewItem {
  id: string;
  name: string;
  type: string;
  children?: TreeViewItem[];
}
```

### TreeViewProps
```tsx
interface TreeViewProps {
  data: TreeViewItem[];
  title?: string;
  showExpandAll?: boolean;
  showSelectionDetails?: boolean;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  onSelectionChange?: (selectedItems: TreeViewItem[]) => void;
  onAction?: (action: string, item: TreeViewItem) => void;
}
```
## Example

```tsx
import { TreeView, TreeViewItem } from "@/components/ui/tree-view";

const test_data: TreeViewItem[] = [
  {
    id: "1",
    name: "Folder 1",
    type: "folder",
    children: [
      {
        id: "1.1", 
        name: "File 1.1", 
        type: "file"
      },
      {
        id: "1.2", 
        name: "File 1.2", 
        type: "file"
      },
    ],
  },
  {
    id: "2",
    name: "Folder 2",
    type: "folder",
    children: [],
  },
];

export default function Test() {
  return <TreeView data={test_data} />;
}
```

## Features

- [X] Selection capabilities (single click, range, multi-select, drag select)
- [X] Folder management system with expand/collapse and item counting for collapsed folders
- [X] Visual feedback system with animations and level-specific icons
- [X] Context menu with file/folder specific actions

## License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.