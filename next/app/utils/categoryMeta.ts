// utils/categoryMeta.ts

import L from 'leaflet';

export const categoryMeta: Record<string, { group: string; iconPath: string }> = {
  'Affordable & Public Housing': { group: 'community', iconPath: '/icons/default/APH.svg' },
  'Boston Centers for Youth & Families': { group: 'community', iconPath: '/icons/default/BCYF.svg' },
  'Housing Community Organizations': { group: 'community', iconPath: '/icons/default/HCO.svg' },
  'Neighborhood Associations': { group: 'community', iconPath: '/icons/default/NA.svg' },
  'Police & Fire': { group: 'community', iconPath: '/icons/default/PF.svg' },
  'Small Business Organizations': { group: 'community', iconPath: '/icons/default/SBO.svg' },

  'Ongoing Projects': { group: 'community', iconPath: '/icons/default/SBO.svg' },

  'Child Care Organizations': { group: 'health', iconPath: '/icons/default/CCO.svg' },
  'Food Community Organizations': { group: 'health', iconPath: '/icons/default/FCO.svg' },
  Healthcare: { group: 'health', iconPath: '/icons/default/HC.svg' },
  'Pet Care': { group: 'health', iconPath: '/icons/default/PC.svg' },
  'Justice, Organizing & Basic Needs': { group: 'health', iconPath: '/icons/default/JOBN.svg' },
  'Senior Services & Communities': { group: 'health', iconPath: '/icons/default/SSC.svg' },

  'Bike Community Organizations': { group: 'environment', iconPath: '/icons/default/BCO.svg' },
  'Boston Public Libraries': { group: 'environment', iconPath: '/icons/default/BPL.svg' },
  'Climate & Environmental Organizations': { group: 'environment', iconPath: '/icons/default/CEO.svg' },
  'Parks & Green Space': { group: 'environment', iconPath: '/icons/default/PGS.svg' },

  'Arts & Culture Organizations': { group: 'education', iconPath: '/icons/default/ACO.svg' },
  'Education Community Organizations': { group: 'education', iconPath: '/icons/default/ECO.svg' },
  'Boston Public Schools': { group: 'education', iconPath: '/icons/default/BPS.svg' },
  'Youth Community Organizations': { group: 'education', iconPath: '/icons/default/YCO.svg' },
};

export const groupColors: Record<string, string> = {
  community: '#091F2F',
  health: '#FB4D42',
  environment: '#51ACFF',
  education: '#45789C',
};

export const groupNames: Record<string, string> = {
  community: 'COMMUNITY LIFE AND SERVICES',
  health: 'HEALTH AND BASIC NEEDS',
  environment: 'ENVIRONMENT AND CIVIC SPACES',
  education: 'EDUCATION AND CULTURE',
};

export const groupIcons: Record<string, string> = {
  community: '/icons/markers/community_marker.svg',
  health: '/icons/markers/health_marker.svg',
  environment: '/icons/markers/environment_marker.svg',
  education: '/icons/markers/education_marker.svg',
};

export const getIconForCategory = (category?: string): L.Icon => {
  const fallback = '/icons/markers/community_marker.svg';

  if (!category) {
    return L.icon({
      iconUrl: fallback,
      iconSize: [34, 34],
      iconAnchor: [12, 24],
      popupAnchor: [5, -24],
    });
  }

  const meta = categoryMeta[category];
  const iconUrl = meta?.group ? groupIcons[meta.group] : fallback;

  return L.icon({
    iconUrl,
    iconSize: [34, 34],
    iconAnchor: [12, 24],
    popupAnchor: [5, -24],
  });
};
