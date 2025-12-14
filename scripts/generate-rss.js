const fs = require('fs');
const path = require('path');
const RSS = require('rss');

// We need a way to load posts for the script.
// Since 'post_loader.js' uses webpack 'require.context', we can't use it directly in a node script.
// We must manually traverse the content directory.

function getPosts() {
    const postsDir = path.join(__dirname, '../content/posts');
    const posts = [];

    if (!fs.existsSync(postsDir)) return posts;

    const files = fs.readdirSync(postsDir);

    files.forEach((file) => {
        if (!file.endsWith('.md')) return;
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (fmMatch) {
            const fm = fmMatch[1];
            // Improved regex to handle quoted and unquoted strings
            // Matches key: "value" OR key: value
            const titleMatch = fm.match(/title:\s*(?:"(.*)"|'(.*)'|(.*))/);
            const dateMatch = fm.match(/date:\s*(?:"(.*)"|'(.*)'|(.*))/);

            // Extract the first non-undefined group
            const title = titleMatch
                ? (titleMatch[1] || titleMatch[2] || titleMatch[3]).trim()
                : file;
            const date = dateMatch
                ? (dateMatch[1] || dateMatch[2] || dateMatch[3]).trim()
                : new Date();

            posts.push({
                title,
                date,
                description: 'A post from Notes from the Terminal',
                url: `https://salh.xyz/?post=posts/${file.replace('.md', '')}`,
                guid: file,
                author: 'Sammy Al Hashemi'
            });
        }
    });

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateRSS() {
    const feed = new RSS({
        title: 'Notes from the Terminal',
        description: 'Sammy\'s Tech Blog',
        feed_url: 'https://salh.xyz/rss.xml',
        site_url: 'https://salh.xyz',
        image_url: 'https://salh.xyz/collision_pic.jpg', // Placeholder
        managingEditor: 'sammy@salh.xyz (Sammy Al Hashemi)',
        webMaster: 'sammy@salh.xyz (Sammy Al Hashemi)',
        copyright: `Copyright ${new Date().getFullYear()} Sammy Al Hashemi`,
        language: 'en',
    });

    const posts = getPosts();
    posts.forEach((post) => {
        feed.item(post);
    });

    const xml = feed.xml({ indent: true });
    fs.writeFileSync(path.join(__dirname, '../public/rss.xml'), xml);
    // eslint-disable-next-line no-console
    console.log('RSS Feed generated at public/rss.xml');
}

generateRSS();
