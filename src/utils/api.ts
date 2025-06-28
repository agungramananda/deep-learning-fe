const API_BASE_URL = "http://kid-dev.australiaeast.cloudapp.azure.com";

export async function detectEdges(file: File): Promise<[number, number][]> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/detect-edges`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to detect edges.");
  }

  const data = await response.json();
  return data.points;
}

export async function processReceipt(
  imageB64: string,
  points: [number, number][]
) {
  const payload = {
    image_b64: imageB64,
    points: points,
  };

  const response = await fetch(`${API_BASE_URL}/process-receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to process receipt.");
  }

  return data;
}
