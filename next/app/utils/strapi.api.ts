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
  documentId: string;
  title: string;
  image?: StrapiMedia[]; // Array of images since schema has multiple: true
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Newsletter {
  id: number;
  documentId: string;
  month_year: string;
  english_pdf?: StrapiMedia[];
  spanish_pdf?: StrapiMedia[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Poll {
  id: number;
  documentId: string;
  Question: string;
  choices: string[];
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  poll_responses?: PollResponse[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PollResponse {
  id: number;
  documentId: string;
  email: string;
  selected_choice: string;
  submitted_at: string;
  address: string;
  region?: 'Jamaica Plain' | 'West Roxbury' | 'Other';
  poll?: Poll;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface RegionalBreakdown {
  region: 'Jamaica Plain' | 'West Roxbury' | 'Other';
  votes: number;
  percentage: number;
}

export interface PollResult {
  choice: string;
  votes: number;
  percentage: number;
  regionalBreakdown: RegionalBreakdown[];
}

export interface PollResultsResponse {
  poll: {
    id: number;
    documentId: string;
    Question: string;
    choices: string[];
  };
  results: PollResult[];
  totalVotes: number;
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

export interface StrapiLink {
  title: string;
  url: string;
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
    const response = await fetch(`${STRAPI_BASE_URL}/api/flyers?populate=image&publicationState=live`);

    if (!response.ok) {
      throw new Error(`Failed to fetch flyers: ${response.statusText}`);
    }

    const result: StrapiResponse<Flyer[]> = await response.json();
    console.log('Flyers API response:', result); // Debug log
    return result.data;
  } catch (error) {
    console.error('Error fetching flyers:', error);
    return [];
  }
}

/**
 * Fetch all newsletters with PDF files
 */
export async function fetchNewsletters(): Promise<Newsletter[]> {
  try {
    const response = await fetch(
      `${STRAPI_BASE_URL}/api/newsletters?populate=*&publicationState=live&sort=createdAt:desc`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch newsletters: ${response.statusText}`);
    }

    const result: StrapiResponse<Newsletter[]> = await response.json();
    console.log('Newsletters API response:', result); // Debug log
    return result.data;
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return [];
  }
}

/**
 * Fetch the currently active poll
 */
export async function fetchActivePoll(): Promise<Poll | null> {
  try {
    const now = new Date().toISOString();
    const response = await fetch(
      `${STRAPI_BASE_URL}/api/polls?filters[is_active][$eq]=true&publicationState=live&sort=createdAt:desc&pagination[limit]=1`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch active poll: ${response.statusText}`);
    }

    const result: StrapiResponse<Poll[]> = await response.json();

    // Filter by date range on client side for now
    const activePolls = result.data.filter((poll) => {
      if (!poll.start_date || !poll.end_date) return true; // No date restrictions
      const startDate = new Date(poll.start_date);
      const endDate = new Date(poll.end_date);
      const currentDate = new Date(now);
      return currentDate >= startDate && currentDate <= endDate;
    });

    return activePolls.length > 0 ? activePolls[0] : null;
  } catch (error) {
    console.error('Error fetching active poll:', error);
    return null;
  }
}

/**
 * Submit a poll response
 */
export async function submitPollResponse(
  pollDocumentId: string,
  email: string,
  selectedChoice: string,
  address: string,
  region: 'Jamaica Plain' | 'West Roxbury' | 'Other'
): Promise<{ success: boolean; message: string }> {
  try {
    // First check if user already voted for this poll
    const existingResponse = await fetch(
      `${STRAPI_BASE_URL}/api/poll-responses?filters[email][$eq]=${encodeURIComponent(email)}&filters[poll][documentId][$eq]=${pollDocumentId}&publicationState=live`
    );

    if (existingResponse.ok) {
      const existingResult: StrapiResponse<PollResponse[]> = await existingResponse.json();
      if (existingResult.data.length > 0) {
        return {
          success: false,
          message: 'You have already voted in this poll.',
        };
      }
    }

    // Submit the poll response
    const response = await fetch(`${STRAPI_BASE_URL}/api/poll-responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email,
          selected_choice: selectedChoice,
          submitted_at: new Date().toISOString(),
          address: address,
          region: region,
          poll: {
            connect: [pollDocumentId],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to submit poll response');
    }

    return {
      success: true,
      message: 'Thank you for your vote!',
    };
  } catch (error) {
    console.error('Error submitting poll response:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit your vote. Please try again.',
    };
  }
}

/**
 * Fetch poll results for a specific poll
 */ export async function fetchPollResults(pollDocumentId: string): Promise<PollResultsResponse> {
  try {
    // Fetch the poll
    const pollResponse = await fetch(`${STRAPI_BASE_URL}/api/polls/${pollDocumentId}?publicationState=live`);
    if (!pollResponse.ok) {
      throw new Error(`Failed to fetch poll: ${pollResponse.statusText}`);
    }
    const pollResult: StrapiResponse<Poll> = await pollResponse.json();
    const poll = pollResult.data;

    if (!poll) {
      throw new Error('Poll not found');
    }

    // Fetch responses
    const responsesResponse = await fetch(
      `${STRAPI_BASE_URL}/api/poll-responses?populate=poll&publicationState=live&pagination[limit]=1000`
    );
    if (!responsesResponse.ok) {
      throw new Error(`Failed to fetch poll responses: ${responsesResponse.statusText}`);
    }
    const responsesResult: StrapiResponse<PollResponse[]> = await responsesResponse.json();

    const responses = responsesResult.data.filter((response) => {
      return response.poll && (response.poll as Poll).documentId === pollDocumentId;
    });

    // Initialize counts
    const voteCounts: Record<string, number> = {};
    const regionalVoteCounts: Record<string, Record<'Jamaica Plain' | 'West Roxbury' | 'Other', number>> = {};

    poll.choices.forEach((choice) => {
      voteCounts[choice] = 0;
      regionalVoteCounts[choice] = {
        'Jamaica Plain': 0,
        'West Roxbury': 0,
        Other: 0,
      };
    });

    // Count votes
    responses.forEach((response) => {
      if (poll.choices.includes(response.selected_choice)) {
        voteCounts[response.selected_choice]++;
        const region = response.region ?? 'Other';
        if (regionalVoteCounts[response.selected_choice][region] !== undefined) {
          regionalVoteCounts[response.selected_choice][region]++;
        } else {
          regionalVoteCounts[response.selected_choice]['Other']++;
        }
      }
    });

    const totalVotes = responses.length;

    // Build results with correct regional percentages
    const results: PollResult[] = poll.choices.map((choice) => {
      const choiceVotes = voteCounts[choice];
      const choicePercentage = totalVotes > 0 ? Math.round((choiceVotes / totalVotes) * 100) : 0;

      const regions = ['Jamaica Plain', 'West Roxbury', 'Other'] as const;

      const regionalBreakdown: RegionalBreakdown[] = regions.map((region) => {
        const regionVotes = regionalVoteCounts[choice][region];
        const regionPercentage = choiceVotes > 0 ? (regionVotes / choiceVotes) * 100 : 0;

        return {
          region,
          votes: regionVotes,
          percentage: regionPercentage,
        };
      });

      return {
        choice,
        votes: choiceVotes,
        percentage: choicePercentage,
        regionalBreakdown,
      };
    });

    return {
      poll: {
        id: poll.id,
        documentId: poll.documentId,
        Question: poll.Question,
        choices: poll.choices,
      },
      results,
      totalVotes,
    };
  } catch (error) {
    console.error('Error fetching poll results:', error);
    throw error;
  }
}

/**
 * Fetch a single link by title
 */
export async function fetchLink(title: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${STRAPI_BASE_URL}/api/links?filters[title][$eq]=${encodeURIComponent(title)}&populate=*`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch link "${title}": ${response.statusText}`);
    }

    const result: StrapiResponse<StrapiLink[]> = await response.json();

    if (result.data.length > 0 && result.data[0].title && result.data[0].url) {
      return result.data[0].url;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching link "${title}":`, error);
    return null;
  }
}
