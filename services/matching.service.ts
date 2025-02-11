import { FoundItem } from '../models/FoundItem';
import { LostItem } from '../models/LostItem';

export const matchItems = async () => {
  const lostItems = await LostItem.find();
  const foundItems = await FoundItem.find();

  return lostItems.map(lost => ({
    lostItem: lost,
    matches: foundItems.filter(found => 
      found.description.toLowerCase().includes(lost.description.toLowerCase()) &&
      found.location === lost.location
    )
  }));
};