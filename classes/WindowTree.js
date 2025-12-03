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
    }

    insertNewSplit(node, direction = Split.HORIZONTAL) {
        // means nothing if not a leaf
        if (this.isLeaf) {
            // NOTE: decided to put the current node as the left node always
            // Node inserted is the right child of the split Node
            const newId = uuidv4();
            const splitNode = new Node(
                newId,                  // nodeId
                null,                   // val
                direction,              // dirSplit
                false,                  // isLeaf
                this.parent,            // parent
                this.parentDir,         // parentDir
                this,                   // left
                node                    // right
            ); // create new split node

            // save the old parentDir
            const oldParentDir = this.parentDir;

            // set the parent directions of the nodes accordingly
            this.parentDir = ParentDirection.LEFT;
            node.parentDir = ParentDirection.RIGHT;

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

    handleSplitFromId(nodeId, direction) {
        if (this.shellMap.has(nodeId)) {
            this.insertNodeAtSplit(nodeId, direction);
            this.context(this.renderTree(this.rootNode));
        }
    }

    handleRemoveFromId(nodeId) {
        if (this.shellMap.has(nodeId)) {
            this.removeNode(nodeId);
            this.context(this.renderTree(this.rootNode));
			console.log(this.printTree());
        }
    }

    constructor(surroundingContext) {
        this.context = surroundingContext;
        this.rootId = uuidv4();
        const newNode = new Node(this.rootId, <Shell removeHandle={this} splitHandle={this} nodeId={this.rootId} />); // nodeId, val
        this.shellMap.set(this.rootId, newNode);
        this.root = newNode;
    }

    get rootNode() {
        return this.root;
    }

    insertNodeAtSplit(targetNodeId, direction = Split.HORIZONTAL) {
        if (this.shellMap.has(targetNodeId) && this.shellMap.get(targetNodeId).isLeaf) {
            const newUuid = uuidv4();
            const newNode = new Node(newUuid, <Shell removeHandle={this} splitHandle={this} nodeId={newUuid} />); // nodeId val

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

    renderTree(node) {
        if (node.isLeaf) {
            return node.val;
        }
        if (node.dirSplit === Split.HORIZONTAL) {
            return (
                <div style={{overflow: 'hidden', width: '100%', height: '100%', display: "flex", flexDirection: "column"}}>
                    <div style={{width: '100%', height: '50%', borderBottom: 'solid grey 1px'}} className='shellContainer'>{this.renderTree(node.right)}</div>
                    <div style={{width: '100%', height: '50%'}} className='shellContainer'>{this.renderTree(node.left)}</div>
                </div>
            );
        } else {
            return (
                <div style={{width: '100%', height: '100%', display: "flex", flexDirection: "row"}}>
                    <div style={{width: '50%', height: '100%', borderRight: 'solid grey 1px'}} className='shellContainer'>{this.renderTree(node.right)}</div>
                    <div style={{width: '50%', height: '100%'}} className='shellContainer'>{this.renderTree(node.left)}</div>
                </div>
            );
        }

    }
}

export default WindowTree;
