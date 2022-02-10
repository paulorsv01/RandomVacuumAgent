// DIAGRAM.JS

const SIZE = 100;
const colors = {
    perceptBackground: 'hsl(240,10%,85%)',
    perceptHighlight: 'hsl(60,100%,90%)',
    actionBackground: 'hsl(0,0%,100%)',
    actionHighlight: 'hsl(150,50%,80%)'
};
class Diagram {
    constructor(world) {
        this.world = world;
    }
    xPosition(floorNumber) {
        return 150 + (floorNumber % (this.world.floors.length / 2)) * (600 / 2);
    }
    yPosition(floorNumber) {
        return floorNumber < (this.world.floors.length / 2) ? 550 : 50;
    }
}
class D3Graph {
}
function makeDiagram(selector) {
    let diagram = new Diagram(new RandomWorld(new CounterClockwiseAgent()));
    diagram.graph = buildGraph(selector, diagram);
    return diagram;
}
function buildGraph(selector, data) {
    const graph = new D3Graph();
    graph.root = d3.select(selector)
    graph.robot = graph.root.append('g')
        .attr('class', 'robot')
        .style('transform', `translate(${data.xPosition(data.world.agent.currentFloor.placement)}px,${data.yPosition(data.world.agent.currentFloor.placement) + 100}px)`);

    graph.robot.append('rect')
        .attr('width', SIZE)
        .attr('height', SIZE)
        .attr('fill', 'hsl(120,25%,50%)');

    graph.perceptText = graph.robot.append('text')
        .attr('x', SIZE / 2)
        .attr('y', SIZE / 2 + 20)
        .attr('text-anchor', 'middle');

    graph.actionText = graph.robot.append('text')
        .attr('x', SIZE / 2)
        .attr('y', SIZE / 2)
        .attr('text-anchor', 'middle');

    graph.floors = [];
    for (let floorNumber = 0; floorNumber < data.world.floors.length; floorNumber++) {
        graph.floors[floorNumber] =
            graph.root.append('rect')
                .attr('class', 'clean floor') // for css
                .attr('x', data.xPosition(floorNumber))
                .attr('y', data.yPosition(floorNumber))
                .attr('width', SIZE)
                .attr('height', SIZE / 4)
                .attr('stroke', 'black')
                .on('click', function () {
                    data.world.floors[floorNumber].isDirty = true;
                    graph.floors[floorNumber].attr('class', 'dirty floor');
                });
    }
    return graph;
}
/* Rendering functions read from the state of the world (diagram.world)
   and write to the state of the diagram (diagram.*). For most diagrams
   we only need one render function. For the vacuum cleaner example, to
   support the different styles (reader driven, agent driven) and the
   animation (agent perceives world, then pauses, then agent acts) I've
   broken up the render function into several. */
function renderWorld(diagram) {
    for (let floorNumber = 0; floorNumber < diagram.world.floors.length; floorNumber++) {
        diagram.graph.floors[floorNumber].attr('class', diagram.world.floors[floorNumber].isDirty ? 'dirty floor' : 'clean floor');
    }
    diagram.graph.robot.style('transform', `translate(${diagram.xPosition(diagram.world.agent.currentFloor.placement)}px,${diagram.yPosition(diagram.world.agent.currentFloor.placement) + (diagram.world.agent.currentFloor.placement < (diagram.numberOfFloors / 2) ? -SIZE : SIZE / 4)}px)`);
}
function renderAgentPercept(diagram, dirty) {
    let perceptLabel = { false: "It's clean", true: "It's dirty" }[dirty];
    diagram.graph.perceptText.text(perceptLabel);
}
function renderAgentAction(diagram, action) {
    let actionLabel = { 'SUCK': 'Vacuuming', 'MOVING': 'Moving...' }[action];
    diagram.graph.actionText.text(actionLabel);
}
/* Control the diagram by letting the AI agent choose the action. This
   controller is simple. Every STEP_TIME_MS milliseconds choose an
   action, simulate the action in the world, and draw the action on
   the page. */
const STEP_TIME_MS = 1000;
function makeAgentControlledDiagram() {
    let diagram = makeDiagram('#agent-controlled-diagram svg');
    function update() {
        makeRandomFloorDirty()
        
        let location = diagram.world.agent.currentFloor.placement;
        let percept = diagram.world.floors[location].isDirty ? 1 : 0;
        let action = percept == 1 ? 'SUCK' : 'MOVING';
        percept == 1 ? diagram.world.agent.suck() : diagram.world.agent.move()
        renderWorld(diagram);
        renderAgentPercept(diagram, percept);
        renderAgentAction(diagram, action);
    }
    function makeRandomFloorDirty() {
        if (Math.floor(Math.random() * 2) == 0) {
            let number = Math.floor(Math.random() * diagram.world.floors.length)
            if (number != diagram.world.agent.currentFloor.placement) {
                diagram.world.floors[number].isDirty = true;
                diagram.graph.floors[number].attr('class', 'dirty floor');
            }
        }
    }
    update();
    setInterval(update, STEP_TIME_MS);
}
makeAgentControlledDiagram();
