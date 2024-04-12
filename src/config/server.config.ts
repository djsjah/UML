interface ServerSite {
  url: string | null;
  site: string | null;
}

export const serverSiteObj: ServerSite = {
  url: null,
  site: null,
}

export function setServerSite(port: string | number) {
  process.env.DEV_URL += `:${port}`;

  if (process.env.NODE_ENV === 'Local') {
    process.env.CUR_URL = process.env.DEV_URL;
    serverSiteObj.url = process.env.DEV_URL;
  } else {
    process.env.CUR_URL = process.env.PROD_URL;
    serverSiteObj.url = process.env.PROD_URL;
  }

  serverSiteObj.site = process.env.NODE_ENV;
}
