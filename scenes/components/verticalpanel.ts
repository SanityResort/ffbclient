import * as Comp from '.';

export class VerticalPanel extends Comp.LinearPanel {

    public redrawChildren(): void {
        super.redrawChildren();
        console.log("DEBUG: VerticalPanel#renderChildren - " + this.config.id)
        let bounds = this.getBounds(this.ctx);
        let childNumber = 0;
        let newWidth = 0;
        let offSet = 0;
        for (let c of this.children) {
            let renderContext: Comp.RenderContext = {
                scene: this.ctx.scene,
                parent: this,
                x: bounds.x,
                y: bounds.y,
                w: bounds.width,
                h: bounds.height,
                scale: this.ctx.scale,
            };
            c.setPositionOffset(0, offSet);
            c.setContext(renderContext);
            c.redraw();
            newWidth = Math.max( c.getWidthForParent() / this.ctx.scale, newWidth);
            offSet += c.getBounds(this.ctx).height / this.ctx.scale;
            childNumber++;
        }

        if (super.shouldAdjustSize() && this.children.length > 0) {
            this.config.width = newWidth;
            for (let c of this.children) {
                c.adjustWidthToParent(newWidth)
                c.redrawSelf();

            }
        }
    }
}