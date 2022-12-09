import { glob } from "glob";
import { promisify } from "util";
import { ExtendedClient } from "../classes/Client";
import { IRegisterCommands } from "../interfaces/Client";

const PG = promisify(glob);

async function loadFiles(dirName: string) {
  const Files = await PG(
    `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.ts`
  );
  Files.forEach((File) => {
    delete require.cache[require.resolve(File)];
  });
  return Files;
}

async function importFiles(filePath: string) {
  return (await import(filePath))?.default;
}

const diff = [];
diff[0] = 0;
diff[1] = 0;
for (let i = 2; i < 100; i++) {
  diff[i] = (1 / 4) * (i - 1 + 300 * Math.pow(2, (i - 1) / 7));
}
const accumulate = (
  (sum) => (value: number) =>
    (sum += value)
)(0);
const xpTable = diff.map(accumulate);

function numberWithCommas(x: number | string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { importFiles, loadFiles, xpTable, numberWithCommas };
