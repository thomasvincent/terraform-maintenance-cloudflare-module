async function handleRequest(request: Request): Promise<Response> {
  const response = new Response(`Request method: ${request.method}`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  return response;
}
