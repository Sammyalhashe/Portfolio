
const postMap = {};

function importAll(r) {
  r.keys().forEach((key) => {
    const slug = key.replace(/^\.\/|\.md$/g, '');
    postMap[slug] = r(key);
  });
}

importAll(require.context('../content', false, /\.md$/));

export default postMap;
