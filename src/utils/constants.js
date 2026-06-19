export const PROPERTY_TYPES = [
  'Residential Plot',
  'Farm Land',
  'Agricultural Land',
  'Investment Plot',
  'Gated Community',
  'Open Plot',
];

export const CATEGORIES = [
  { value: 'residential', label: 'Residential' },
  { value: 'farm', label: 'Farm Land' },
  { value: 'open', label: 'Open Plot' },
  { value: 'gated', label: 'Gated Community' },
  { value: 'agricultural', label: 'Agricultural' },
];

export const TYPE_TO_CATEGORY = {
  'Residential Plot': 'residential',
  'Farm Land': 'farm',
  'Agricultural Land': 'agricultural',
  'Investment Plot': 'residential',
  'Gated Community': 'gated',
  'Open Plot': 'open',
};

export const emptyProperty = {
  name: '',
  location: '',
  pricePerSqYard: '',
  totalPrice: '',
  size: '',
  type: 'Residential Plot',
  category: 'residential',
  featured: true,
  isActive: true,
};
