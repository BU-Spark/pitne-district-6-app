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

export interface Location {
  id: number;
  documentId: string;
  name: string;
  place_type: 'BCYF Centers' | 'Boston Public Libraries' | 'Parks and Green Space' | 'Others';
  description?: string;
  lat?: number;
  lng?: number;
  geohash?: string;
  phone?: number;
  website?: string;
  hours_of_operation?: string;
  is_active: boolean;
  email?: string;
  resource: boolean;
  category?:
    | 'Affordable & Public Housing'
    | 'Boston Centers for Youth & Families'
    | 'Housing Community Organizations'
    | 'Neighborhood Associations'
    | 'Police & Fire'
    | 'Small Business Organizations'
    | 'Child Care Organizations'
    | 'Food Community Organizations'
    | 'Healthcare'
    | 'Pet Care'
    | 'Justice, Organizing & Basic Needs'
    | 'Senior Services & Communities'
    | 'Bike Community Organizations'
    | 'Boston Public Libraries'
    | 'Climate & Environmental Organizations'
    | 'Parks & Green Space'
    | 'Arts & Culture Organizations'
    | 'Education Community Organizations'
    | 'Boston Public Schools'
    | 'Youth Community Organizations';
  word_embeddings?: string;
  address?: unknown; // GeoJSON custom field
  resources?: unknown[]; // Resource relation
  events?: unknown[]; // Event relation
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Flyer {
  id: number;
  Title: string;
  Image?: StrapiMedia;
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
    const response = await fetch(`${STRAPI_BASE_URL}/api/councils?populate=Image`);

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

/**
 * Fetch all locations that are marked as resources
 */
export async function fetchLocations(): Promise<Location[]> {
  try {
    let allLocations: Location[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(
        `${STRAPI_BASE_URL}/api/locations?populate=*&filters[is_active][$eq]=true&filters[resource][$eq]=true&pagination[page]=${page}&pagination[pageSize]=100`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const result: StrapiResponse<Location[]> = await response.json();
      allLocations = [...allLocations, ...result.data];

      // Check if there are more pages
      if (result.meta.pagination) {
        hasMorePages = page < result.meta.pagination.pageCount;
        page++;
      } else {
        hasMorePages = false;
      }
    }

    // Deduplicate results to prevent duplicates
    return deduplicateLocations(allLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

/**
 * Fetch locations by category
 */
export async function fetchLocationsByCategory(category: string): Promise<Location[]> {
  try {
    let allLocations: Location[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(
        `${STRAPI_BASE_URL}/api/locations?populate=*&filters[category][$eq]=${encodeURIComponent(category)}&filters[is_active][$eq]=true&filters[resource][$eq]=true&pagination[page]=${page}&pagination[pageSize]=100`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch locations by category: ${response.statusText}`);
      }

      const result: StrapiResponse<Location[]> = await response.json();
      allLocations = [...allLocations, ...result.data];

      // Check if there are more pages
      if (result.meta.pagination) {
        hasMorePages = page < result.meta.pagination.pageCount;
        page++;
      } else {
        hasMorePages = false;
      }
    }

    // Deduplicate results to prevent duplicates
    return deduplicateLocations(allLocations);
  } catch (error) {
    console.error('Error fetching locations by category:', error);
    return [];
  }
}

/**
 * Fetch locations by multiple categories
 */
export async function fetchLocationsByCategories(categories: string[]): Promise<Location[]> {
  try {
    // If only one category, use the simpler single category endpoint
    if (categories.length === 1) {
      return await fetchLocationsByCategory(categories[0]);
    }

    let allLocations: Location[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      // For multiple categories, try building the filter differently
      // Strapi expects: filters[category][$in][0]=Category1&filters[category][$in][1]=Category2
      const filterParams = categories
        .map((cat, index) => `filters[category][$in][${index}]=${encodeURIComponent(cat)}`)
        .join('&');

      const url = `${STRAPI_BASE_URL}/api/locations?populate=*&${filterParams}&filters[is_active][$eq]=true&filters[resource][$eq]=true&pagination[page]=${page}&pagination[pageSize]=100`;

      console.log('API URL for category filtering (new format):', url);
      console.log('Categories being filtered:', categories);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch locations by categories: ${response.statusText}`);
      }

      const result: StrapiResponse<Location[]> = await response.json();
      allLocations = [...allLocations, ...result.data];

      console.log(`Page ${page} API response for filtered categories:`, {
        pageResults: result.data.length,
        totalSoFar: allLocations.length,
        categories: result.data.map((location) => ({ name: location.name, category: location.category })),
      });

      // Check if there are more pages
      if (result.meta.pagination) {
        hasMorePages = page < result.meta.pagination.pageCount;
        page++;
      } else {
        hasMorePages = false;
      }
    }

    // Deduplicate results to prevent duplicates
    return deduplicateLocations(allLocations);
  } catch (error) {
    console.error('Error fetching locations by categories:', error);
    return [];
  }
}

/**
 * Search locations by name
 */
export async function searchLocations(query: string): Promise<Location[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/locations/search?query=${encodeURIComponent(query.trim())}`);

    if (!response.ok) {
      throw new Error(`Failed to search locations: ${response.statusText}`);
    }

    const result: { data: Location[] } = await response.json();

    // Deduplicate results based on documentId and name to prevent duplicates
    const deduplicatedResults = deduplicateLocations(result.data);

    return deduplicatedResults;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Deduplicate locations based on documentId or name + location combination
 */
function deduplicateLocations(locations: Location[]): Location[] {
  const seen = new Set<string>();
  const deduplicated: Location[] = [];

  for (const location of locations) {
    // Create a unique key based on documentId (preferred) or name + coordinates
    const key = location.documentId || `${location.name}-${location.lat || 'no-lat'}-${location.lng || 'no-lng'}`;

    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(location);
    }
  }

  return deduplicated;
}

/**
 * Fetch all flyers with image and title
 */
export async function fetchFlyers(): Promise<Flyer[]> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/flyers?populate=Image`);

    if (!response.ok) {
      throw new Error(`Failed to fetch flyers: ${response.statusText}`);
    }

    const result: StrapiResponse<Flyer[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching flyers:', error);
    return [];
  }
}
