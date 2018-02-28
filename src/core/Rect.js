import View from './View'
import Color from './Color'

export default class Rect extends View {
  constructor(x, y, w, h, dx, dy) {
    super()
    this._x = x
    this._y = y
    this._width = w
    this._height = h
    this.dx = dx || 0
    this.dy = dy || 0
    this._color = new Color(0, 0, 255)
  }
  get x() { return this._x }
  get y() { return this._y }
  get width() { return this._width }
  get height() { return this._height }
  get nx() { return Math.min(this._x, this._x + this.width) }
  get ny() { return Math.min(this._y, this._y + this.height) }
  get nwidth() { return Math.abs(this._width) }
  get nheight() { return Math.abs(this._height) }
  set x(x) { this._x = x }
  set y(y) { this._y = y }
  set width(w) { this._width = w }
  set height(h) { this._height = h }
  get color() { return this._color }
  set color(c) { this._color = c }
  pointInView(x, y) {
    let minX = Math.min(this.x, this.x + this.width), maxX = Math.max(this.x, this.x + this.width)
    let minY = Math.min(this.y, this.y + this.height), maxY = Math.max(this.y, this.y + this.height)
    if (this.dx <= 0) minX = minX - this.dx
    else maxX = maxX + this.dx
    if (this.dy <= 0) minY = minY - this.dy
    else maxY = maxY + this.dy

    console.log(minX, maxX, minY, maxY)

    if (x >= minX && x <= maxX &&
        y >= minY && y <= maxY) return true
    return false
  }
  draw() {
    // this.p5.stroke(this.p5.color(this.color.r, this.color.g, this.color.b))
    this.p5.stroke(this.p5.color(...this.color.array))
    this.p5.rect(this.x, this.y, this.width, this.height)
    if (this.dx || this.dy) {
      this.p5.fill(this.p5.color(...this.color.array))
      const offsetX = this.dx < 0 ? 0 : this.nwidth
      const offsetY = this.dy < 0 ? 0 : this.nheight
      // OX depth
      this.p5.beginShape()
      this.p5.vertex(offsetX + this.nx, this.ny)
      this.p5.vertex(offsetX + this.nx + this.dx, this.ny + this.dy)
      this.p5.vertex(offsetX + this.nx + this.dx, this.ny + this.nheight + this.dy)
      this.p5.vertex(offsetX + this.nx, this.ny + this.nheight)
      this.p5.endShape(this.p5.CLOSE)
      // OY depth
      this.p5.beginShape()
      this.p5.vertex(this.nx, offsetY + this.ny)
      this.p5.vertex(this.nx + this.dx, offsetY + this.ny + this.dy)
      this.p5.vertex(this.nx + this.nwidth + this.dx, offsetY + this.ny + this.dy)
      this.p5.vertex(this.nx + this.nwidth, offsetY + this.ny)
      this.p5.endShape(this.p5.CLOSE)
    }
  }
}