import "dotenv/config";
import { resolveNoticeGraph } from "../lib/agent/resolve-notice";

async function main() {
  const result = await resolveNoticeGraph(
    "Flooding reported near Trade Fair Complex, road on route R-03 impassable."
  );
  console.log(JSON.stringify(result, null, 2));
}

main();
