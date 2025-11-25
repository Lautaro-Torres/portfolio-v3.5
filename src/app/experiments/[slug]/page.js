// TEMP: Experiments detail route disabled
// export { default } from "./ExperimentDetail";

import { notFound } from "next/navigation";

export default function ExperimentDetailDisabled() {
  return notFound();
}
