class MapGenerator {
    constructor(data) {
        this.seed = Date.now();
        this.floorMakers = [];

        this.floorMakerParameters = {
            movements: [{
                    angle: 0,
                    weight: 5
                }, {
                    angle: -Math.PI / 2,
                    weight: 2
                },
                {
                    angle: Math.PI / 2,
                    weight: 2
                },
                {
                    angle: Math.PI,
                    weight: 1
                }
            ],
            rooms: [{
                size: {
                    x: 1,
                    y: 1
                },
                weight: 8
            }, {
                size: {
                    x: 2,
                    y: 2
                },
                weight: 3
            }, {
                size: {
                    x: 3,
                    y: 3
                },
                weight: 1
            }],
            maxTiles: 110,
            childCreation: {
                1: 0.2,
                2: 0.05,
                3: 0.01,
                4: 0.001
            },
            childDestroy: {

            }
        };

        this.init(data);
    }

    init(data) {
        for (var i in data) {
            this[i] = data[i];
        }
    }

    seededRandom(max = 1, min = 0) {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return min + rnd * (max - min);
    }

    generateDefaultMap(width, height) {
        var map = [];
        for (var i = 0; i < width; i++) {
            map[i] = [];
            for (var j = 0; j < height; j++) {
                map[i][j] = 1;
            }
        }
        return map;
    }

    generateMap() {
        var start = Date.now();
        var map = this.generateDefaultMap(1000, 1000);

        var firstFloorMaker = {
            x: Math.floor(map.length / 2),
            y: Math.floor(map[0].length / 2),
            angle: this.getRandomDirection()
        };


        this.floorMakers.push(firstFloorMaker);

        var world = {
            minx: firstFloorMaker.x,
            maxx: firstFloorMaker.x,
            miny: firstFloorMaker.y,
            maxy: firstFloorMaker.y
        }

        while (true) {
            for (var i = 0; i < this.floorMakers.length; i++) {
                var floorMaker = this.floorMakers[i];

                floorMaker.angle += this.getweightedDirection();
                floorMaker.x += Math.round(Math.cos(floorMaker.angle));
                floorMaker.y += Math.round(Math.sin(floorMaker.angle));
                this.setWeightedRoom(map, floorMaker.x, floorMaker.y);

                if(this.nbFloor(map) > this.floorMakerParameters.maxTiles){
        console.log("over", Date.now() - start);
                    return map;
                }

                //Spawn child
                if (this.floorMakerParameters.childCreation[this.floorMakers.length]) {
                    if (this.seededRandom() < this.floorMakerParameters.childCreation[this.floorMakers.length]) {
                        this.floorMakers.push({
                            x: floorMaker.x,
                            y: floorMaker.y,
                            child: true,
                            angle: this.getRandomDirection()
                        });
                    }
                }
            }
        }
    }

    getRandomDirection() {
        var direction = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
        return direction[Math.floor(this.seededRandom(direction.length))];
    }

    nbFloor(map) {
        var nb = 0;

        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if (map[i][j] != 1) {
                    nb++;
                }
            }
        }

        return nb;
    }

    getweightedDirection() {
        var totalWeight = 0;
        for (var direction of this.floorMakerParameters.movements) {
            totalWeight += direction.weight;
        }

        var random = Math.floor(this.seededRandom(totalWeight));
        var tmpWeight = 0;
        for (var direction of this.floorMakerParameters.movements) {
            tmpWeight += direction.weight;
            if (random <= tmpWeight) {
                return direction.angle
            }
        }
        return 0;
    }

    setWeightedRoom(map, x, y) {
        var totalWeight = 0;
        for (var room of this.floorMakerParameters.rooms) {
            totalWeight += room.weight;
        }

        var size = {
            x: 1,
            y: 1
        }

        var random = Math.floor(this.seededRandom(totalWeight));
        var tmpWeight = 0;
        for (var room of this.floorMakerParameters.rooms) {
            tmpWeight += room.weight;
            if (random <= tmpWeight) {
                size = room.size;
                break;
            }
        }

        var center = {
            x: Math.floor(size.x / 2),
            y: Math.floor(size.y / 2),
        }

        for (var i = 0; i < size.x; i++) {
            for (var j = 0; j < size.y; j++) {
                var dx = i - center.x;
                var dy = j - center.y;
                map[x + dx][y + dy] = 0;
            }
        }
    }
}