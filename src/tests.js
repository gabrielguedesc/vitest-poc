const twoSum = (array, goal) => {
  const indexes = [];
  for (leti = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] + array[j] === goal) {
        indexes.push(i);
        indexes.push(j);
      }
    }
  }
  return indexes;
};
