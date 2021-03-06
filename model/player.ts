import * as Model from ".";
import { Coordinate } from "../types";

export enum PlayerState {
   Unknown          = 0x0000,
   Standing         = 0x0001,
   Moving           = 0x0002,
   Prone            = 0x0003,
   Stunned          = 0x0004,
   Knocked_out      = 0x0005,
   Badly_hurt       = 0x0006,
   Serious_injury   = 0x0007,
   Rip              = 0x0008,
   Reserve          = 0x0009,
   Missing          = 0x000a,
   Falling          = 0x000b,
   Blocked          = 0x000c,
   Banned           = 0x000d,
   Exhausted        = 0x000e,
   Being_dragged    = 0x000f,
   Picked_up        = 0x0010,
   Hit_by_fireball  = 0x0011,
   Hit_by_lightning = 0x0012,
   Hit_by_bomb      = 0x0013,
   _bit_active      = 0x0100,
   _bit_confused    = 0x0200,
   _bit_rooted      = 0x0400,
   _bit_hypnotized  = 0x0800,
   _bit_bloodlust   = 0x1000,
   _bit_used_pro    = 0x2000,
}

export type IconState = {
    alpha: number,
    angle: number,
    frameOffset: number,
    visible: boolean,
}

export enum Side {
    Home,
    Away
}

export class Player {
    private team: Model.Team;
    private id: string;
    public number: number;
    public name: string;
    public positionId: string;
    public movement: number;
    public strength: number;
    public agility: number;
    public armour: number;
    public icon: Phaser.GameObjects.Sprite;
    public state: PlayerState;
    private flags: PlayerState;
    public coordinate: Coordinate;
    public positionIcon: number;
    private side: Side;
    private spp: number;
    private gameSpp: number;
    private portrait: string;
    private skills: string[];

    public constructor(team: Model.Team, data: FFB.Protocol.Messages.PlayerType) {
        this.team = team;
        this.id = data.playerId;
        this.number = data.playerNr;
        this.name = data.playerName;
        this.positionId = data.positionId;
        this.movement = data.movement;
        this.strength = data.strength;
        this.agility = data.agility;
        this.armour = data.armour;
        this.positionIcon = data.positionIconIndex;
        this.portrait = data.urlPortrait;
        this.skills = data.skillArray;

        this.state = PlayerState.Unknown;
    }

    public getId(): string {
        return this.id;
    }

    public getSkills(): string[] {
        return this.skills;
    }

    public getTeam(): Side {
        return this.side;
    }

    public setTeam(side: Side) {
        this.side = side;
    }

    public setSpp(spp: number) {
        this.spp = spp;
    }

    public getSpp(): number {
        return this.spp;
    }

    public setGameSpp(spp: number) {
        this.gameSpp = spp;
    }

    public getGameSpp(): number {
        return this.gameSpp;
    }

    public getPosition(): Model.Position {
        return this.team.getRoster().getPosition(this.positionId);
    }

    public getBaseIconFrame(): number {
        return 4 * this.positionIcon + (this.side == Side.Away ? 2 : 0);
    }

    public getPortrait(): string {
        return this.portrait;
    }

    public getState(): PlayerState {
        return this.state;
    }

    public getFlags(): PlayerState {
        return this.flags;
    }

    public setState(state: PlayerState) {
        this.state = state & 0xff;
        this.flags = state & ~0xff;
    }

    public getLocation(): Coordinate {
        return this.coordinate;
    }

    public setLocation(coordinate: Coordinate) {
        let oldCoordinate = this.coordinate;
        this.coordinate = coordinate;
        this.team.Game.updatePlayerLocation(this, oldCoordinate, coordinate);
    }

    public isActive(): boolean {
        return (this.flags & PlayerState._bit_active) > 0;
    }

    public isOnField(): boolean {
        return this.coordinate.isOnField();
    }

    public getAssets() {
        let assets = {
            graphics: [ ],
            sprites: [ ],
        };

        if (this.portrait != null) {
            assets.graphics.push(this.portrait);
        }

        return assets;
    }

    public getIconState(): IconState {
        let result: IconState = {
            alpha: 0,
            angle: 0,
            frameOffset: 0,
            visible: false
        };

        switch(this.getState()) {
            case Model.PlayerState.Prone:
                result.angle = -90;
                result.frameOffset = 1;
                break;
            case Model.PlayerState.Stunned:
                result.angle = 90;
                result.frameOffset = 1;
                break;
            case Model.PlayerState.Moving:
                result.angle = 0;
                result.frameOffset = 1;
                break;
            case Model.PlayerState.Falling:
                result.angle = 90;
                result.frameOffset = 0;
                break;
            default:
                result.angle = 0;
                result.frameOffset = 0;
                break;
        }

        let flags = this.getFlags();

        if (flags & Model.PlayerState._bit_active) {
            result.alpha = 1;
        } else {
            result.alpha = 0.5;
        }

        if (this.getTeam() == Model.Side.Away) {
            result.angle = -result.angle;
        }

        result.visible = true; //player.isOnField();

        return result;
    }    
}
