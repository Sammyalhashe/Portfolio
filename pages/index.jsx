import React, { useState } from "react";
import Head from "next/head";
import Shell from "../Shell";
import WindowTree from "../classes/WindowTree";

function HomePage() {
  const [interps, setInterps] = useState("");
  const [renderTree, setRenderTree] = useState(new WindowTree(setInterps));
  // const tree = new WindowTree();
  // const newNode = tree.insertNodeAtSplit(tree.rootNode.nodeId);
  // const newnewNode = tree.insertNodeAtSplit(newNode.nodeId, 1);
  // tree.insertNodeAtSplit(newnewNode.nodeId, 1)
  return (
    <div className="main">
      <Head>
        <title>My profile</title>
      </Head>
        {renderTree.renderTree(renderTree.rootNode)}
    </div>
  );
}

export default HomePage;
