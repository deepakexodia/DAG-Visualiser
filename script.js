//const proto = {
//    x: 0, //x of center of object
//    y: 0, //y of center of object
//    z: 0,
//    r: 20,
//    text: "",
//    color: "",
//    direction: "",
//    draw: function () {
//        const obj = document.createElement("div");
//        obj.classList.add("circle");
//        obj.style.height = `${2 * this.r}px`;
//        obj.style.width = `${2 * this.r}px`;
//        obj.style.left = `${this.x - this.r}px`;
//        obj.style.top = `${this.y - this.r}px`;
//        obj.style.zIndex = this.z;
//        obj.textContent = this.text;
//        obj.style.backgroundColor = this.color;
//        if (this.direction == "left") {
//            obj.style.clipPath = "inset(0 50% 0 0)";
//        }
//        if (this.direction == "right") {
//            obj.style.clipPath = "inset(0 0 0 50%)";
//        }
//        obj.addEventListener("click", this.onClick);
//        document.body.appendChild(obj);
//    },
//    onClick: function (e) {
//        const clickedElements = document.elementsFromPoint(e.clientX, e.clientY);
//        clickedElements.forEach((el) => {
//            el.style.borderColor = "red";
//        });
//    }
//};

const nodeProto = {
    x: 0,
    y: 0,
    r: 20,
    txt: "",
    draw: function () {
        const el = document.createElement("div");
        el.id = this.txt;
        el.classList.add("circle");
        el.style.height = `${2 * this.r}px`;
        el.style.width = `${2 * this.r}px`;
        el.style.left = `${this.x - this.r}px`;
        el.style.top = `${this.y - this.r}px`;
        el.style.zIndex = 1;
        el.textContent = this.txt;
        document.body.appendChild(el);
    }
};

function createNode(x, y, r, txt) {
    const n = Object.create(nodeProto);
    n.x = x;
    n.y = y;
    n.r = r;
    n.txt = txt;
    return n;
}

const edgeProto = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    direction: false,
    draw: function () {
        const el = document.createElement("div");
        const x = Math.abs(this.x1 + this.x2) / 2;
        const y = Math.abs(this.y1 + this.y2) / 2;
        const r = Math.sqrt(Math.pow(Math.abs(this.x1 - this.x2), 2) + Math.pow(Math.abs(this.y1 - this.y2), 2)) / 2;
        el.classList.add(this.direction ? "right-half-circle" : "left-half-circle");
        el.style.height = `${2 * r}px`;
        el.style.width = `${2 * r}px`;
        el.style.left = `${x - r}px`;
        el.style.top = `${y - r}px`;
        document.body.appendChild(el);
    }
};

function createEdge(x1, y1, x2, y2, direction) {
    const e = Object.create(edgeProto);
    e.x1 = x1;
    e.y1 = y1;
    e.x2 = x2;
    e.y2 = y2;
    e.direction = direction;
    return e;
}

//const edgeProto1 = {
//    x1: 0,
//    y1: 0,
//    txt1: "",
//    x2: 0,
//    y2: 0,
//    txt2: "",
//    direction: false,
//    arc: document.createElement("div"),
//    node1: document.createElement("div"),
//    node2: document.createElement("div"),
//    draw: function () {
//        //draw arc
//        {
//            const x = Math.abs(x1 - x2) / 2;
//            const y = Math.abs(y1 - y2) / 2;
//            const r = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
//            arc.classList.add(this.direction ? "right-half-circle" : "left-half-circle");
//            arc.style.height = `${2 * r}px`;
//            arc.style.width = `${2 * r}px`;
//            arc.style.left = `${x - r}px`;
//            arc.style.top = `${y - r}px`;
//        }
//        //draw nodes
//        {
//            const r = 20;
//            const z = 1;
//            node1.classList.add("circle");
//            node2.classList.add("circle");
//            node1.style.height = node2.style.height = `${2 * r}px`;
//            node1.style.width = node2.style.width = `${2 * r}px`;
//            node1.style.left = node2.style.left = `${x - r}px`;
//            node1.style.top = node2.style.top = `${y - r}px`;
//            node1.style.zIndex = node2.style.zIndex = z;
//            node1.textContent = txt1;
//            node2.textContent = txt2;
//        }
//    },
//    erase: function () {
//        arc.classList.remove(this.direction ? "right-half-circle" : "left-half-circle");
//        node1.classList.remove("circle");
//        node2.classList.remove("circle");
//    }
//};

function topologicalSort(edges) {
    const graph = {};

    // Build graph (only approved edges)
    edges.forEach(([src, dest, approved]) => {
        if (!graph[src]) graph[src] = [];
        if (!graph[dest]) graph[dest] = [];
        if (approved) {
            graph[src].push(dest);
        }
    });

    const visited = new Set();
    const visiting = new Set();
    const result = [];

    function dfs(node) {
        if (visiting.has(node)) {
            throw new Error("Cycle detected in the graph!");
        }
        if (visited.has(node)) return;

        visiting.add(node);

        graph[node].forEach((neighbor) => {
            dfs(neighbor);
        });

        visiting.delete(node);
        visited.add(node);
        result.push(node);
    }

    // Call DFS for all nodes
    Object.keys(graph).forEach((node) => {
        if (!visited.has(node)) {
            dfs(node);
        }
    });

    return result.reverse(); // reverse for topological order
}

//const centerX = document.documentElement.clientWidth / 2;

let edges = [
    ["a", "b", true],
    ["a", "c", true],
    ["a", "d", false],
    ["b", "d", true],
    ["b", "d", false],
    ["c", "d", true],
    ["c", "d", false]
];

//draw nodes
let sortedNodes = topologicalSort(edges);
for (let i = 0; i < sortedNodes.length; i++) {
    const centerX = document.documentElement.clientWidth / 2;
    const r = 20;
    const x = centerX;
    const gap = 20;
    const y = (i > 0 ? sortedNodes[i - 1].y : 0) + 2 * r + gap;
    const node = createNode(x, y, r, sortedNodes[i]);
    sortedNodes[i] = node;
    node.draw();
}

//draw edges
for (let i = 0; i < edges.length; i++) {
    const n1 = sortedNodes.find((n) => n.txt === edges[i][0]);
    const n2 = sortedNodes.find((n) => n.txt === edges[i][1]);
    const direction = edges[i][2];
    const edge = createEdge(n1.x, n1.y, n2.x, n2.y, direction);
    edges[i] = edge;
    edge.draw();
}

//let nodes = [];
//["a", "b", "c", "d"].forEach((txt) => {
//    let node = Object.create(proto);
//    node.text = txt;
//    node.color = "white";
//    nodes.push(node);
//});

////draw nodes
//for (let i = 0; i < nodes.length; i++) {
//    let node = nodes[i];
//    const c = 20;
//    node.x = centerX;
//    node.y = (i > 0 ? nodes[i - 1].y : 0) + 2 * node.r + c;
//    //node.z = 1;
//    node.draw();
//}

//[
//    [nodes[0], nodes[1], true],
//    [nodes[0], nodes[2], true],
//    [nodes[0], nodes[3], false],
//    [nodes[1], nodes[3], true],
//    [nodes[1], nodes[3], false],
//    [nodes[2], nodes[3], true],
//    [nodes[2], nodes[3], false]
//].forEach((arr) => {
//    let edge = Object.create(proto);
//    edge.x = centerX;
//    edge.r = (arr[1].y - arr[0].y) / 2;
//    edge.y = arr[0].y + edge.r;
//    edge.direction = arr[2] ? "right" : "left";
//    edge.draw();
//});

//temp

//class Node {
//    constructor(x, y, r, txt) {
//        this.x = x;
//        this.y = y;
//        this.r = r;
//        this.txt = txt;
//        this.el = document.createElement("div");
//    }
//}
//
//class Edge {
//    constructor(node1, node2, isLeft) {
//        this.node1 = node1;
//        this.node2 = node2;
//        this.isLeft = isLeft;
//        this.el = document.createElement("div");
//    }
//}
//
//const nodes = ["a", "b", "c", "d", "e"];
//
//for (let i = 0; i < nodes.length; i++) {
//    const r = 20;
//    const x = centerX;
//    const gap = 20;
//    const y = (i > 0 ? nodes[i - 1].y : 0) + 2 * r + gap;
//    const node = new Node(x, y, r, nodes[i]);
//    nodes[i] = node;
//}
//
//const edges = [
//    [nodes[0], nodes[1], true],
//    [nodes[0], nodes[2], true],
//    [nodes[0], nodes[3], false],
//    [nodes[1], nodes[3], true],
//    [nodes[1], nodes[3], false],
//    [nodes[2], nodes[3], true],
//    [nodes[2], nodes[3], false]
//];
//
//for (let i = 0; i < edges.length; i++) {
//    edges[i] = new Edge(edges[i][0], edges[i][1], edges[i][2]);
//}
////temp
//
//
//class Edges {
//    constructor() {
//
//    }
//
//    push(srcNode, destNode, direction) {//srcNode:string, destNode:string, direction:boolean
//        //topolically sort the nodes
//        //create nodes
//    }
//
//}
