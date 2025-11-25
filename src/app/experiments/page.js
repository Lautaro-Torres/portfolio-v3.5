// TEMP: Experiments feature disabled
// export { default } from "./ExperimentsIndex";

import { notFound } from "next/navigation";

export default function ExperimentsPageDisabled() {
  return notFound();
}
