import { canvasSize, grid } from '../Config'
import View from './View'
import Color from './Color'
import { colors, strokes } from '../Config.js'

export default class Rect extends View {
  static get serializableAttributes() {
    return ['x', 'y', 'width', 'height', 'dx', 'dy']
  }
  static FromSerialized(obj) {
    return View.FromSerialized(Rect, obj)
  }
  static Serialize(obj) {
    return View.Serialize(Rect, obj)
  }
  static get className() { return 'Rect' }
  constructor(x, y, w, h, dx, dy) {
    super()
    this._x = x
    this._y = y
    this._width = w
    this._height = h
    this.dx = dx || 0
    this.dy = dy || 0
    this._color = new Color(colors.lines)
    this._fillColor = new Color(colors.boxFill)
    this._highlightColor = new Color(colors.editHighlight)
  }
  serialize() {
    return Rect.Serialize(this)
  }
  duplicate() {
    return new Rect(this._x, this._y, this._width, this._height, this.dx, this.dy)
  }
  get checksOffscreen() { return true }
  get isRect() { return true }
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
  get left() {
    let minX = Math.min(this.x, this.x + this.width)
    if (this.dx <= 0) minX = minX + this.dx
    return minX
  }
  get right() {
    let maxX = Math.max(this.x, this.x + this.width)
    if (this.dx > 0) maxX = maxX + this.dx
    return maxX
  }
  get top() {
    let minY = Math.min(this.y, this.y + this.height)
    if (this.dy <= 0) minY = minY + this.dy
    return minY
  }
  get bottom() {
    let maxY = Math.max(this.y, this.y + this.height)
    if (this.dy > 0) maxY = maxY + this.dy
    return maxY
  }
  pointInView(x, y) {
    // let minX = Math.min(this.x, this.x + this.width), maxX = Math.max(this.x, this.x + this.width)
    // let minY = Math.min(this.y, this.y + this.height), maxY = Math.max(this.y, this.y + this.height)
    // if (this.dx <= 0) minX = minX - this.dx
    // else maxX = maxX + this.dx
    // if (this.dy <= 0) minY = minY - this.dy
    // else maxY = maxY + this.dy

    if (x >= this.left && x <= this.right &&
        y >= this.top && y <= this.bottom) return true
    return false
  }
  draw() {
    // this.p5.stroke(this.p5.color(this.color.r, this.color.g, this.color.b))
    this.p5.strokeWeight(strokes.weight)
    this.p5.strokeJoin(this.p5.ROUND)
    this.p5.stroke(this.p5.color(...this.color.array))
    this.p5.rect(this.x, this.y, this.width, this.height)
    if (this.dx || this.dy) {
      this.p5.fill(this.p5.color(...this._fillColor.array))
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
    if (this.highlight) {
      const h = {
        x: this.left - grid.pointDistance,
        y: this.top - grid.pointDistance,
        w: this.right - this.left + 2 * grid.pointDistance,
        h: this.bottom - this.top + 2 * grid.pointDistance
      }
      this.p5.noStroke()
      this.p5.fill(this.p5.color(...this._highlightColor.array))
      this.p5.rect(h.x, h.y, h.w, h.h)
    }
  }
}