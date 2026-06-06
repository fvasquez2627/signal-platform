const JSON_HEADERS = { "Content-Type": "application/json" };

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status, headers: JSON_HEADERS });
}

export function jsonError(message: string, status = 500, extra: Record<string, unknown> = {}) {
  return jsonResponse({ error: message, ...extra }, status);
}
