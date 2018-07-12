import * as Model from ".";

export class Roster {
    private id: string;
    private name: string;
    private positions:{[key: string]: Model.Position};

    public constructor(data: FFB.Protocol.Messages.RosterType) {
        this.id = data.rosterId;
        this.name = data.rosterName;

        this.positions = {};
        for (let position of data.positionArray) {
            this.positions[position.positionId] = new Model.Position(position);
        }
    }

    public getPositions(): {[key: string]: Model.Position} {
        return this.positions;
    }

    public getPosition(key: string): Model.Position {
        return this.positions[key];
    }

    public getAssets() {
        let assets = {
            graphics: [],
            sprites: []

        };

        for (let position in this.positions) {
            let positionAssets = this.positions[position].getAssets();

            for (let sprite in positionAssets['sprites']) {
                assets['sprites'].push(positionAssets['sprites'][sprite]);
            }
        }

        return assets;
    }
}