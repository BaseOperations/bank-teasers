export interface BankConfig {
  slug: string;
  name: string;
  folder: string;
  envKey: string;
}

export const banks: Record<string, BankConfig> = {
  bmo: {
    slug: "bmo",
    name: "BMO",
    folder: "BMO",
    envKey: "PASS_BMO",
  },
  "citizens-bank": {
    slug: "citizens-bank",
    name: "Citizens Bank",
    folder: "Citizens Bank",
    envKey: "PASS_CITIZENS_BANK",
  },
  "columbia-bank": {
    slug: "columbia-bank",
    name: "Columbia Bank",
    folder: "Columbia Bank",
    envKey: "PASS_COLUMBIA_BANK",
  },
  "fifth-third": {
    slug: "fifth-third",
    name: "Fifth Third Bank",
    folder: "Fifth Third Bank",
    envKey: "PASS_FIFTH_THIRD",
  },
  "first-citizens": {
    slug: "first-citizens",
    name: "First Citizens Bank & Trust",
    folder: "First Citizens Bank and Trust",
    envKey: "PASS_FIRST_CITIZENS",
  },
  chase: {
    slug: "chase",
    name: "Chase",
    folder: "JPMorgan Chase Bank",
    envKey: "PASS_CHASE",
  },
  keybank: {
    slug: "keybank",
    name: "KeyBank",
    folder: "Keybank National Association",
    envKey: "PASS_KEYBANK",
  },
  pnc: {
    slug: "pnc",
    name: "PNC Bank",
    folder: "PNC Bank",
    envKey: "PASS_PNC",
  },
  pinnacle: {
    slug: "pinnacle",
    name: "Pinnacle Bank",
    folder: "Pinnacle Bank",
    envKey: "PASS_PINNACLE",
  },
  regions: {
    slug: "regions",
    name: "Regions Bank",
    folder: "Regions Bank",
    envKey: "PASS_REGIONS",
  },
  "td-bank": {
    slug: "td-bank",
    name: "TD Bank",
    folder: "TD Bank",
    envKey: "PASS_TD_BANK",
  },
  truist: {
    slug: "truist",
    name: "Truist",
    folder: "Truist Bank",
    envKey: "PASS_TRUIST",
  },
  "us-bank": {
    slug: "us-bank",
    name: "U.S. Bank",
    folder: "US Bank",
    envKey: "PASS_US_BANK",
  },
  "wells-fargo": {
    slug: "wells-fargo",
    name: "Wells Fargo",
    folder: "Wells Fargo",
    envKey: "PASS_WELLS_FARGO",
  },
  woodforest: {
    slug: "woodforest",
    name: "Woodforest National Bank",
    folder: "Woodforest National Bank",
    envKey: "PASS_WOODFOREST",
  },
};

export function getBankBySlug(slug: string): BankConfig | undefined {
  return banks[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(banks);
}
