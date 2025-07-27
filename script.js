const nodeProto = {
    x: 0,
    y: 0,
    r: 0,
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

let edges = [];

const jsonString =
    '{"START":{"nextAction":{"approved":["DOC_VALIDATION_COE"]},"executionCondition":[]},"DOC_VALIDATION_COE":{"nextAction":{"approved":["LIVENESS_COE","SPOOF_COE"],"rejected":["MILESTONE"]},"executionCondition":[{"type":"eq","key":"START","value":"approved"}]},"LIVENESS_COE":{"nextAction":{"approved":["MILESTONE"],"rejected":["MILESTONE"]},"executionCondition":[{"type":"eq","key":"DOC_VALIDATION_COE","value":"approved"}]},"SPOOF_COE":{"nextAction":{"approved":["FRS_COE"],"rejected":["MILESTONE"]},"executionCondition":[{"type":"eq","key":"DOC_VALIDATION_COE","value":"approved"}]},"FRS_COE":{"nextAction":{"approved":["MILESTONE"],"rejected":["MILESTONE"]},"executionCondition":[{"type":"eq","key":"SPOOF_COE","value":"approved"}]},"MILESTONE":{"nextAction":{"approved":["BILLING"]},"executionCondition":[{"type":"or","conditions":[{"type":"and","conditions":[{"type":"eq","key":"LIVENESS_COE","value":"approved"},{"type":"eq","key":"FRS_COE","value":"approved"}]},{"type":"eq","key":"LIVENESS_COE","value":"rejected"},{"type":"eq","key":"SPOOF_COE","value":"rejected"},{"type":"eq","key":"FRS_COE","value":"rejected"},{"type":"eq","key":"DOC_VALIDATION_COE","value":"rejected"}]}]},"BILLING":{"nextAction":{"approved":["FINISH"]},"executionCondition":[{"type":"eq","key":"MILESTONE","value":"approved"}]},"FINISH":{"nextAction":{},"executionCondition":[{"type":"or","conditions":[{"type":"eq","key":"BILLING","value":"approved"}]}]}}';
try {
    const json = JSON.parse(jsonString);
    for (let n1 in json) {
        let approvedArr = json[n1]?.nextAction?.approved;
        let rejectedArr = json[n1]?.nextAction?.rejected;
        console.log("node: " + n1);
        console.log("approved array: " + approvedArr);
        console.log("rejected array: " + rejectedArr);
        console.log(approvedArr?.length);
        if (approvedArr?.length) {
            for (let i = 0; i < approvedArr.length; i++) {
                edges.push([n1, approvedArr[i], true]);
            }
        }
        if (rejectedArr?.length) {
            for (let i = 0; i < rejectedArr.length; i++) {
                edges.push([n1, rejectedArr[i], false]);
            }
        }
    }
} catch (e) {
    console.error("Invalid JSON:", e.message);
}

//draw nodes
let sortedNodes = topologicalSort(edges);
const centerX = document.documentElement.clientWidth / 2;
for (let i = 0; i < sortedNodes.length; i++) {
    const r = 25;
    const x = centerX;
    const gap = 30;
    const y = (i > 0 ? sortedNodes[i - 1].y : 0) + 2 * r + gap;
    const node = createNode(x, y, r, sortedNodes[i]);
    sortedNodes[i] = node;
    node.draw();
}

//draw edges
for (let i = 0; i < edges.length; i++) {
    const n1txt = edges[i][0];
    const n2txt = edges[i][1];
    const n1 = sortedNodes.find((n) => n.txt === n1txt);
    const n2 = sortedNodes.find((n) => n.txt === n2txt);
    const direction = edges[i][2];
    const edge = createEdge(n1.x, n1.y, n2.x, n2.y, direction);
    edges[i] = edge;
    edge.draw();
}
