import { NOTE_ARRAY } from "../constants";
interface LiveDataInterface {
  record: number[];
  recording: boolean;
}
export const data: LiveDataInterface = {
  record: [],
  recording: false
};
