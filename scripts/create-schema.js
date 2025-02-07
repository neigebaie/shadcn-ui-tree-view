import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const content = await fs.promises.readFile(
    path.join(__dirname, "../components/tree-view.tsx"),
    "utf8"
  );

  const schema = {
    name: "tree-view",
    type: "registry:block",
    dependencies: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-hover-card",
      "class-variance-authority",
      "framer-motion",
      "lucide-react"
    ],
    devDependencies: [],
    registryDependencies: [
      "button",
      "badge",
      "input",
      "context-menu",
      "collapsible",
      "hover-card"
    ],
    files: [
      {
        path: "components/tree-view.tsx",
        type: "registry:block",
        content,
      },
    ],
    tailwind: {
      cssVariables: true,
      animations: true,
    },
    cssVars: {},
    meta: {
      importSpecifier: "TreeView",
      moduleSpecifier: "@/components/tree-view",
    },
  };

  await fs.promises.writeFile(
    path.join(__dirname, "../schema.json"),
    JSON.stringify(schema, null, 2)
  );

  console.log("schema created!");
} catch (err) {
  console.error(err);
}
