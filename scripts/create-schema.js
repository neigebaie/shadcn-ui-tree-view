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
    dependencies: ["@radix-ui/react-accordion", "class-variance-authority"],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "components/tree-view.tsx",
        type: "registry:block",
        content,
      },
    ],
    tailwind: {},
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
