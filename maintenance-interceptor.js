const WHITELIST_IPS = process.env.WHITELIST_IPS ? process.env.WHITELIST_IPS.split(',') : null;
const WHITELIST_PATH = process.env.WHITELIST_PATH ? new RegExp(process.env.WHITELIST_PATH) : null;

const MAINTENANCE_PAGE = buildMaintenancePage();

/**
 * Builds the HTML content for the maintenance page.
 *
 * @return {string} - HTML content for the maintenance page.
 */
function buildMaintenancePage() {
  // Maintenance page HTML content...
  return `
  <!DOCTYPE html>
  ...
  </html>
  `;
}

/**
 * Checks if the request is coming from a whitelisted IP
 *
 * @param {string} ip - The IP address.
 * @return {boolean} - Returns true if the IP is whitelisted, otherwise false.
 */
function isWhitelistedIp(ip) {
  return WHITELIST_IPS && WHITELIST_IPS.includes(ip);
}

/**
 * Checks if the request path matches a whitelisted path
 *
 * @param {string} requestPath - The request path.
 * @return {boolean} - Returns true if the path is whitelisted, otherwise false.
 */
function isWhitelistedPath(requestPath) {
  return WHITELIST_PATH && WHITELIST_PATH.test(requestPath);
}

/**
 * Handles all incoming requests and checks if the request is coming from an IP
 * that is in the whitelist or if the request path matches a whitelisted path. If the request
 * is not whitelisted, it returns a maintenance page.
 *
 * @param {Request} request - The incoming request.
 * @return {Promise<Response>} - Returns the appropriate response based on the whitelist check.
 */
async function handleRequest(request) {
  const { cf } = request;
  const requestPath = new URL(request.url).pathname;

  if (isWhitelistedIp(cf?.ip) || isWhitelistedPath(requestPath)) {
    return fetch(request);
  }

  const htmlResponse = new Response(MAINTENANCE_PAGE, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "cache-control": "no-store",
    },
    status: 503,
    statusText: "Service Unavailable",
  });

  return htmlResponse;
}
