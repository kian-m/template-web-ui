import {
  faMoon,
  faDumbbell,
  faUtensils,
  faHeart,
  faStar,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import type { TrackerIcon } from '../types/trackers';

export const TRACKER_ICON_MAP: Record<TrackerIcon, IconDefinition> = {
  moon: faMoon,
  dumbbell: faDumbbell,
  utensils: faUtensils,
  heart: faHeart,
  star: faStar,
};

export const trackerIcon = (icon: TrackerIcon): IconDefinition =>
  TRACKER_ICON_MAP[icon] ?? faStar;
