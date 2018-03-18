import { canvasSize, grid } from '../../Config'
import Line from '../../core/Line'
import View from '../../core/View'
import Color from '../../core/Color'
import State from '../../state'

export default class MenuText extends View {
  constructor(x, y, w, h) {
    super()
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = new Color(255, 0, 0)
    this.listenTo('mousePressed')
  }
  pointInView(x, y) {
    if (x >= this.x && 
        x <= this.x + this.w &&
        y >= this.y &&
        y <= this.y + this.h) return true
    return false
  }
  onEvent(evt) {
    switch (evt) {
      case 'mousePressed':
        if (this.pointInView(this.p5.mouseX, this.p5.mouseY)) {
          State.startEditing(State.EDITING_MODES.TEXT)
        }
        break
    }
  }
  draw() {
    if (State.isEditing && State.isTextEditingMode)
      this.color = new Color(0, 255, 0)
    else
      this.color = new Color(255, 0, 0)

    this.p5.noFill()
    this.p5.stroke(this.p5.color(...this.color.array))
    // this.p5.line(this.x + this.w / 2, this.y, this.x + this.w / 2, this.y + this.h)
    // this.p5.line(this.x, this.y + this.h / 2, this.x + this.w, this.y + this.h / 2)
    this.p5.textSize(1.5 * grid.pointDistance)
    this.p5.textFont(this.root.fonts.fugueRegular)
    this.p5.text('t', this.x + grid.pointDistance / 6, this.y + this.h)
  }
}