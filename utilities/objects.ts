export const isEmpty = (obj) => {
  /**
   * Simple helper function that returns
   * true if an object is empty.
   */
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
