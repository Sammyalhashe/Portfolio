
const postMap = {};

function importAll(r) {
    r.keys().forEach((key) => {
        // key is like './exps/ms.md' or './projects/atp.md'
        // Remove the leading ./ and the extension .md
        const slug = key.replace(/^\.\/|\.md$/g, '');
        postMap[slug] = r(key);
    });
}

// Load markdown files recursively from content directory
importAll(require.context('../content', true, /\.md$/));

export default postMap;
