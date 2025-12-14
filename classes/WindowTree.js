/* eslint-disable max-classes-per-file */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React from 'react';
import Shell from "../Shell";
import ProgressBar from "../components/ProgressBar";
import cmds from "../functions/commands";
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
    constructor(surroundingContext) {
        this.shellMap = new Map();
        this.blogView = 'page';
        this.modalContent = null;
        this.pageContent = null;
        this.theme = 'default';
        this.activeTabIndex = 0;
        this.tabs = [];
        this.activeNodeId = null;

        this.context = surroundingContext;

        // Create initial tab
        const rootId = uuidv4();
        const newNode = new Node(rootId, null);
        this.shellMap.set(rootId, newNode);

        this.tabs = [{
            rootId,
            root: newNode,
            name: 'Tab #1'
        }];
        this.activeTabIndex = 0;
        this.activeNodeId = rootId;

        // Bind methods to this instance
        this.setBlogView = this.setBlogView.bind(this);
        this.setModal = this.setModal.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.detectTheme = this.detectTheme.bind(this);

        // Bind tab methods
        this.handleTabNew = this.handleTabNew.bind(this);
        this.handleTabClose = this.handleTabClose.bind(this);
        this.handleTabNext = this.handleTabNext.bind(this);
        this.handleTabPrev = this.handleTabPrev.bind(this);
        this.handleFocusMove = this.handleFocusMove.bind(this);

        this.modalRef = React.createRef();
        this.pageRef = React.createRef();
    }

    handleSplitFromId(nodeId, direction) {
        if (this.shellMap.has(nodeId)) {
            const newNode = this.insertNodeAtSplit(nodeId, direction);
            this.activeNodeId = newNode.nodeId; // Focus new node
            this.context(this.render());
        }
    }

    handleRemoveFromId(nodeId) {
        if (this.shellMap.has(nodeId)) {
            this.removeNode(nodeId);
            // reset activeNodeId if it was removed
            if (this.activeNodeId === nodeId) {
                // Default to root or traversal logic needed
                this.activeNodeId = this.rootNode.nodeId;
            }
            this.context(this.render());
            console.log(this.printTree());
        }
    }

    handleFocus(nodeId) {
        if (this.activeNodeId !== nodeId) {
            this.activeNodeId = nodeId;
            this.context(this.render());
        }
    }

    // --- Navigation (Ctrl+hjkl) ---

    handleFocusMove(directionKey) {
        if (!this.activeNodeId || !this.shellMap.has(this.activeNodeId)) {
            // Focus on root if nothing is active
            if (this.rootNode) {
                this.activeNodeId = this.rootNode.nodeId;
                // If root is not leaf (it has splits), we need to find a leaf.
                // But for simplicity, let's assume it works.
            }
            return;
        }

        const currentNode = this.shellMap.get(this.activeNodeId);

        // This is a simplified "find neighbor" logic.
        // True geometric navigation in a binary split tree is complex.
        // We will try to find a parent split that matches the desired direction.

        let targetNode = null;

        // Traverse up
        let p = currentNode;
        while (p.parent) {
            const isLeftChild = p.parentDir === ParentDirection.LEFT;
            const parent = p.parent;
            const splitDir = parent.dirSplit; // HORIZONTAL (0) or VERTICAL (1)

            // Logic:
            // k (up): need Horizontal split, am Right(Bottom) child -> go Left(Top) sibling
            // j (down): need Horizontal split, am Left(Top) child -> go Right(Bottom) sibling
            // h (left): need Vertical split, am Right child -> go Left sibling
            // l (right): need Vertical split, am Left child -> go Right sibling

            // Note: In Node.js:
            // insertNewSplit(node, direction):
            //   direction=HORIZONTAL -> split vertically stacked? No.
            //   Let's check Split enum: HORIZONTAL=0. Usually implies split line is horizontal
            // (top/bottom).
            //   renderTree:
            //     HORIZONTAL: flex-direction: column.
            //       right is child 1 (top?), left is child 2 (bottom?).
            //       Wait, renderTree(node.right) is first div (borderBottom).
            //       renderTree(node.left) is second div.
            //       So Right child is Top, Left child is Bottom.
            //     VERTICAL (else): flex-direction: row.
            //       right is child 1 (left?), left is child 2 (right?).
            //       Wait, renderTree(node.right) is first div (borderRight).
            //       renderTree(node.left) is second div.
            //       So Right child is Left, Left child is Right.

            // Let's verify standard binary tree directions in this code:
            // insertNewSplit(newNode, dir):
            //   this becomes RIGHT child.
            //   newNode becomes LEFT child.
            //   parent.right = splitNode (if old this was right).

            // RENDER MAPPING:
            // HORIZONTAL (Column): Right=Top, Left=Bottom
            // VERTICAL (Row): Right=LeftPane, Left=RightPane

            // So:
            // 'k' (Up): Need Horizontal. Currently in Bottom (Left). Go Top (Right).
            // 'j' (Down): Need Horizontal. Currently in Top (Right). Go Bottom (Left).
            // 'h' (Left): Need Vertical. Currently in RightPane (Left). Go LeftPane (Right).
            // 'l' (Right): Need Vertical. Currently in LeftPane (Right). Go RightPane (Left).

            if (directionKey === 'k' && splitDir === Split.HORIZONTAL) {
                if (isLeftChild) { // Am Bottom
                    targetNode = parent.right; // Go Top
                    break;
                }
            } else if (directionKey === 'j' && splitDir === Split.HORIZONTAL) {
                if (!isLeftChild) { // Am Top
                    targetNode = parent.left; // Go Bottom
                    break;
                }
            } else if (directionKey === 'h' && splitDir === Split.VERTICAL) {
                if (isLeftChild) { // Am RightPane
                    targetNode = parent.right; // Go LeftPane
                    break;
                }
            } else if (directionKey === 'l' && splitDir === Split.VERTICAL) {
                if (!isLeftChild) { // Am LeftPane
                    targetNode = parent.left; // Go RightPane
                    break;
                }
            }

            p = parent;
        }

        if (targetNode) {
            // Drill down to a leaf (usually nearest)
            // For simplicity, drill down "left" or "right" depending on direction logic
            // or just take the first leaf we find.
            // Better UX: keep relative position. Too complex.
            // Simple UX: just find any leaf in that subtree.

            let curr = targetNode;
            while (!curr.isLeaf) {
                curr = curr.right; // Arbitrary choice (Top/LeftPane)
            }
            this.activeNodeId = curr.nodeId;
            this.context(this.render());
        }
    }

    // --- Tab Management ---

    handleTabNew() {
        const rootId = uuidv4();
        const newNode = new Node(rootId, null);
        this.shellMap.set(rootId, newNode);

        const newTab = {
            rootId,
            root: newNode,
            name: `Tab #${this.tabs.length + 1}`
        };

        this.tabs.push(newTab);
        this.activeTabIndex = this.tabs.length - 1;
        this.activeNodeId = rootId; // Focus new tab
        this.context(this.render());
        return newNode;
    }

    handleTabClose() {
        if (this.tabs.length > 1) {
            // Recursively remove all nodes in the current tab from shellMap
            const removeSubtree = (node) => {
                if (!node) return;
                this.shellMap.delete(node.nodeId);
                removeSubtree(node.left);
                removeSubtree(node.right);
            };

            removeSubtree(this.tabs[this.activeTabIndex].root);

            this.tabs.splice(this.activeTabIndex, 1);
            if (this.activeTabIndex >= this.tabs.length) {
                this.activeTabIndex = this.tabs.length - 1;
            }
            this.activeNodeId = this.tabs[this.activeTabIndex].root.nodeId; // Focus remaining tab
            this.context(this.render());
        } else {
            // Don't close the last tab, maybe just reset it?
            // For now, do nothing.
        }
    }

    handleTabNext() {
        this.activeTabIndex = (this.activeTabIndex + 1) % this.tabs.length;
        // Reset focus to root of new tab (or keep track of last focused per tab?)
        this.activeNodeId = this.tabs[this.activeTabIndex].root.nodeId;
        // TODO: track last focused per tab for better UX. For now, root is fine.
        this.context(this.render());
    }

    handleTabPrev() {
        this.activeTabIndex = (this.activeTabIndex - 1 + this.tabs.length) % this.tabs.length;
        this.activeNodeId = this.tabs[this.activeTabIndex].root.nodeId;
        this.context(this.render());
    }

    handleTabSelect(index) {
        if (index >= 0 && index < this.tabs.length) {
            this.activeTabIndex = index;
            this.activeNodeId = this.tabs[this.activeTabIndex].root.nodeId;
            this.context(this.render());
        }
    }

    // ----------------------

    setBlogView(mode) {
        this.blogView = mode;
        this.context(this.render());
    }

    setModal(content) {
        this.modalContent = content;
        this.context(this.render());
    }

    setPage(content) {
        if (this.blogView === 'tab' && content) {
            // Open in new tab
            const newNode = this.handleTabNew();
            // Inject content
            // We need to wrap the content in a format Shell expects (interps)
            // content is a React Component.
            const cmdRes = { cmd: null, result: content };
            newNode.interps.push(cmdRes);
            newNode.legacyInterps.push(cmdRes);
            this.context(this.render());
        } else {
            this.pageContent = content;
            // Update URL if page is closed
            if (!content) {
                const url = new URL(window.location);
                url.searchParams.delete('post');
                window.history.pushState({}, '', url);
            }
            this.context(this.render());
        }
    }

    setTheme(themeName) {
        if (THEMES[themeName]) {
            this.theme = themeName;
            const theme = THEMES[themeName];
            Object.keys(theme).forEach((key) => {
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

    injectNeofetch() {
        // Inject into the active tab (which is the first one on init)
        const activeTab = this.tabs[this.activeTabIndex];
        const rootNode = activeTab ? activeTab.root : null;

        if (rootNode && rootNode.interps.length === 0) {
            const result = cmds.neofetch(null, null, { theme: this.theme });
            const cmdRes = { cmd: null, result };
            rootNode.interps.push(cmdRes);
            rootNode.legacyInterps.push(cmdRes);
            this.context(this.render());
        }
    }

    // Backward compatibility getter/setters
    get root() {
        return this.tabs[this.activeTabIndex].root;
    }

    get rootNode() {
        return this.tabs[this.activeTabIndex].root;
    }

    get rootId() {
        return this.tabs[this.activeTabIndex].rootId;
    }

    set root(val) {
        this.tabs[this.activeTabIndex].root = val;
    }

    set rootId(val) {
        this.tabs[this.activeTabIndex].rootId = val;
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
            console.log(targetNodeId);
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
        let built = '';
        const helper = (node) => {
            if (!node) {
                built += 'null';
                return;
            }
            built += '(';
            built += `${node.nodeId.toString()},`;
            helper(node.left);
            built += ',';
            helper(node.right);
            built += ')';
        };
        helper(this.root);
        return built;
    }

    renderTabBar() {
        return (
            <div className="tab-bar">
                <div className="tab-list">
                    {this.tabs.map((tab, index) => (
                        <div
                            key={tab.rootId}
                            className={`tab-item ${index === this.activeTabIndex ? 'active' : ''}`}
                            onClick={() => this.handleTabSelect(index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.handleTabSelect(index);
                                }
                            }}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderTabBar()}
                <div className="main-content" style={{ height: 'calc(100% - 30px)', position: 'relative' }}>
                    {this.renderTree(this.rootNode)}
                </div>
                {this.modalContent && (
                    <div className="modal-overlay">
                        <div className="modal-content" ref={this.modalRef}>
                            <ProgressBar targetRef={this.modalRef} />
                            <button type="button" className="close-button" onClick={() => this.setModal(null)}>X</button>
                            {this.modalContent}
                        </div>
                    </div>
                )}
                {this.pageContent && (
                    <div className="page-overlay" ref={this.pageRef}>
                        <ProgressBar targetRef={this.pageRef} />
                        <div className="theme-switcher-container">
                            <select
                                className="theme-select"
                                value={this.theme}
                                onChange={(e) => this.setTheme(e.target.value)}
                            >
                                {Object.keys(THEMES).map((theme) => (
                                    <option key={theme} value={theme}>{theme}</option>
                                ))}
                            </select>
                        </div>
                        <button type="button" className="page-close-button" onClick={() => this.setPage(null)}>X</button>
                        <div className="page-content-wrapper">
                            {this.pageContent}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }

    renderTree(node) {
        if (!node) return null; // Safety check
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
                    windowTree={this}
                    isFocused={this.activeNodeId === node.nodeId}
                    onFocus={() => this.handleFocus(node.nodeId)}
                />
            );
        }
        if (node.dirSplit === Split.HORIZONTAL) {
            return (
                <div key={node.nodeId} style={{ overflow: 'hidden', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: '50%', borderBottom: 'solid grey 1px' }} className="shellContainer">{this.renderTree(node.right)}</div>
                    <div style={{ width: '100%', height: '50%' }} className="shellContainer">{this.renderTree(node.left)}</div>
                </div>
            );
        }
        return (
            <div key={node.nodeId} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '50%', height: '100%', borderRight: 'solid grey 1px' }} className="shellContainer">{this.renderTree(node.right)}</div>
                <div style={{ width: '50%', height: '100%' }} className="shellContainer">{this.renderTree(node.left)}</div>
            </div>
        );
    }
}

export default WindowTree;
