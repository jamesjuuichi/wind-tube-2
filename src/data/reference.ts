import { NOTE_ARRAY } from "../constants";
interface ReferenceDataInterface {
  lowNote: number | undefined;
  highNote: number | undefined;
}
export const data: ReferenceDataInterface = {
  lowNote: NOTE_ARRAY[0],
  highNote: NOTE_ARRAY[NOTE_ARRAY.length - 1]
};

export function getData() {
  const { lowNote, highNote } = data;
  if (lowNote === void 0 || highNote === void 0) {
    return false;
  }
  return {
    lowNote,
    highNote
  };
}
