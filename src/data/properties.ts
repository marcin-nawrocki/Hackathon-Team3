export type PropertyStatus = 'live' | 'offline';

export type Property = {
  id: string;
  name: string;
  location: string;
  status: PropertyStatus;
  sleeps: number;
  bedrooms: number;
  occupancy: number;
  upcomingBookings: number;
  accent: string;
};

export const properties: Property[] = [
  {
    id: 'SC1001',
    name: 'Seaview Cottage',
    location: 'St Ives, Cornwall',
    status: 'live',
    sleeps: 6,
    bedrooms: 3,
    occupancy: 87,
    upcomingBookings: 4,
    accent: '#4A90D9',
  },
  {
    id: 'SC1002',
    name: 'The Old Barn',
    location: 'Keswick, Lake District',
    status: 'live',
    sleeps: 8,
    bedrooms: 4,
    occupancy: 72,
    upcomingBookings: 3,
    accent: '#82BF40',
  },
  {
    id: 'SC1003',
    name: 'Harbour Loft',
    location: 'Whitby, North Yorkshire',
    status: 'offline',
    sleeps: 2,
    bedrooms: 1,
    occupancy: 0,
    upcomingBookings: 0,
    accent: '#E1943B',
  },
  {
    id: 'SC1004',
    name: 'Glen View Lodge',
    location: 'Aviemore, Highlands',
    status: 'live',
    sleeps: 10,
    bedrooms: 5,
    occupancy: 94,
    upcomingBookings: 6,
    accent: '#7E6BC4',
  },
  {
    id: 'SC1005',
    name: 'Meadow Farmhouse',
    location: 'Hay-on-Wye, Powys',
    status: 'live',
    sleeps: 7,
    bedrooms: 4,
    occupancy: 61,
    upcomingBookings: 2,
    accent: '#D96A8B',
  },
  {
    id: 'SC1006',
    name: 'Pinecliff Studio',
    location: 'Bournemouth, Dorset',
    status: 'offline',
    sleeps: 3,
    bedrooms: 1,
    occupancy: 0,
    upcomingBookings: 0,
    accent: '#3FAE9E',
  },
];
