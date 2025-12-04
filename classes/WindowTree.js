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
            // NOTE: Swapped existing node (this) to Right and new node (node) to Left
            // This ensures existing content moves to the right/bottom, and new empty node is on left/top?
            // Wait, previous logic was: `this`=Left, `node`=Right.
            // Result: `this` (content) was first child (Bottom/Right?), `node` (empty) was second (Top/Left?).
            // Let's re-verify renderTree logic.
            // Horizontal: right child is top 50%, left child is bottom 50%.
            // Vertical: right child is left 50%, left child is right 50%.

            // Goal: "New node on the right/down should be brand new".
            // So:
            // Horizontal (Down): Bottom 50% should be New Empty. Top 50% should be Existing Content.
            // Vertical (Right): Right 50% should be New Empty. Left 50% should be Existing Content.

            // RenderTree logic (unchanged):
            // Horizontal: Top = right child, Bottom = left child.
            // Vertical: Left = right child, Right = left child.

            // So for Horizontal (Down split):
            // Top (Existing) = right child.
            // Bottom (New Empty) = left child.
            // So `this` -> right child. `node` -> left child.

            // For Vertical (Right split):
            // Left (Existing) = right child.
            // Right (New Empty) = left child.
            // So `this` -> right child. `node` -> left child.

            // So in both cases, `this` should be assigned to `right` property, and `node` to `left` property.

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
    blogView = 'inline';
    modalContent = null;

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
