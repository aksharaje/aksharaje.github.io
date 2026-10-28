// How I got here. Sankey of academic/professional journey.
// Edit `data` below to tell your story. Each link gets a `value` (visual weight).

const data = {
  nodes: [
    // Column 1: Foundations (what I brought in)
    { id: "econ",     name: "Economics",        col: 0 },
    { id: "fin",      name: "Finance",          col: 0 },
    { id: "process",  name: "Process thinking", col: 0 },

    // Column 2: Roles
    { id: "gs",   name: "Goldman Sachs",  col: 1 },
    { id: "mba",  name: "Babson MBA",     col: 1 },
    { id: "pm",   name: "Ascendion PM",   col: 1 },

    // Column 3: What I noticed on the job
    { id: "ai_prod",  name: "AI in production",  col: 2 },
    { id: "regulated", name: "Regulated systems", col: 2 },
    { id: "discovery", name: "User discovery",    col: 2 },

    // Column 4: Papers
    { id: "paper1", name: "Language as Evidence",   col: 3 },
    { id: "paper2", name: "Verifier Pays Nothing",  col: 3 },

    // Column 5: PhD questions
    { id: "reliance",   name: "Appropriate reliance",   col: 4 },
    { id: "custom",     name: "End-user customization", col: 4 },
    { id: "assumption", name: "Hidden assumptions",     col: 4 }
  ],
  links: [
    // foundations → roles
    { source: "econ",    target: "gs",  value: 3 },
    { source: "econ",    target: "mba", value: 2 },
    { source: "fin",     target: "gs",  value: 3 },
    { source: "fin",     target: "mba", value: 3 },
    { source: "process", target: "gs",  value: 2 },
    { source: "process", target: "pm",  value: 3 },
    { source: "process", target: "mba", value: 1 },

    // roles → on-the-job observations
    { source: "gs",  target: "regulated", value: 3 },
    { source: "gs",  target: "ai_prod",   value: 1 },
    { source: "mba", target: "ai_prod",   value: 2 },
    { source: "mba", target: "regulated", value: 1 },
    { source: "mba", target: "discovery", value: 1 },
    { source: "pm",  target: "ai_prod",   value: 3 },
    { source: "pm",  target: "regulated", value: 2 },
    { source: "pm",  target: "discovery", value: 3 },

    // observations → papers
    { source: "ai_prod",   target: "paper1", value: 3 },
    { source: "regulated", target: "paper1", value: 2 },
    { source: "discovery", target: "paper1", value: 1 },
    { source: "ai_prod",   target: "paper2", value: 1 },
    { source: "regulated", target: "paper2", value: 2 },
    { source: "discovery", target: "paper2", value: 3 },

    // papers → PhD questions
    { source: "paper1", target: "reliance",   value: 3 },
    { source: "paper1", target: "assumption", value: 2 },
    { source: "paper2", target: "custom",     value: 3 },
    { source: "paper2", target: "assumption", value: 2 }
  ]
};

const COLORS = [
  "#b4472e", // accent
  "#d08b6d",
  "#8a9a5b",
  "#5b7a8a",
  "#6b5b8a"
];

function render() {
  const container = document.getElementById("sankey");
  if (!container) return;
  container.innerHTML = "";

  const width = container.clientWidth - 32;
  const height = 460;

  const svg = d3.select(container).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const sankey = d3.sankey()
    .nodeId(d => d.id)
    .nodeWidth(12)
    .nodePadding(16)
    .extent([[8, 8], [width - 8, height - 8]]);

  const graph = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  const colorFor = d => COLORS[d.col % COLORS.length];

  const link = svg.append("g")
    .selectAll("path")
    .data(graph.links)
    .join("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => d3.interpolateRgb(colorFor(d.source), colorFor(d.target))(0.5))
      .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}`);

  const node = svg.append("g")
    .selectAll("g")
    .data(graph.nodes)
    .join("g")
      .attr("class", "node");

  node.append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => Math.max(1, d.y1 - d.y0))
    .attr("fill", colorFor)
    .append("title").text(d => d.name);

  node.append("text")
    .attr("x", d => d.col === 4 ? d.x0 - 6 : d.x1 + 6)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.col === 4 ? "end" : "start")
    .text(d => d.name);

  function clear() {
    container.classList.remove("dim");
    link.classed("highlight", false);
    node.classed("highlight", false);
  }

  link.on("mouseenter", function (_, d) {
    tracePath([d]);
  }).on("mouseleave", clear);

  node.on("click", function (event, d) {
    event.stopPropagation();
    const connected = graph.links.filter(l =>
      reachableFrom(l, d, "forward") || reachableFrom(l, d, "backward")
    );
    tracePath(connected);
  });

  container.addEventListener("click", clear);

  function tracePath(links) {
    container.classList.add("dim");
    const nodeSet = new Set();
    links.forEach(l => { nodeSet.add(l.source.id); nodeSet.add(l.target.id); });
    link.classed("highlight", l => links.includes(l));
    node.classed("highlight", n => nodeSet.has(n.id));
  }

  function reachableFrom(link, node, dir) {
    const visited = new Set([node.id]);
    const stack = [node.id];
    while (stack.length) {
      const cur = stack.pop();
      for (const l of graph.links) {
        const [from, to] = dir === "forward" ? [l.source.id, l.target.id] : [l.target.id, l.source.id];
        if (from === cur && !visited.has(to)) {
          visited.add(to);
          stack.push(to);
        }
      }
    }
    return visited.has(link.source.id) && visited.has(link.target.id);
  }
}

let t;
window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(render, 150); });
document.addEventListener("DOMContentLoaded", render);
