const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomNumber(0, arr.length - 1)];
}

const getMilisecondsFromSeconds = (seconds: number): number => seconds * 1000;

const probability = (chance: number): boolean => getRandomNumber(0, 100) <= chance;

const waitFor = (timeout: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

function reduceAsync<T, R>(
  arr: T[],
  fn: (result: R, curr: T, index: number) => R,
  waitForSeconds: number,
  startValue: R | undefined = undefined,
): Promise<R> {
  return Promise.resolve(
    arr.reduce(async (prev: Promise<R>, curr: T, index: number) => {
      const result = await prev;
      await waitFor(getMilisecondsFromSeconds(waitForSeconds));
      return Promise.resolve(fn(result, curr, index));
    }, Promise.resolve(startValue)),
  );
}

export {
  getRandomItem,
  getMilisecondsFromSeconds,
  probability,
  waitFor,
  reduceAsync,
  getRandomNumber,
};
