// copy paste of MIT licensed lib fast-levenshtein in order to reduce deps, and remove global injection

let collator;
try {
  collator =
    typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined"
      ? Intl.Collator("generic", { sensitivity: "base" })
      : null;
} catch (err) {
  console.log("Collator could not be initialized and wouldn't be used");
}
// arrays to re-use
let prevRow = [],
  str2Char = [];

/**
 * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
 */
export const Levenshtein = {
  /**
   * Calculate levenshtein distance of the two strings.
   *
   * @param str1 String the first string.
   * @param str2 String the second string.
   * @param [options] Additional options.
   * @param [options.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
   * @return Integer the levenshtein distance (0 and above).
   */
  get: function (str1, str2, options?: { useCollator: boolean }) {
    const useCollator = options && collator && options.useCollator;

    const str1Len = str1.length,
      str2Len = str2.length;

    // base cases
    if (str1Len === 0) return str2Len;
    if (str2Len === 0) return str1Len;

    // two rows
    let curCol, nextCol, i, j, tmp;

    // initialise previous row
    for (i = 0; i < str2Len; ++i) {
      prevRow[i] = i;
      str2Char[i] = str2.charCodeAt(i);
    }
    prevRow[str2Len] = str2Len;

    let strCmp;
    if (useCollator) {
      // calculate current row distance from previous row using collator
      for (i = 0; i < str1Len; ++i) {
        nextCol = i + 1;

        for (j = 0; j < str2Len; ++j) {
          curCol = nextCol;

          // substution
          strCmp =
            0 ===
            collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));

          nextCol = prevRow[j] + (strCmp ? 0 : 1);

          // insertion
          tmp = curCol + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }
          // deletion
          tmp = prevRow[j + 1] + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }

          // copy current col value into previous (in preparation for next iteration)
          prevRow[j] = curCol;
        }

        // copy last col value into previous (in preparation for next iteration)
        prevRow[j] = nextCol;
      }
    } else {
      // calculate current row distance from previous row without collator
      for (i = 0; i < str1Len; ++i) {
        nextCol = i + 1;

        for (j = 0; j < str2Len; ++j) {
          curCol = nextCol;

          // substution
          strCmp = str1.charCodeAt(i) === str2Char[j];

          nextCol = prevRow[j] + (strCmp ? 0 : 1);

          // insertion
          tmp = curCol + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }
          // deletion
          tmp = prevRow[j + 1] + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }

          // copy current col value into previous (in preparation for next iteration)
          prevRow[j] = curCol;
        }

        // copy last col value into previous (in preparation for next iteration)
        prevRow[j] = nextCol;
      }
    }
    return nextCol;
  },
};
