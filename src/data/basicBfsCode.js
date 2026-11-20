// Generated from TraBfsExample.java. Edit the Java source, then run npm run sync:java-snippets.
export const basicBfsCode = `public static Result search(AbstractGraph graph, Vertex start) {
    requireStart(graph, start);
    Result result = new Result();
    for (Vertex vertex : graph.vertices()) {
        vertex.setColor(AbstractGraph.WHITE);
        result.distance.put(vertex, -1);
    }
    if (start == null) {
        return result; // The graph is empty.
    }

    LinkedQueue<Vertex> queue = new LinkedQueue<>();
    start.setColor(AbstractGraph.GREY);
    result.distance.put(start, 0);
    result.discovered.add(start);
    queue.offer(start);

    while (!queue.isEmpty()) {
        Vertex vertex = queue.remove();
        // Removing the vertex from the queue does not finish processing it: still GREY.
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == AbstractGraph.WHITE) {
                next.setColor(AbstractGraph.GREY); // Mark before enqueueing: no duplicates.
                result.distance.put(next, result.distance.get(vertex) + 1);
                result.parent.put(next, vertex);
                result.discovered.add(next);
                queue.offer(next);
            }
        }
        vertex.setColor(AbstractGraph.BLACK); // All neighbours are now examined.
    }
    return result;
}`
