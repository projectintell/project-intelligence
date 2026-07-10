import { ConfidentialClientApplication } from '@azure/msal-node';

// Server-to-server Dataverse Web API client using the app registration
// documented in dataverse-schema-reference.md
// ("PI-Rebuild-Dataverse-S2S", System Customizer role). Client-credentials
// flow — no user sign-in. Only use this from server-side code (API routes,
// Server Actions) — never expose DATAVERSE_CLIENT_SECRET to the browser.

const DATAVERSE_URL = process.env.DATAVERSE_URL!; // e.g. https://orgb33c59e1.crm11.dynamics.com
const TENANT_ID = process.env.DATAVERSE_TENANT_ID!;
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID!;
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET!;

let msalClient: ConfidentialClientApplication | null = null;

function getMsalClient() {
  if (!msalClient) {
    msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: CLIENT_ID,
        authority: `https://login.microsoftonline.com/${TENANT_ID}`,
        clientSecret: CLIENT_SECRET,
      },
    });
  }
  return msalClient;
}

async function getAccessToken(): Promise<string> {
  const result = await getMsalClient().acquireTokenByClientCredential({
    scopes: [`${DATAVERSE_URL}/.default`],
  });
  if (!result?.accessToken) {
    throw new Error('Failed to acquire Dataverse access token');
  }
  return result.accessToken;
}

async function dataverseFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${DATAVERSE_URL}/api/data/v9.2/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      ...init.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dataverse request failed (${res.status}): ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const dataverse = {
  /** GET a collection, e.g. list('cr3ed_casesdevs', "$filter=..."). */
  list: (entitySet: string, query = '') =>
    dataverseFetch(`${entitySet}${query ? `?${query}` : ''}`),

  /** GET a single record by id. */
  retrieve: (entitySet: string, id: string, query = '') =>
    dataverseFetch(`${entitySet}(${id})${query ? `?${query}` : ''}`),

  /** POST a new record. Returns the created record's id (from OData-EntityId header). */
  create: async <T extends object>(entitySet: string, data: T) => {
    const token = await getAccessToken();
    const res = await fetch(`${DATAVERSE_URL}/api/data/v9.2/${entitySet}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Dataverse create failed (${res.status}): ${text}`);
    }
    const entityId = res.headers.get('OData-EntityId');
    return entityId?.match(/\(([^)]+)\)/)?.[1] ?? null;
  },

  /** PATCH (partial update) an existing record. */
  update: <T extends object>(entitySet: string, id: string, data: T) =>
    dataverseFetch(`${entitySet}(${id})`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
