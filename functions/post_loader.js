
const postMap = {};
const readingTime = require('reading-time');

function importAll(r) {
  r.keys().forEach((key) => {
    // key is like './exps/ms.md' or './projects/atp.md'
    // Remove the leading ./ and the extension .md
    const slug = key.replace(/^\.\/|\.md$/g, '');
    const postModule = r(key);

    // With mode: ['react-component', 'body'], the export should have 'body' property.
    const body = postModule.body || "";
    const stats = readingTime(body);

    // Mutate the attributes to include reading time (it's cleaner than wrapping the object)
    if (postModule.attributes) {
        postModule.attributes.readingTime = stats.text; // "X min read"
    }

    postMap[slug] = postModule;
  });
}

importAll(require.context('../content', true, /\.md$/));

export default postMap;
