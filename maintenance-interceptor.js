// Set up a whitelist of IP addresses and a whitelist of paths that are allowed to bypass the maintenance page.
const whitelistIps = process.env.WHITELIST_IPS ? process.env.WHITELIST_IPS.split(',') : null;
const whitelistPath = process.env.WHITELIST_PATH ? new RegExp(process.env.WHITELIST_PATH) : null;

// Set up the maintenance page HTML content.
const maintenancePage = `
<!DOCTYPE html>
<html>
  <head>
    <title>Site Maintenance</title>
    <link href="https://fonts.googleapis.com/css2?family=${google_font}&display=swap" rel="stylesheet"/>
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <link rel="icon" href="${favicon_url}"/>
    <style>
      body {
        text-align: center;
        font-family: "${font}", sans-serif;
        color: #0C1231;
      }

      .logo {
        margin-top: 3rem;
        max-height: 35px;
        width: auto;
      }

      .content {
        margin: 0 auto;
        max-width: 1000px;
        width: 90%;
      }

      .info {
        margin: 0 auto;
        margin-top: 3rem;
        max-width: 500px;
      }

      h1 {
        font-weight: 600;
        font-size: 1.8rem;
      }

      .image-main {
        margin-top: 3rem;
        max-width: 90%;
      }

      hr {
        border: 1px solid rgba(0, 0, 0, 0.08);
        margin: 0 auto;
        margin-top: 2rem;
        margin-bottom: 1rem;
        max-width: 90%;
      }

      a {
        text-decoration: none;
        color: #535353
      }

      a:hover {
        color: #0C1231;
      }

      @media (min-width: 968px) {
        .logo {
          max-height: 45px;
        }

        h1 {
          font-size: 2.5rem;
        }

        .info {
          margin-top: 6rem;
        }

        hr {
          margin-top: 6rem;
          margin-bottom: 3rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="content">
      <img class="logo" src="${logo_url}" alt="${company_name}">
      <div class="info">
        <h1>Our site is currently undergoing maintenance. We apologize for the inconvenience and will be back online soon.</h1>
      </div>
      <img class="image-main" src="${maintenance_image_url}" alt="Maintenance">
      <hr>
      <div class="info">
        <p>In the meantime, you can contact us at <a href="mailto:${support_email}">${support_email}</a> for any urgent matters.</p>
      </div>
    </div>
  </body>
</html>
`;

/**
 * This function intercepts all incoming requests and checks if the request is coming from an IP
 * that is in the whitelist or if the request path matches a whitelisted path. If the request
 * is not whitelisted, it returns a maintenance page.
 * 
 * @param {Request} request - The incoming request.
 * @return {Response} - Returns the appropriate response based on the whitelist check.
 */
async function handleRequest(request) {
  const { headers, cf } = request;
  const userAgent = headers.get("user-agent");
  const requestPath = new URL(request.url).pathname;

  // check if the request is coming from a whitelisted IP
  if (whitelistIps && whitelistIps.includes(cf?.ip)) {
    return fetch(request);
  }

  // check if the request path matches a whitelisted path
  if (whitelistPath && whitelistPath.test(requestPath)) {
    return fetch(request);
  }

  // if the request is not whitelisted, return the maintenance page
  const htmlResponse = new Response(maintenancePage, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "cache-control": "no-store",
    },
    status: 503,
    statusText: "Service Unavailable",
  });
  return htmlResponse;
}

