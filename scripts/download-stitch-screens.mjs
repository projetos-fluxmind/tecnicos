import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { stitch } from "@google/stitch-sdk";

const projectId = "3596347832372879337";
const outputDir = path.resolve("stitch-export");

const screens = [
  {
    name: "Dashboard de Gastos Operacionais",
    slug: "dashboard-de-gastos-operacionais",
    id: "9c734b63b67d4b65a96667d99d0374ac"
  },
  {
    name: "Gastos com Alimentação",
    slug: "gastos-com-alimentacao",
    id: "e681b138bc3e4767ad4f48547068d804"
  },
  {
    name: "Gastos com Abastecimento",
    slug: "gastos-com-abastecimento",
    id: "da107f30c4b94f99b8df2882ba6ce99c"
  },
  {
    name: "Gastos com Manutenção",
    slug: "gastos-com-manutencao",
    id: "441094a632f44637ad830b90d2134b5c"
  },
  {
    name: "Gastos com Hospedagem",
    slug: "gastos-com-hospedagem",
    id: "ca8c1ec4cb1a4375abd5126a10a9dd16"
  },
  {
    name: "Recargas Flash",
    slug: "recargas-flash",
    id: "6e01d22eed254226866204d4459debca"
  },
  {
    name: "Gerenciamento de Técnicos",
    slug: "gerenciamento-de-tecnicos",
    id: "edcbe23b60814938b002144a8f54b7e0"
  },
  {
    name: "Gerenciamento de Motos",
    slug: "gerenciamento-de-motos",
    id: "6f04291335d44b96b971c0df6d932258"
  }
];

const designSystem = {
  name: "Design System",
  slug: "design-system",
  id: "asset-stub-assets-89a3563e7948450e8aa1ea4d9ee04420-1777826701911"
};

function download(url, destination) {
  const result = spawnSync("curl.exe", ["-L", url, "-o", destination], {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `curl failed for ${destination}`);
  }
}

async function main() {
  if (!process.env.STITCH_API_KEY && !process.env.STITCH_ACCESS_TOKEN) {
    throw new Error("Configure STITCH_API_KEY ou STITCH_ACCESS_TOKEN antes de executar.");
  }

  mkdirSync(outputDir, { recursive: true });

  const project = stitch.project(projectId);
  const manifest = {
    projectId,
    downloadedAt: new Date().toISOString(),
    screens: [],
    designSystem: null
  };

  for (const item of screens) {
    const screen = await project.getScreen(item.id);
    const htmlUrl = await screen.getHtml();
    const imageUrl = await screen.getImage();
    const htmlPath = path.join(outputDir, `${item.slug}.html`);
    const imagePath = path.join(outputDir, `${item.slug}.png`);

    download(htmlUrl, htmlPath);
    download(imageUrl, imagePath);

    manifest.screens.push({
      ...item,
      htmlUrl,
      imageUrl,
      htmlPath,
      imagePath
    });

    console.log(`Downloaded ${item.name}`);
  }

  try {
    const designSystems = await project.listDesignSystems();
    const match = designSystems.find((item) => item.id === designSystem.id || item.assetId === designSystem.id);
    manifest.designSystem = match
      ? { ...designSystem, data: match }
      : { ...designSystem, data: null, note: "Design system not found in project.listDesignSystems()." };
  } catch (error) {
    manifest.designSystem = {
      ...designSystem,
      data: null,
      note: error instanceof Error ? error.message : "Unable to fetch design system."
    };
  }

  writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
