import { CareUnit } from "./dataFormat";

export async function getCareUnits(signal: AbortSignal): Promise<CareUnit[]> {
  const response = await fetch("http://localhost:8081/v1/unit", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}