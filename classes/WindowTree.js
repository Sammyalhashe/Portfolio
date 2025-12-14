import React from 'react';
import Shell from "../Shell";
import { v4 as uuidv4 } from 'uuid';

const Split = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    NONE: 2,
};

const ParentDirection = {
    RIGHT: 0,
    LEFT: 1,
    NONE: 2,
};

const THEMES = {
    default: {
        '--bg-color': 'black',
        '--text-color': 'white',
        '--prompt-color': 'red',
        '--info-color': 'green',
        '--highlight-color': 'orange',
        '--highlight-info-color': 'cyan',
        '--error-color': 'red',
        '--link-color': 'red',
        '--link-bg-color': 'blue',
        '--link-hover-bg-color': 'yellow',
        '--modal-bg-color': 'black',
        '--modal-border-color': 'green',
    },
    gruvbox: {
        '--bg-color': '#282828',
        '--text-color': '#ebdbb2',
        '--prompt-color': '#cc241d',
        '--info-color': '#98971a',
        '--highlight-color': '#d79921',
        '--highlight-info-color': '#458588',
        '--error-color': '#cc241d',
        '--link-color': '#ebdbb2',
        '--link-bg-color': '#458588',
        '--link-hover-bg-color': '#d79921',
        '--modal-bg-color': '#282828',
        '--modal-border-color': '#98971a',
    },
    nord: {
        '--bg-color': '#2e3440',
        '--text-color': '#d8dee9',
        '--prompt-color': '#bf616a',
        '--info-color': '#a3be8c',
        '--highlight-color': '#ebcb8b',
        '--highlight-info-color': '#88c0d0',
        '--error-color': '#bf616a',
        '--link-color': '#2e3440',
        '--link-bg-color': '#88c0d0',
        '--link-hover-bg-color': '#ebcb8b',
        '--modal-bg-color': '#2e3440',
        '--modal-border-color': '#a3be8c',
    },
    'nord light': {
        '--bg-color': '#eceff4',
        '--text-color': '#2e3440',
        '--prompt-color': '#bf616a',
        '--info-color': '#a3be8c',
        '--highlight-color': '#d08770',
        '--highlight-info-color': '#5e81ac',
        '--error-color': '#bf616a',
        '--link-color': '#eceff4',
        '--link-bg-color': '#5e81ac',
        '--link-hover-bg-color': '#d08770',
        '--modal-bg-color': '#eceff4',
        '--modal-border-color': '#a3be8c',
    },
    'github dark': {
        '--bg-color': '#0d1117',
        '--text-color': '#c9d1d9',
        '--prompt-color': '#ff7b72',
        '--info-color': '#3fb950',
        '--highlight-color': '#d29922',
        '--highlight-info-color': '#58a6ff',
        '--error-color': '#ff7b72',
        '--link-color': '#f0f6fc',
        '--link-bg-color': '#1f6feb',
        '--link-hover-bg-color': '#d29922',
        '--modal-bg-color': '#0d1117',
        '--modal-border-color': '#3fb950',
    },
    'github light': {
        '--bg-color': '#ffffff',
        '--text-color': '#24292f',
        '--prompt-color': '#cf222e',
        '--info-color': '#1a7f37',
        '--highlight-color': '#9a6700',
        '--highlight-info-color': '#0969da',
        '--error-color': '#cf222e',
        '--link-color': '#ffffff',
        '--link-bg-color': '#0969da',
        '--link-hover-bg-color': '#9a6700',
        '--modal-bg-color': '#ffffff',
        '--modal-border-color': '#1a7f37',
    }
};

class Node {
    constructor(
        nodeId,
        val,
        dirSplit = Split.NONE,
        isLeaf = true,
        parent = null,
        parentDir = ParentDirection.NONE,
        left = null,
        right = null
    ) {
        this.nodeId = nodeId;
        this.val = val;
        this.dirSplit = dirSplit;
        this.isLeaf = isLeaf;
        this.parent = parent;
        this.parentDir = parentDir;
        this.left = left;
        this.right = right;
        this.interps = [];
        this.legacyInterps = [];
    }

    insertNewSplit(node, direction = Split.HORIZONTAL) {
        // means nothing if not a leaf
        if (this.isLeaf) {
            const newId = uuidv4();
            const splitNode = new Node(
                newId,                  // nodeId
                null,                   // val
                direction,              // dirSplit
                false,                  // isLeaf
                this.parent,            // parent
                this.parentDir,         // parentDir
                node,                   // left (New Empty)
                this                    // right (Existing Content)
            ); // create new split node

            // save the old parentDir
            const oldParentDir = this.parentDir;

            // set the parent directions of the nodes accordingly
            // `this` is now RIGHT child
            this.parentDir = ParentDirection.RIGHT;
            // `node` is now LEFT child
            node.parentDir = ParentDirection.LEFT;

            // attach the parent based on the parent direction
            if (this.parent) {
                switch (oldParentDir) {
                    case ParentDirection.RIGHT:
                        this.parent.right = splitNode;
                        break;
                    case ParentDirection.LEFT:
                        this.parent.left = splitNode;
                        break;
                    default:
                        // do nothing, it has no parent
                        break;
                }
            }

            // set the splitNode as the parent of both of the other nodes
            this.parent = splitNode;
            node.parent = splitNode;
            // NOTE: might be unecessary
            this.isLeaf = true;
            node.isLeaf = true;
            return splitNode;
        }
        return null;
    }
}

class WindowTree {
    shellMap = new Map();
    blogView = 'popup';
    modalContent = null;
    pageContent = null;
    theme = 'default';

    handleSplitFromId(nodeId, direction) {
        if (this.shellMap.has(nodeId)) {
            this.insertNodeAtSplit(nodeId, direction);
            this.context(this.render());
        }
    }

    handleRemoveFromId(nodeId) {
        if (this.shellMap.has(nodeId)) {
            this.removeNode(nodeId);
            this.context(this.render());
			console.log(this.printTree());
        }
    }

    setBlogView(mode) {
        this.blogView = mode;
        this.context(this.render());
    }

    setModal(content) {
        this.modalContent = content;
        this.context(this.render());
    }

    setPage(content) {
        this.pageContent = content;
        // Update URL if page is closed
        if (!content) {
             const url = new URL(window.location);
             url.searchParams.delete('post');
             window.history.pushState({}, '', url);
        }
        this.context(this.render());
    }

    setTheme(themeName) {
        if (THEMES[themeName]) {
            this.theme = themeName;
            const theme = THEMES[themeName];
            Object.keys(theme).forEach(key => {
                document.documentElement.style.setProperty(key, theme[key]);
            });
            this.context(this.render());
            return true;
        }
        return false;
    }

    detectTheme() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.setTheme('github light');
            } else {
                this.setTheme('default');
            }
        }
    }

    constructor(surroundingContext) {
        this.context = surroundingContext;
        this.rootId = uuidv4();
        // Pass null as val since we generate Shell dynamically in renderTree
        const newNode = new Node(this.rootId, null);
        this.shellMap.set(this.rootId, newNode);
        this.root = newNode;

        // Bind methods to this instance
        this.setBlogView = this.setBlogView.bind(this);
        this.setModal = this.setModal.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.detectTheme = this.detectTheme.bind(this);
    }

    get rootNode() {
        return this.root;
    }

    insertNodeAtSplit(targetNodeId, direction = Split.HORIZONTAL) {
        if (this.shellMap.has(targetNodeId) && this.shellMap.get(targetNodeId).isLeaf) {
            const newUuid = uuidv4();
            // Pass null as val
            const newNode = new Node(newUuid, null);

            this.shellMap.set(newUuid, newNode);
            const splitNode = this.shellMap
                .get(targetNodeId)
                .insertNewSplit(newNode, direction);
            // add the splitNode to the collection of nodes if the method created one
            if (splitNode) {
                this.shellMap.set(splitNode.nodeId, splitNode);
                // reset the root if necessary
                if (targetNodeId === this.rootId) {
                    this.rootId = splitNode.nodeId;
                    this.root = splitNode;
                }
            }
			this.printTree();
            return newNode;
        }
        return null;
    }

    removeNode(targetNodeId) {
        // we shouldn't be able to remove the root Node
        if (this.shellMap.has(targetNodeId) && !(this.rootId === targetNodeId)) {
			console.log(targetNodeId)
			this.printTree();
            const nodeToRemove = this.shellMap.get(targetNodeId);
            const parent = nodeToRemove.parent;

            let nodeLeftOver; // node that will remain after deletion
            if (nodeToRemove.parentDir === ParentDirection.LEFT) {
                nodeLeftOver = parent.right;
            } else { // since we only consider root nodes, we don't worry about ParentDirection.NONE
                nodeLeftOver = parent.left;
            }

            // set the new parent
            const parentOfParent = parent.parent;
            if (parentOfParent) {
                const direction = parent.parentDir;
                if (direction === ParentDirection.LEFT) {
                    parentOfParent.left = nodeLeftOver;
                } else {
                    parentOfParent.right = nodeLeftOver;
                }
                nodeLeftOver.parent = parentOfParent;
                nodeLeftOver.parentDir = direction;
            } else { // we set a new root
                this.root = nodeLeftOver;
                this.rootId = nodeLeftOver.nodeId;
                nodeLeftOver.parent = null;
                nodeLeftOver.parentDir = ParentDirection.NONE;
            }

            // remove the nodes that need to be removed
            this.shellMap.delete(parent.nodeId);
            this.shellMap.delete(nodeToRemove.nodeId);
        }
    }

	printTree() {
		let built = "";
		let helper = (node) =>  {
			if (!node) {
				built += "null";
				return;
			}
			built += "(";
			built += node.nodeId.toString() + ",";
			helper(node.left);
			built += ",";
			helper(node.right);
			built += ")";
		}
		helper(this.root);
		return built;
	}

    render() {
        return (
            <React.Fragment>
                {this.renderTree(this.root)}
                {this.modalContent && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={() => this.setModal(null)}>X</button>
                            {this.modalContent}
                        </div>
                    </div>
                )}
                {this.pageContent && (
                    <div className="page-overlay">
                        <div className="theme-switcher-container">
                            <select
                                className="theme-select"
                                value={this.theme}
                                onChange={(e) => this.setTheme(e.target.value)}
                            >
                                {Object.keys(THEMES).map(theme => (
                                    <option key={theme} value={theme}>{theme}</option>
                                ))}
                            </select>
                        </div>
                        <button className="page-close-button" onClick={() => this.setPage(null)}>X</button>
                        <div className="page-content-wrapper">
                            {this.pageContent}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }

    renderTree(node) {
        if (node.isLeaf) {
            return (
                <Shell
                    key={node.nodeId}
                    nodeId={node.nodeId}
                    removeHandle={this}
                    splitHandle={this}
                    interps={node.interps}
                    setInterps={(newInterps) => {
                        node.interps = newInterps;
                        this.context(this.render());
                    }}
                    legacyInterps={node.legacyInterps}
                    setLegacyInterps={(newLegacy) => {
                        node.legacyInterps = newLegacy;
                        this.context(this.render());
                    }}
                    blogView={this.blogView}
                    setBlogView={this.setBlogView}
                    setModal={this.setModal}
                    setPage={this.setPage}
                    setTheme={this.setTheme}
                    theme={this.theme}
                />
            );
        }
        if (node.dirSplit === Split.HORIZONTAL) {
            return (
                <div key={node.nodeId} style={{overflow: 'hidden', width: '100%', height: '100%', display: "flex", flexDirection: "column"}}>
                    <div style={{width: '100%', height: '50%', borderBottom: 'solid grey 1px'}} className='shellContainer'>{this.renderTree(node.right)}</div>
                    <div style={{width: '100%', height: '50%'}} className='shellContainer'>{this.renderTree(node.left)}</div>
                </div>
            );
        } else {
            return (
                <div key={node.nodeId} style={{width: '100%', height: '100%', display: "flex", flexDirection: "row"}}>
                    <div style={{width: '50%', height: '100%', borderRight: 'solid grey 1px'}} className='shellContainer'>{this.renderTree(node.right)}</div>
                    <div style={{width: '50%', height: '100%'}} className='shellContainer'>{this.renderTree(node.left)}</div>
                </div>
            );
        }

    }
}

export default WindowTree;
