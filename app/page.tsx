import TreeView from "@/components/tree-view";
import { test_data } from "@/lib/demo_data";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-top flex-col items-center">
      <div className="w-full max-w-[1024px] flex items-center justify-center p-8 gap-2">
        <Image
          src="/android-chrome-192x192.png"
          alt="Tree View - Demo"
          width={36}
          height={36}
        />
        <h1 className="text-2xl font-bold">Tree View - Demo</h1>
      </div>
      <main className="w-full max-w-[1024px]">
        <TreeView 
          data={test_data}
          title="Machine Tree View"
          onSelectionChange={(items) => console.log('Selected:', items)}
          onAction={(action, item) => console.log(`${action} on:`, item)}
        />
      </main>
      <footer className="w-full max-w-[1024px] flex items-center justify-center p-8">
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
