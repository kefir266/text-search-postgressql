/**
 * Return tsquery vector search 'or' operator string from a name.
 *
 * @param name
 * @returns {string|null}
 */
function getVectorsOr(name) {
  if (!name?.length) {
    return null; // Return null if name is not provided.
  }

  const words = name.match(/\w+/g);
  if (!words?.length) {
    return null;
  }

  return words.join('|');
}

module.exports = { getVectorsOr };
