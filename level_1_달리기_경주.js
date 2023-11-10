// 프로그래머스 level 1 - 달리기 경주  178871

'use strict'

class Commentator {
    static #PLAYERS;
    static #PLAYER_MAP;
    
    static initialize(players) {
        this.#PLAYERS = players;
        this.#PLAYER_MAP = new Map(players.map((name, sequence) => [name, sequence]));
    }
    
    static getPlayers() {
        return this.#PLAYERS;
    }
    
    static getPlayerSequence(name) {
        return this.#PLAYER_MAP.get(name);
    }
    
    static #setPlayer(name, sequence) {
        this.#PLAYERS[sequence] = name;
        this.#PLAYER_MAP.set(name, sequence);
    }

    static callPlayer(name, sequence) {
        const overtakedName = this.#PLAYERS[sequence - 1];
        
        this.#setPlayer(name, sequence - 1);
        this.#setPlayer(overtakedName, sequence);
    }
}

function solution(players, callings) {
    Commentator.initialize(players);
    
    callings.forEach((playerName) => {
        const playerSequence = Commentator.getPlayerSequence(playerName);
        
        Commentator.callPlayer(playerName, playerSequence);
    });
    
    return players;
}