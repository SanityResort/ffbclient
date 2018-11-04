import * as Comp from ".";
import {Size} from ".";

export class Label extends Comp.UIComponent {
    private text: string;
    private textObject: Phaser.GameObjects.Text;
    private stroke: number;
    private fontSize: number;
    private numRows: number;

    public constructor(config: Comp.ComponentConfiguration) {
        super(config);

        this.text = config.text;
        this.stroke = 0;
        this.fontSize = -1;
        this.numRows = this.text ? this.text.split("\n").length : 1;
    }

    public create(): Phaser.GameObjects.GameObject {
        this.textObject = this.ctx.scene.make.text({});
        this.textObject.setFontFamily("arial");
        if (this.stroke > 0) {
            this.textObject.setStroke("#000000", this.stroke);
        }

        return this.textObject;
    }

    public destroy(): void {
        this.textObject.destroy();
    }

    public show() {
        if (this.textObject != null) {
            this.textObject.visible = true;
        }
    }

    public hide() {
        if (this.textObject != null) {
            this.textObject.visible = false;
        }
    }

    public redrawSelfBeforeChildren(): void {
        super.redrawSelfBeforeChildren();
        
        this.config.width = 0;
        let col = this.numberToRGBString(this.config.color);
        let bg = this.numberToRGBString(this.config.background);
        let bounds = this.getBounds(this.ctx);
        let g = this.textObject;

        let rows = this.numRows;
        if (rows < 1) {
            rows = 1;
        }
        let fontSize = Math.floor(bounds.height * 0.9) / rows;
        if (fontSize != this.fontSize) {
            g.setFontSize(fontSize);
            this.fontSize = fontSize;
        }
        g.setColor(col);
        if (g.text != this.text) {
            g.setText(this.text);
        }
        g.setBackgroundColor(bg);

        this.config.width = g.displayWidth + "px";
        bounds = this.getBounds(this.ctx);

        g.setPosition(bounds.x, bounds.y);
    }

    public setStroke(width: number) {
        this.stroke = width;
    }

    public setText(text: string) {
        this.text = text;

        let g = this.textObject;
        if (g && text != null) {
            this.numRows = text.split("\n").length;
            g.setText(text);
            this.config.width = g.displayWidth + "px";
            let bounds = this.getBounds(this.ctx);
            g.setPosition(bounds.x, bounds.y);
        }
    }

    public adjustWidthToParent(width: Size) {
        return super.adjustWidthToParent(width);
    }
}
