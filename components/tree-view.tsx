"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Folder,
  ChevronRight,
  ChevronDown,
  Server,
  Database,
  Home,
  Waves,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash, FolderOpen, FileEdit, Share2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { test_data } from "@/lib/demo_data";

export interface TreeViewItem {
  id: string;
  name: string;
  type: string;
  children?: TreeViewItem[];
}

export interface TreeViewProps {
  data: TreeViewItem[];
  title?: string;
  showExpandAll?: boolean;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  onSelectionChange?: (selectedItems: TreeViewItem[]) => void;
  onAction?: (action: string, item: TreeViewItem) => void;
}

interface TreeItemProps {
  item: TreeViewItem;
  depth?: number;
  selectedIds: Set<string>;
  lastSelectedId: React.MutableRefObject<string | null>;
  onSelect: (ids: Set<string>) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string, isOpen: boolean) => void;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  onAction?: (action: string, item: TreeViewItem) => void;
}

function TreeItem({
  item,
  depth = 0,
  selectedIds,
  lastSelectedId,
  onSelect,
  expandedIds,
  onToggleExpand,
  getIcon,
  onAction,
}: TreeItemProps) {
  const isOpen = expandedIds.has(item.id);
  const isSelected = selectedIds.has(item.id);
  const itemRef = useRef<HTMLDivElement>(null);
  const [selectionStyle, setSelectionStyle] = useState("");

  // Get all visible items in order
  const getVisibleItems = useCallback(
    (items: TreeViewItem[]): TreeViewItem[] => {
      let visibleItems: TreeViewItem[] = [];

      items.forEach((item) => {
        visibleItems.push(item);
        if (
          item.type === "folder" &&
          expandedIds.has(item.id) &&
          item.children
        ) {
          visibleItems = [...visibleItems, ...getVisibleItems(item.children)];
        }
      });

      return visibleItems;
    },
    [expandedIds]
  );

  useEffect(() => {
    if (!isSelected) {
      setSelectionStyle("");
      return;
    }

    const visibleItems = getVisibleItems(test_data);
    const currentIndex = visibleItems.findIndex((i) => i.id === item.id);

    const prevItem = visibleItems[currentIndex - 1];
    const nextItem = visibleItems[currentIndex + 1];

    const isPrevSelected = prevItem && selectedIds.has(prevItem.id);
    const isNextSelected = nextItem && selectedIds.has(nextItem.id);

    const roundTop = !isPrevSelected;
    const roundBottom = !isNextSelected;

    setSelectionStyle(
      `${roundTop ? "rounded-t-md" : ""} ${roundBottom ? "rounded-b-md" : ""}`
    );
  }, [isSelected, selectedIds, expandedIds, item.id, getVisibleItems]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let newSelection = new Set(selectedIds);

    if (!itemRef.current) return;

    if (e.shiftKey && lastSelectedId.current !== null) {
      const items = Array.from(
        document.querySelectorAll("[data-tree-item]")
      ) as HTMLElement[];
      const lastIndex = items.findIndex(
        (el) => el.getAttribute("data-id") === lastSelectedId.current
      );
      const currentIndex = items.findIndex((el) => el === itemRef.current);
      const [start, end] = [
        Math.min(lastIndex, currentIndex),
        Math.max(lastIndex, currentIndex),
      ];

      items.slice(start, end + 1).forEach((el) => {
        const id = el.getAttribute("data-id");
        const parentFolderClosed = el.closest('[data-folder-closed="true"]');
        const isClosedFolder = el.getAttribute("data-folder-closed") === "true";

        if (id && (isClosedFolder || !parentFolderClosed)) {
          newSelection.add(id);
        }
      });
    } else if (e.ctrlKey || e.metaKey) {
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id);
      } else {
        newSelection.add(item.id);
      }
    } else {
      newSelection = new Set([item.id]);
      // Open folder on single click if it's a folder
      if (item.type === "folder" && isSelected) {
        onToggleExpand(item.id, !isOpen);
      }
    }

    lastSelectedId.current = item.id;
    onSelect(newSelection);
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, item);
    } else {
      console.log(`${action} on:`, item.name);
    }
  };

  const renderIcon = () => {
    if (getIcon) {
      return getIcon(item, depth);
    }

    // Default icon logic
    if (item.type === "file") {
      return item.id.startsWith("wm") ? (
        <Waves className="h-4 w-4 text-blue-600" />
      ) : (
        <Wind className="h-4 w-4 text-orange-600" />
      );
    }

    switch (depth) {
      case 0:
        return <Server className="h-4 w-4 text-purple-600" />;
      case 1:
        return <Database className="h-4 w-4 text-green-600" />;
      case 2:
        return <Home className="h-4 w-4 text-yellow-600" />;
      default:
        return <Folder className="h-4 w-4 text-primary/80" />;
    }
  };

  const getItemPath = (item: TreeViewItem, items: TreeViewItem[]): string => {
    const path: string[] = [item.name];

    const findParent = (
      currentItem: TreeViewItem,
      allItems: TreeViewItem[]
    ) => {
      for (const potentialParent of allItems) {
        if (
          potentialParent.children?.some((child) => child.id === currentItem.id)
        ) {
          path.unshift(potentialParent.name);
          findParent(potentialParent, allItems);
          break;
        }
        if (potentialParent.children) {
          findParent(currentItem, potentialParent.children);
        }
      }
    };

    findParent(item, items);
    return path.join(" → ");
  };

  // Add function to count selected items in a folder
  const getSelectedChildrenCount = (item: TreeViewItem): number => {
    let count = 0;

    if (!item.children) return 0;

    item.children.forEach((child) => {
      if (selectedIds.has(child.id)) {
        count++;
      }
      if (child.type === "folder") {
        count += getSelectedChildrenCount(child);
      }
    });

    return count;
  };

  // Get selected count only if folder is collapsed and has selected children
  const selectedCount =
    (item.type === "folder" && !isOpen && getSelectedChildrenCount(item)) ||
    null;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>
          <div
            ref={itemRef}
            data-tree-item
            data-id={item.id}
            data-depth={depth}
            data-folder-closed={item.type === "folder" && !isOpen}
            className={`select-none cursor-pointer ${
              isSelected ? `bg-blue-100 ${selectionStyle}` : "text-foreground"
            } px-1`}
            style={{ paddingLeft: `${depth * 20}px` }}
            onClick={handleClick}
          >
            <div className="flex items-center h-8">
              {item.type === "folder" ? (
                <div className="flex items-center gap-2 flex-1 group">
                  <Collapsible
                    open={isOpen}
                    onOpenChange={(open) => onToggleExpand(item.id, open)}
                  >
                    <CollapsibleTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <motion.div
                          initial={false}
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                  {renderIcon()}
                  <span className="flex-1">{item.name}</span>
                  {selectedCount !== null && selectedCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="mr-2 bg-blue-100 hover:bg-blue-100"
                    >
                      {selectedCount} selected
                    </Badge>
                  )}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 group-hover:opacity-100 opacity-0 items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {item.type}
                          </div>
                          <div>
                            <span className="font-medium">ID:</span> {item.id}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>{" "}
                            {getItemPath(item, test_data)}
                          </div>
                          <div>
                            <span className="font-medium">Items:</span>{" "}
                            {item.children?.length || 0} direct items
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 pl-8 group">
                  {renderIcon()}
                  <span className="flex-1">{item.name}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 group-hover:opacity-100 opacity-0 items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {item.id.startsWith("wm")
                              ? "Washing Machine"
                              : "Dryer"}
                          </div>
                          <div>
                            <span className="font-medium">ID:</span> {item.id}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>{" "}
                            {getItemPath(item, test_data)}
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              )}
            </div>
          </div>

          {item.type === "folder" && (
            <Collapsible
              open={isOpen}
              onOpenChange={(open) => onToggleExpand(item.id, open)}
            >
              <AnimatePresence initial={false}>
                {isOpen && (
                  <CollapsibleContent forceMount asChild>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.05 }}
                    >
                      {item.children?.map((child) => (
                        <TreeItem
                          key={child.id}
                          item={child}
                          depth={depth + 1}
                          selectedIds={selectedIds}
                          lastSelectedId={lastSelectedId}
                          onSelect={onSelect}
                          expandedIds={expandedIds}
                          onToggleExpand={onToggleExpand}
                          getIcon={getIcon}
                          onAction={onAction}
                        />
                      ))}
                    </motion.div>
                  </CollapsibleContent>
                )}
              </AnimatePresence>
            </Collapsible>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {item.type === "folder" ? (
          <>
            <ContextMenuItem onClick={() => handleAction("open")}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Open
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction("share")}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("copy")}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAction("delete")}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        ) : (
          <>
            <ContextMenuItem onClick={() => handleAction("open")}>
              <FileEdit className="mr-2 h-4 w-4" />
              Open
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction("share")}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("copy")}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAction("delete")}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function TreeView({
  data,
  title = "Tree View",
  showExpandAll = true,
  getIcon,
  onSelectionChange,
  onAction,
}: TreeViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const lastSelectedId = useRef<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const DRAG_THRESHOLD = 10; // pixels
  const [currentMousePos, setCurrentMousePos] = useState<number>(0);

  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInside =
        (treeRef.current && treeRef.current.contains(target)) ||
        (dragRef.current && dragRef.current.contains(target));

      if (!clickedInside) {
        setSelectedIds(new Set());
        lastSelectedId.current = null;
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  // Calculate selected items count
  const getSelectionCounts = () => {
    const counts = { files: 0, folders: 0 };

    const countItem = (item: TreeViewItem) => {
      if (selectedIds.has(item.id)) {
        if (item.type === "folder") {
          counts.folders++;
        } else {
          counts.files++;
        }
      }

      if (item.children) {
        item.children.forEach(countItem);
      }
    };

    data.forEach(countItem);
    return counts;
  };

  const { files, folders } = getSelectionCounts();

  // Function to collect all folder IDs
  const getAllFolderIds = (items: TreeViewItem[]): string[] => {
    let ids: string[] = [];
    items.forEach((item) => {
      if (item.type === "folder") {
        ids.push(item.id);
        if (item.children) {
          ids = [...ids, ...getAllFolderIds(item.children)];
        }
      }
    });
    return ids;
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(getAllFolderIds(data)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleToggleExpand = (id: string, isOpen: boolean) => {
    const newExpandedIds = new Set(expandedIds);
    if (isOpen) {
      newExpandedIds.add(id);
    } else {
      newExpandedIds.delete(id);
    }
    setExpandedIds(newExpandedIds);
  };

  const getSelectedItems = useCallback((): TreeViewItem[] => {
    const selectedItems: TreeViewItem[] = [];

    const findSelectedItems = (items: TreeViewItem[]) => {
      items.forEach((item) => {
        if (selectedIds.has(item.id)) {
          // Create a new object without children
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, ...itemWithoutChildren } = item;
          selectedItems.push(itemWithoutChildren);
        }
        if (item.children) {
          findSelectedItems(item.children);
        }
      });
    };

    findSelectedItems(data);
    return selectedItems;
  }, [data, selectedIds]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only track on left click and not on buttons
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;

    setDragStartPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Check if primary button is still held down
      if (!(e.buttons & 1)) {
        setIsDragging(false);
        setDragStart(null);
        setDragStartPosition(null);
        return;
      }

      // If we haven't registered a potential drag start position, ignore
      if (!dragStartPosition) return;

      // Calculate distance moved
      const deltaX = e.clientX - dragStartPosition.x;
      const deltaY = e.clientY - dragStartPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If we haven't started dragging yet, check if we should start
      if (!isDragging) {
        if (distance > DRAG_THRESHOLD) {
          setIsDragging(true);
          setDragStart(dragStartPosition.y);

          // Clear selection if not holding shift/ctrl
          if (!e.shiftKey && !e.ctrlKey) {
            setSelectedIds(new Set());
            lastSelectedId.current = null;
          }
        }
        return;
      }

      // Rest of the existing drag logic
      if (!dragRef.current) return;

      const items = Array.from(
        dragRef.current.querySelectorAll("[data-tree-item]")
      ) as HTMLElement[];

      const startY = dragStart;
      const currentY = e.clientY;
      const [selectionStart, selectionEnd] = [
        Math.min(startY || 0, currentY),
        Math.max(startY || 0, currentY),
      ];

      const newSelection = new Set(
        e.shiftKey || e.ctrlKey ? Array.from(selectedIds) : []
      );

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemTop = rect.top;
        const itemBottom = rect.top + rect.height;

        if (itemBottom >= selectionStart && itemTop <= selectionEnd) {
          const id = item.getAttribute("data-id");
          const isClosedFolder =
            item.getAttribute("data-folder-closed") === "true";
          const parentFolderClosed = item.closest(
            '[data-folder-closed="true"]'
          );

          if (id && (isClosedFolder || !parentFolderClosed)) {
            newSelection.add(id);
          }
        }
      });

      setSelectedIds(newSelection);
      setCurrentMousePos(e.clientY);
    },
    [isDragging, dragStart, selectedIds, dragStartPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setDragStartPosition(null);
  }, []);

  // Add cleanup for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  // Call onSelectionChange when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(getSelectedItems());
    }
  }, [selectedIds, onSelectionChange, getSelectedItems]);

  return (
    <div className="flex gap-4">
      <div
        ref={treeRef}
        className="bg-background p-6 rounded-xl border max-w-2xl space-y-4 w-[600px]"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            {showExpandAll && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={handleExpandAll}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={handleCollapseAll}
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Collapse All
                </Button>
              </div>
            )}
          </div>
          {(files > 0 || folders > 0) && (
            <div className="text-sm text-muted-foreground space-x-2">
              {folders > 0 && (
                <span>
                  {folders} folder{folders !== 1 ? "s" : ""}
                </span>
              )}
              {files > 0 && folders > 0 && <span>·</span>}
              {files > 0 && (
                <span>
                  {files} file{files !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          ref={dragRef}
          className="border rounded-lg p-4 bg-card relative select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {isDragging && (
            <div
              className="absolute inset-0 bg-blue-500/0 pointer-events-none"
              style={{
                top: Math.min(
                  dragStart || 0,
                  dragStart === null ? 0 : currentMousePos
                ),
                height: Math.abs(
                  (dragStart || 0) - (dragStart === null ? 0 : currentMousePos)
                ),
              }}
            />
          )}
          {data.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              selectedIds={selectedIds}
              lastSelectedId={lastSelectedId}
              onSelect={setSelectedIds}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
              getIcon={getIcon}
              onAction={onAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
