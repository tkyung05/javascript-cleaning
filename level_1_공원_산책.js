// 프로그래머스 level 1 - 공원 산책 172928

'use strict'

class Park {
    static DIRECTION = { 
        N: { Y: -1, X: 0 },
        S: { Y: 1, X: 0 },
        W: { Y: 0, X: -1 },
        E: { Y: 0, X: 1 },
    };
    static SPOT = {
        START: 'S',
        ROAD: 'O',
        OBSTRACLE: 'X',
    };
    
    #map;
    #height;
    #width;
    
    constructor(map) {
        this.#map = map;
        this.#height = map.length;
        this.#width = map[0].length;
    }
    
    get height() {
        return this.#height;
    }
    
    get width() {
        return this.#width;
    }
    
    getSpot(positionY, positionX) {
        return this.#map[positionY][positionX];
    }
    
    getStartPosition() {
        let position = null;
        
        this.#map.some((row, y) => {
						const x = row.indexOf(Park.SPOT.START);

						if (x !== -1) {
							return position = { y, x };
						};
	    	});
			
	    	return position;
    }
}

class Dog {
    #position;
    
    constructor(position) {
        this.#position = position;
    }
    
    get position() {
        return this.#position;
    }
    
    move(direction, steps) {
        this.position.y += direction.Y * steps;
        this.position.x += direction.X * steps;
    }
}

class Walk {
    #target;
    #place;
    
    constructor(target) {
        this.#target = target;
    }
    
    placeAt(place) {
        this.#place = place;
    }
    
    simulate(direction, steps) {        
        for (let step = 1; step <= steps; step++) {
            const destinationY = this.#target.position.y + (direction.Y * step);
            const destinationX = this.#target.position.x + (direction.X * step);
                        
            if (destinationY >= this.#place.height || destinationX >= this.#place.width 
|| destinationY < 0 || destinationX < 0) return false;
                
            if (this.#place.getSpot(destinationY, destinationX) === Park.SPOT.OBSTRACLE) return false;
        };
                
        return true;
    }
}

function solution(map, routes) {
    const park = new Park(map);
    const dog = new Dog( park.getStartPosition() );
    const walk = new Walk(dog);
    
    walk.placeAt(park);
    
    routes.forEach((route) => {
	    const direction = Park.DIRECTION[route[0]];
        const steps = Number(route[2]);
                
        const isMovable = walk.simulate(direction, steps);        
        
        if (isMovable) {
            dog.move(direction, steps);
        };
    });
    
    return [dog.position.y, dog.position.x];
}

