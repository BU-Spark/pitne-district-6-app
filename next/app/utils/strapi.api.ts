/**
 * Strapi API utilities for fetching data from the CMS
 */

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface CouncilMember {
  id: number;
  documentId: string;
  Name: string;
  Description: string;
  Role: string;
  Image?: StrapiMedia; // Media field
  Wesbite?: string; // Note: There's a typo in Strapi schema "Wesbite" instead of "Website"
  Phone?: number;
  Position: string;
  Email?: string;
  Location?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch all council members
 */
export async function fetchCouncilMembers(): Promise<CouncilMember[]> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/councils`);

    if (!response.ok) {
      throw new Error(`Failed to fetch council members: ${response.statusText}`);
    }

    const result: StrapiResponse<CouncilMember[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching council members:', error);
    return [];
  }
}

/**
 * Fetch council members by role
 */
export async function fetchCouncilMembersByRole(role: string): Promise<CouncilMember[]> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/councils?filters[Role][$eq]=${encodeURIComponent(role)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch council members by role: ${response.statusText}`);
    }

    const result: StrapiResponse<CouncilMember[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching council members by role:', error);
    return [];
  }
}

/**
 * Fetch the first councilor (assuming there's only one with role "Councilor")
 */
export async function fetchCouncilor(): Promise<CouncilMember | null> {
  const councilors = await fetchCouncilMembersByRole('Councilor');
  return councilors.length > 0 ? councilors[0] : null;
}
