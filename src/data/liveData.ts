interface LiveDataInterface {
  currentNote: number | undefined;
}
export const data: LiveDataInterface = {
  currentNote: undefined
};

export function getData() {
  const { currentNote } = data;
  if (currentNote === void 0) {
    return false;
  }
  return {
    currentNote
  };
}
