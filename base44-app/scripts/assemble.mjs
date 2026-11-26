import fs from "node:fs";
import path from "node:path";
const S = path.resolve(process.argv[2]), O = path.join(S, "out"), A = path.resolve(process.argv[3]);
fs.rmSync(path.join(A, "src"), { recursive: true, force: true });

const cp = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.cpSync(a, b, { recursive: true }); };
cp(path.join(O, "components"), `${A}/src/components`);
cp(path.join(O, "data"), `${A}/src/data`);
cp(path.join(S, "src/data/rolex/content.json"), `${A}/src/data/rolex/content.json`);
cp(path.join(O, "lib"), `${A}/src/lib`);
cp(path.join(S, "src/app/globals.css"), `${A}/src/styles/globals.css`);
cp(path.join(S, "src/app/rolex/rolex.css"), `${A}/src/styles/rolex.css`);
cp(path.join(S, "src/app/icon.svg"), `${A}/public/icon.svg`);

// views
const clean = (p) => p.replace(/\[([^\]]+)\]/g, "$1");
const pages = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".jsx") || e.name.endsWith(".js")) {
      const rel = path.relative(path.join(O, "app"), p);
      let src = fs.readFileSync(p, "utf8").replace(/^import "\.\.?\/[^"]*\.css";\n/gm, "");
      fs.mkdirSync(path.dirname(`${A}/src/views/${clean(rel)}`), { recursive: true });
      fs.writeFileSync(`${A}/src/views/${clean(rel)}`, src);
      if (e.name === "page.jsx") pages.push(path.dirname(rel) === "." ? "" : path.dirname(rel));
    }
  }
};
walk(path.join(O, "app"));

// routes
const hasChildPages = (dir) => pages.some((p) => p !== dir && p.startsWith(dir === "" ? "" : dir + "/"));
const layouts = ["rolex"];
const routes = [];
for (const dir of pages) {
  const segs = dir ? dir.split("/").map((s) => s.replace(/^\[(.+)\]$/, "$$$1")) : [];
  const params = dir ? dir.split("/").filter((s) => s.startsWith("[")).map((s) => s.slice(1, -1)) : [];
  let file, routePath;
  if (!dir) { file = "index.jsx"; routePath = "/"; }
  else if (hasChildPages(dir) || layouts.includes(dir)) { file = segs.join(".") + ".index.jsx"; routePath = "/" + segs.join("/") + "/"; }
  else { file = segs.join(".") + ".jsx"; routePath = "/" + segs.join("/"); }
  const view = "@/views/" + (dir ? clean(dir) + "/" : "") + "page";
  const dyn = params.length > 0;
  const code = `import { createFileRoute${dyn ? ", notFound" : ""} } from "@tanstack/react-router";
import * as mod from "${view}";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("${routePath}")({
${dyn ? `  loader: ({ params }) => {
    if (mod.generateMetadata && !Object.keys(mod.generateMetadata({ params }) || {}).length) throw notFound();
  },
` : ""}  head: (${dyn ? "{ params }" : ""}) => metaHead(mod${dyn ? ", params" : ""}),
  component: RouteComponent,
});

function RouteComponent() {
${dyn ? "  const params = Route.useParams();\n  return <mod.default params={params} />;" : "  return <mod.default />;"}
}
`;
  fs.mkdirSync(`${A}/src/routes`, { recursive: true });
  fs.writeFileSync(`${A}/src/routes/${file}`, code);
  routes.push(`${file} -> ${routePath}`);
}
// rolex layout
fs.writeFileSync(`${A}/src/routes/rolex.jsx`, `import { createFileRoute, Outlet } from "@tanstack/react-router";
import RolexLayout from "@/views/rolex/layout";

export const Route = createFileRoute("/rolex")({
  component: () => <RolexLayout><Outlet /></RolexLayout>,
});
`);
console.log(routes.join("\n"));
