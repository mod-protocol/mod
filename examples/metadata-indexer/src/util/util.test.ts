import { shuffle } from "./util";

describe("util", () => {
  test("shuffle", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffle(array);
    expect(shuffled).not.toEqual(array);
    expect(shuffled.sort()).toEqual(array);
  });
});
