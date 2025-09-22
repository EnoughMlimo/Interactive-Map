
export interface Official {
  name: string;
  title?: string;
  contact?: string;
}

export interface CountryData {
  name: string;
  officials: Official[];
  region: string;
}
