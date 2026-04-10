import { CareUnit, CertificateDto, PaginatedCertificatesDto, MessageDto, SendMessageToCareDto } from "./dataFormat";

export async function getCareUnits(signal: AbortSignal): Promise<CareUnit[]> {
  const response = await fetch("http://localhost:8081/v1/unit", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function getCertificates(hsaID: string, page: number, pageSize: number, signal: AbortSignal): Promise<PaginatedCertificatesDto> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const response = await fetch(`http://localhost:8081/v1/unit/${hsaID}/certificates?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function getMessages(certificateId: string, signal: AbortSignal): Promise<MessageDto[]> {
  const response = await fetch(`http://localhost:8081/v1/certificate/${certificateId}/messages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function getCertificateFields(certificateType: string, certificateVersion: string, signal: AbortSignal): Promise<MessageDto[]> {
  const response = await fetch(`http://localhost:8081/v1/certificate/${certificateType}/v${certificateVersion}/fields`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function sendMessageToCare(payload: SendMessageToCareDto, signal?: AbortSignal): Promise<void> {
  const response = await fetch(`http://localhost:8081/v1/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function sendMessageToCareXml(payload: SendMessageToCareDto, signal?: AbortSignal): Promise<Blob> {
  const response = await fetch(`http://localhost:8081/v1/message/xml`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/xml",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.blob();
}