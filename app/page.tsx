"use client";

import TreeView, { TreeViewItem, TreeViewMenuItem } from "@/components/tree-view";
import { test_data } from "@/lib/demo_data";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Globe, Store, FolderOpen, Apple, Send, Folder, File, Share2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [treeData, setTreeData] = useState<TreeViewItem[]>(test_data);
  const [showRecap, setShowRecap] = useState(false);

  const customIconMap = {
    region: <Globe className="h-4 w-4 text-purple-500" />,
    store: <Folder className="h-4 w-4 text-blue-500" />,
    department: <FolderOpen className="h-4 w-4 text-green-500" />,
    item: <File className="h-4 w-4 text-orange-500" />,
  };

  const getCheckedItems = useCallback(
    (items: TreeViewItem[]): TreeViewItem[] => {
      let checkedItems: TreeViewItem[] = [];

      items.forEach((item) => {
        if (item.checked) {
          // If this item is checked, add only it and skip its children
          checkedItems.push(item);
        } else if (item.children) {
          // If this item is not checked, check its children
          checkedItems = [...checkedItems, ...getCheckedItems(item.children)];
        }
      });

      return checkedItems;
    },
    []
  );

  const handleCheckChange = (
    items: TreeViewItem | TreeViewItem[],
    checked: boolean
  ) => {
    const itemsArray = Array.isArray(items) ? items : [items];

    const updateCheckState = (treeItems: TreeViewItem[]): TreeViewItem[] => {
      return treeItems.map((currentItem) => {
        if (itemsArray.some((item) => item.id === currentItem.id)) {
          if (currentItem.children) {
            return {
              ...currentItem,
              checked,
              children: updateAllChildren(currentItem.children, checked),
            };
          }
          return { ...currentItem, checked };
        }
        if (currentItem.children) {
          return {
            ...currentItem,
            children: updateCheckState(currentItem.children),
          };
        }
        return currentItem;
      });
    };

    const updateAllChildren = (
      children: TreeViewItem[],
      checked: boolean
    ): TreeViewItem[] => {
      return children.map((child) => ({
        ...child,
        checked,
        children: child.children
          ? updateAllChildren(child.children, checked)
          : undefined,
      }));
    };

    setTreeData((prevData) => updateCheckState(prevData));
  };

  const handleAction = (action: string, items: TreeViewItem[]) => {
    if (action === "add_to_shipment" && items.length > 0) {
      handleCheckChange(items, true);
    }
  };

  const checkedItems = getCheckedItems(treeData);

  const menuItems: TreeViewMenuItem[] = [
    {
      id: "add_to_shipment",
      label: "Add to Shipment",
      icon: <Share2 className="h-4 w-4" />,
      action: (items) => handleCheckChange(items, true),
    },
    {
      id: "download",
      label: "Download",
      icon: <Download className="h-4 w-4" />,
      action: (items) => console.log("Downloading:", items),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 text-red-500" />,
      action: (items) => console.log("Deleting:", items),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-orange-300">
      <div className="w-full max-w-[1400px] flex items-center justify-center p-8 gap-2">
        <Image
          src="/android-chrome-192x192.png"
          alt="Tree View - Demo"
          width={36}
          height={36}
        />
        <h1 className="text-2xl font-bold">Tree View - Demo</h1>
      </div>
      <main className="w-full max-w-[1400px] px-8 flex flex-row gap-4 min-h-[600px]">
        <div className="flex flex-col gap-4 max-w-[450px]">
          <TreeView
            data={treeData}
            className="max-h-[450px] overflow-y-auto"
            title="Retail Store Hierarchy"
            iconMap={customIconMap}
            showCheckboxes={true}
            showExpandAll={false}
            onCheckChange={handleCheckChange}
            onAction={handleAction}
            menuItems={menuItems}
          />

          {checkedItems.length > 0 && (
            <Button
              className="w-full flex gap-2 items-center"
              onClick={() => setShowRecap(true)}
            >
              <Send className="h-4 w-4" />
              Send {checkedItems.length} Items
            </Button>
          )}
        </div>

        <div className="flex-1 bg-background p-6 rounded-xl border max-h-[555px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Checked Items</h2>
          <div className="border rounded-lg p-4 bg-card font-mono text-sm h-[calc(100%-4rem)]">
            {checkedItems.length > 0 ? (
              <pre className="whitespace-pre-wrap break-all overflow-auto max-h-full">
                {JSON.stringify(
                  checkedItems.map((item) => ({
                    ...item,
                    children: undefined,
                  })),
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="text-muted-foreground">No items checked</div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showRecap} onOpenChange={setShowRecap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sending {checkedItems.length} Items</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] mt-4">
            <div className="space-y-4">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 border rounded-md"
                >
                  {customIconMap[item.type]}
                  <span>{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowRecap(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Here you would handle the actual sending
                console.log("Sending items:", checkedItems);
                setShowRecap(false);
              }}
            >
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="w-full max-w-[1400px] flex items-center justify-center p-8">
        <a
          href="https://github.com/neigebaie/shadcn-ui-tree-view"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-sm text-muted-foreground">
            Tree View - Demo by neigebaie.
          </p>
        </a>
      </footer>
    </div>
  );
}
