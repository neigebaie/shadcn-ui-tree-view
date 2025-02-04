"use client";

import TreeView, { TreeViewItem } from "@/components/tree-view";
import { test_data } from "@/lib/demo_data";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedItems, setSelectedItems] = useState<TreeViewItem[]>([]);

  return (
    <div className="min-h-screen flex flex-col items-center">
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
          <TreeView
            data={test_data}
            title="Machine Tree View"
            onSelectionChange={setSelectedItems}
            onAction={(action, item) => console.log(`${action} on:`, item)}
          />

        <div className="flex-1 bg-background p-6 rounded-xl border">
          <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
          <div className="border rounded-lg p-4 bg-card font-mono text-sm h-[calc(100%-4rem)]">
            {selectedItems.length > 0 ? (
              <pre className="whitespace-pre-wrap break-all overflow-auto max-h-full">
                {JSON.stringify(selectedItems, null, 2)}
              </pre>
            ) : (
              <div className="text-muted-foreground">No items selected</div>
            )}
          </div>
        </div>
      </main>
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
