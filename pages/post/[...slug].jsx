import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import postMap from '../../functions/post_loader';

export async function getStaticPaths() {
  const paths = Object.keys(postMap).map((slug) => ({
    params: { slug: slug.split('/') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/');
  const post = postMap[slug];

  // Serialize only what's needed to avoid Circular references if any,
  // though postMap usually contains modules.
  // We need attributes and the body (which might be a string or processed content)
  // With frontmatter-markdown-loader, attributes are plain objects.
  // The 'react-component' mode gives a component which we can't pass via getStaticProps easily
  // if it's not just a string.
  // Wait, frontmatter-markdown-loader output: { attributes: {...}, body: string, react: Component }
  // We cannot pass the 'react' component function through getStaticProps (JSON serialization).
  // We should pass the body string and maybe render it using a markdown renderer on this page,
  // OR rely on the fact that we can import the module in the page component if we knew the path?
  // No, we are dynamic.

  // IMPORTANT: Since we can't pass the React component from getStaticProps,
  // we might need to rely on the 'body' (html/string) and render it.
  // BUT the current app uses the 'react' export from the loader.

  // Workaround: We can't import dynamic modules in the Page component easily based on prop.
  // However, since we are doing static generation, we CAN map the slug to the specific component
  // inside the page component IF we import postMap there too?
  // postMap contains the loaded modules.

  return {
    props: {
      slug,
      attributes: post.attributes,
      // We don't strictly need to pass body/react here if we use postMap in the component,
      // but let's pass attributes for Metadata.
    },
  };
}

export default function PostPage({ slug, attributes }) {
  // We access postMap directly here to get the React component.
  // This works because postMap is bundled into the client side bundle as well.
  const Post = postMap[slug];
  const Content = Post ? Post.react : null;

  if (!Content) {
    return <div>Post not found</div>;
  }

  return (
    <div className="page-overlay" style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      <Head>
        <title>{attributes.title} | Sammy Al Hashemi</title>
        <meta name="description" content={attributes.description || `Read ${attributes.title} on Sammy Al Hashemi's terminal.`} />
        <meta property="og:title" content={attributes.title} />
        <meta property="og:description" content={attributes.description || `Read ${attributes.title} on Sammy Al Hashemi's terminal.`} />
        {attributes.image && <meta property="og:image" content={attributes.image} />}
      </Head>

      <div className="theme-switcher-container">
        {/* Theme switcher logic could go here if we want to support it on static pages */}
      </div>

      <Link href="/" legacyBehavior>
        <button className="page-close-button">X</button>
      </Link>

      <div className="page-content-wrapper">
        <h1>{attributes.title}</h1>
        <h2>{attributes.date}</h2>
        <div className="post-content">
            <Content />
        </div>

        {attributes.series && (
          <SeriesNavigation currentSlug={slug} seriesName={attributes.series} />
        )}
      </div>
    </div>
  );
}

function SeriesNavigation({ currentSlug, seriesName }) {
    const seriesPosts = Object.keys(postMap)
        .filter(s => postMap[s].attributes.series === seriesName)
        .sort((a, b) => {
            const orderA = postMap[a].attributes.seriesOrder || 999;
            const orderB = postMap[b].attributes.seriesOrder || 999;
            return orderA - orderB;
        });

    const currentIndex = seriesPosts.indexOf(currentSlug);
    const prevSlug = seriesPosts[currentIndex - 1];
    const nextSlug = seriesPosts[currentIndex + 1];

    if (!prevSlug && !nextSlug) return null;

    return (
        <div className="series-nav" style={{ marginTop: '40px', borderTop: '1px solid grey', paddingTop: '10px' }}>
            <h3 style={{ fontSize: '1.2em', marginBottom: '10px' }}>Series: {seriesName}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {prevSlug ? (
                    <Link href={`/post/${prevSlug}`} legacyBehavior>
                         <a style={{ color: 'var(--highlight-info-color)', cursor: 'pointer' }}>
                            &larr; {postMap[prevSlug].attributes.title}
                        </a>
                    </Link>
                ) : <div></div>}

                {nextSlug ? (
                     <Link href={`/post/${nextSlug}`} legacyBehavior>
                        <a style={{ color: 'var(--highlight-info-color)', cursor: 'pointer' }}>
                            {postMap[nextSlug].attributes.title} &rarr;
                        </a>
                    </Link>
                ) : <div></div>}
            </div>
        </div>
    );
}
