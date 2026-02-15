import { IconOption } from '../types';

export const AVAILABLE_ICONS: IconOption[] = [
  // Alerts & Warnings
  { name: 'alert', label: 'Alert', category: 'Alerts' },
  { name: 'alert-circle', label: 'Alert Circle', category: 'Alerts' },
  { name: 'alert-octagon', label: 'Alert Octagon', category: 'Alerts' },
  { name: 'alert-rhombus', label: 'Alert Diamond', category: 'Alerts' },
  { name: 'car-brake-alert', label: 'Brake Alert', category: 'Alerts' },
  { name: 'map-marker-alert', label: 'Location Alert', category: 'Alerts' },
  { name: 'bell-alert', label: 'Bell Alert', category: 'Alerts' },
  { name: 'hazard-lights', label: 'Hazard', category: 'Alerts' },

  // Navigation & Movement
  { name: 'speedometer', label: 'Speedometer', category: 'Movement' },
  { name: 'speedometer-slow', label: 'Slow Down', category: 'Movement' },
  { name: 'speedometer-medium', label: 'Medium Speed', category: 'Movement' },
  { name: 'navigation', label: 'Navigate', category: 'Movement' },
  { name: 'compass', label: 'Compass', category: 'Movement' },
  { name: 'map-marker', label: 'Location', category: 'Movement' },
  { name: 'map-marker-check', label: 'Destination', category: 'Movement' },
  { name: 'arrow-up-bold', label: 'Go Ahead', category: 'Movement' },
  { name: 'arrow-left-bold', label: 'Turn Left', category: 'Movement' },
  { name: 'arrow-right-bold', label: 'Turn Right', category: 'Movement' },
  { name: 'u-turn-left', label: 'U-Turn', category: 'Movement' },
  { name: 'sign-direction', label: 'Direction', category: 'Movement' },

  // Vehicle & Fuel
  { name: 'gas-station', label: 'Gas Station', category: 'Vehicle' },
  { name: 'motorbike', label: 'Motorbike', category: 'Vehicle' },
  { name: 'bike', label: 'Bicycle', category: 'Vehicle' },
  { name: 'car', label: 'Car', category: 'Vehicle' },
  { name: 'car-brake-parking', label: 'Parking', category: 'Vehicle' },
  { name: 'engine', label: 'Engine', category: 'Vehicle' },
  { name: 'oil', label: 'Oil', category: 'Vehicle' },
  { name: 'tire', label: 'Tire', category: 'Vehicle' },
  { name: 'wrench', label: 'Repair', category: 'Vehicle' },

  // Stops & Breaks
  { name: 'coffee', label: 'Coffee', category: 'Stops' },
  { name: 'food', label: 'Food', category: 'Stops' },
  { name: 'food-fork-drink', label: 'Restaurant', category: 'Stops' },
  { name: 'bed', label: 'Rest', category: 'Stops' },
  { name: 'hospital-box', label: 'Hospital', category: 'Stops' },
  { name: 'water', label: 'Water', category: 'Stops' },
  { name: 'toilet', label: 'Restroom', category: 'Stops' },
  { name: 'store', label: 'Store', category: 'Stops' },

  // Communication
  { name: 'hand-back-left', label: 'Stop/Wait', category: 'Communication' },
  { name: 'hand-wave', label: 'Wave', category: 'Communication' },
  { name: 'thumb-up', label: 'Thumbs Up', category: 'Communication' },
  { name: 'thumb-down', label: 'Thumbs Down', category: 'Communication' },
  { name: 'check-circle', label: 'OK', category: 'Communication' },
  { name: 'close-circle', label: 'No', category: 'Communication' },
  { name: 'phone', label: 'Call', category: 'Communication' },
  { name: 'message-text', label: 'Message', category: 'Communication' },
  { name: 'bullhorn', label: 'Announce', category: 'Communication' },
  { name: 'eye', label: 'Watch Out', category: 'Communication' },

  // Weather & Environment
  { name: 'weather-rainy', label: 'Rain', category: 'Weather' },
  { name: 'weather-sunny', label: 'Sunny', category: 'Weather' },
  { name: 'weather-fog', label: 'Fog', category: 'Weather' },
  { name: 'road-variant', label: 'Road', category: 'Weather' },
  { name: 'image-filter-hdr', label: 'Mountain', category: 'Weather' },

  // Actions
  { name: 'camera', label: 'Photo Stop', category: 'Actions' },
  { name: 'map', label: 'Check Map', category: 'Actions' },
  { name: 'clock-fast', label: 'Hurry', category: 'Actions' },
  { name: 'pause-circle', label: 'Pause', category: 'Actions' },
  { name: 'play-circle', label: 'Go', category: 'Actions' },
  { name: 'stop-circle', label: 'Stop', category: 'Actions' },
  { name: 'home', label: 'Head Home', category: 'Actions' },
  { name: 'flag-checkered', label: 'Finish', category: 'Actions' },
  { name: 'star', label: 'Important', category: 'Actions' },
  { name: 'heart', label: 'Love It', category: 'Actions' },
];

export const ICON_CATEGORIES = [
  'Alerts',
  'Movement',
  'Vehicle',
  'Stops',
  'Communication',
  'Weather',
  'Actions',
];
