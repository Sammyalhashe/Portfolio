import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Shell from "../Shell";
import WindowTree from "../classes/WindowTree";
import postMap from "../functions/post_loader";

function HomePage() {
  const [interps, setInterps] = useState("");
  const [renderTree, setRenderTree] = useState(new WindowTree(setInterps));
  const router = useRouter();

  useEffect(() => {
    // Detect theme on mount
    renderTree.detectTheme();

    if (router.isReady && router.query.post) {
      const slug = router.query.post;
      const Post = postMap[slug];
      if (Post) {
        const { attributes, react: Content } = Post;
        const Component = () => (
          <div>
            <h1>{attributes.title}</h1>
            <h2>{attributes.date}</h2>
            <Content />
          </div>
        );
        renderTree.setPage(<Component />);
      }
    }
  }, [router.isReady, router.query.post]);

  return (
    <div className="main">
      <Head>
        <title>My profile</title>
      </Head>
        {renderTree.render()}
    </div>
  );
}

export default HomePage;
