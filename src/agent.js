class RandomWorld {
    constructor(agent) {
        this.floors = [];
        Object.values(ObjectFloorLocation).forEach((floorNumber) => {
            this.floors.push(new Floor(floorNumber));
        });
        this.floors.forEach((floor) => {
            floor.neighbors = this.getNeighbors(floor.placement);
        });
        this.agent = agent;
        agent.currentFloor = this.floors[0];
    }
    getNeighbors(floor) {
        switch (floor) {
            case ObjectFloorLocation.TopLeft:
                return [this.floors[ObjectFloorLocation.BottomLeft], this.floors[ObjectFloorLocation.TopRight]];
            case ObjectFloorLocation.TopRight:
                return [this.floors[ObjectFloorLocation.TopLeft], this.floors[ObjectFloorLocation.BottomRight]];
            case ObjectFloorLocation.BottomLeft:
                return [this.floors[ObjectFloorLocation.BottomRight], this.floors[ObjectFloorLocation.TopLeft]];
            case ObjectFloorLocation.BottomRight:
                return [this.floors[ObjectFloorLocation.TopRight], this.floors[ObjectFloorLocation.BottomLeft]];
        }
    }
}
class Floor {
    constructor(location) {
        this.isDirty = false;
        this.placement = location;
    }
}
class Agent {
}
class CounterClockwiseAgent extends Agent {
    suck() {
        this.currentFloor.isDirty = false;
    }
    move() {
        this.currentFloor = this.currentFloor.neighbors[0];
    }
}
const ObjectFloorLocation = {
    TopLeft: 0,
    TopRight: 1,
    BottomLeft: 2,
    BottomRight: 3, // 3, vai para 1 e 2
};