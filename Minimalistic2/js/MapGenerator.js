class MapGenerator {
    constructor(data) {
        this.seed = Date.now();
        this.floorMakers = [];

        this.floorMakerParameters = {
            movements: [{
                    angle: 0,
                    weight: 8
                }, {
                    angle: -Math.PI / 2,
                    weight: 3
                },
                {
                    angle: Math.PI / 2,
                    weight: 3
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
                weight: 5
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
            }, {
                size: {
                    x: 5,
                    y: 5
                },
                weight: 1
            }],
            maxTiles: 400,
            childCreation: {
                1: 0.2,
                2: 0.05,
                3: 0.01,
                4: 0.001
            },
            childDestroy: {
                2: 0.05,
                3: 0.01,
                4: 0.001,
                5: 0.0001
            },
            ennemies: {
                rate: 0.05,
                minDistance: 5,
                types: {
                    "spider": 8,
                    "cat": 10,
                    "prout": 1
                }
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

    distance(x0, y0, x1, y1) {
        return Math.round(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
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

        var spawn = null;

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
                this.setWeightedRoom(map, floorMaker.x, floorMaker.y, world);

                if (spawn == null) {
                    spawn = {
                        x: floorMaker.x,
                        y: floorMaker.y
                    };
                }

                if (this.nbFloor(map) > this.floorMakerParameters.maxTiles) {
                    this.cropMap(map, world);
                    spawn = this.cropPosition(spawn.x, spawn.y, world)
                    map[spawn.x][spawn.y] = {
                        spawn
                    };
                    this.spawnEnnemies(map, spawn);
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

                //destroy child
                if (this.floorMakerParameters.childDestroy[this.floorMakers.length]) {
                    if (this.seededRandom() < this.floorMakerParameters.childDestroy[this.floorMakers.length]) {
                        this.floorMakers.splice(i, 1);
                        i--;
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

        var random = Math.floor(this.seededRandom(totalWeight + 1));
        var tmpWeight = 0;
        for (var direction of this.floorMakerParameters.movements) {
            tmpWeight += direction.weight;
            if (random <= tmpWeight) {
                return direction.angle
            }
        }
        return 0;
    }

    setWeightedRoom(map, x, y, world) {
        var totalWeight = 0;
        for (var room of this.floorMakerParameters.rooms) {
            totalWeight += room.weight;
        }

        var size = {
            x: 1,
            y: 1
        }

        var random = Math.floor(this.seededRandom(totalWeight + 1));
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
                var tileX = x + dx;
                var tileY = y + dy;
                if (world.minx > tileX) {
                    world.minx = tileX;
                }

                if (world.miny > tileY) {
                    world.miny = tileY;
                }

                if (world.maxx < tileX) {
                    world.maxx = tileX;
                }

                if (world.maxy < tileY) {
                    world.maxy = tileY;
                }
                if (map[tileX][tileY] == 1) {
                    map[tileX][tileY] = 0;
                }
            }
        }
    }

    spawnEnnemies(map, spawn) {
        var totalWeight = 0;
        for (var type in this.floorMakerParameters.ennemies.types) {
            totalWeight += this.floorMakerParameters.ennemies.types[type];
        }

        var getType = (weight) => {
            var tmpWeight = 0;
            for (var type in this.floorMakerParameters.ennemies.types) {
                tmpWeight += this.floorMakerParameters.ennemies.types[type];
                if (tmpWeight >= weight) {
                    return type;
                }
            }
            return null;
        }


        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if (map[i][j] == 0) {
                    if (this.distance(i, j, spawn.x, spawn.y) >= this.floorMakerParameters.ennemies.minDistance) {
                        if (this.seededRandom() < this.floorMakerParameters.ennemies.rate) {
                            var random = Math.floor(this.seededRandom(totalWeight + 1));
                            map[i][j] = {
                                ennemy: getType(random)
                            };
                        }
                    }
                }
            }
        }
    }

    cropMap(map, world) {
        map.splice(0, world.minx - 1);
        map.splice(world.maxx - world.minx + 3);
        for (var x in map) {
            map[x].splice(0, world.miny - 1);
            map[x].splice(world.maxy - world.miny + 3);
        }
        return map;
    }

    cropPosition(x, y, world) {
        x -= world.minx - 1;
        y -= world.miny - 1;

        return {
            x,
            y
        };
    }
}