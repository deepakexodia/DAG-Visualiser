const proto = {
    x: 0, //x of center of object
    y: 0, //y of center of object
    z: 0,
    r: 20,
    text: "",
    color: "",
    direction: "",
    draw: function () {
        const obj = document.createElement("div");
        obj.classList.add("circle");
        obj.style.height = `${2 * this.r}px`;
        obj.style.width = `${2 * this.r}px`;
        obj.style.left = `${this.x - this.r}px`;
        obj.style.top = `${this.y - this.r}px`;
        obj.style.zIndex = this.z;
        obj.textContent = this.text;
        obj.style.backgroundColor = this.color;
        if (this.direction == "left") {
            obj.style.clipPath = "inset(0 50% 0 0)";
        }
        if (this.direction == "right") {
            obj.style.clipPath = "inset(0 0 0 50%)";
        }
        obj.addEventListener("click", this.onClick);
        document.body.appendChild(obj);
    },
    onClick: function (e) {
        const clickedElements = document.elementsFromPoint(e.clientX, e.clientY);
        clickedElements.forEach((el) => {
            el.style.borderColor = "red";
        });
    }
};

const nodePorto = {
    x: 0,
    y: 0,
    txt: "",
    el: document.createElement("div"),
    draw: function () {
        const r = 20;
        const z = 1;
        el.classList.add("circle");
        el.style.height = `${2 * r}px`;
        el.style.width = `${2 * r}px`;
        el.style.left = `${x - r}px`;
        el.style.top = `${y - r}px`;
        el.style.zIndex = z;
        el.textContent = txt;
    }
};

const edgeProto = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    direction: false,
    el: document.createElement("div"),
    draw: function () {
        const x = Math.abs(x1 - x2) / 2;
        const y = Math.abs(y1 - y2) / 2;
        const r = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
        el.classList.add("circle");
        el.style.height = `${2 * r}px`;
        el.style.width = `${2 * r}px`;
        el.style.left = `${x - r}px`;
        el.style.top = `${y - r}px`;
        el.style.clipPath = this.direction ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)";
    }
};

const centerX = document.documentElement.clientWidth / 2;
let nodes = [];
["a", "b", "c", "d"].forEach((txt) => {
    let node = Object.create(proto);
    node.text = txt;
    node.color = "white";
    nodes.push(node);
});

//draw nodes
for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    const c = 20;
    node.x = centerX;
    node.y = (i > 0 ? nodes[i - 1].y : 0) + 2 * node.r + c;
    //node.z = 1;
    node.draw();
}

let edges = [];
[
    [nodes[0], nodes[1], true],
    [nodes[0], nodes[2], true],
    [nodes[0], nodes[3], false],
    [nodes[1], nodes[3], true],
    [nodes[1], nodes[3], false],
    [nodes[2], nodes[3], true],
    [nodes[2], nodes[3], false]
].forEach((arr) => {
    let edge = Object.create(proto);
    edge.x = centerX;
    edge.r = (arr[1].y - arr[0].y) / 2;
    edge.y = arr[0].y + edge.r;
    edge.direction = arr[2] ? "right" : "left";
    edge.draw();
});

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
