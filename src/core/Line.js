import View from './View'
import Color from './Color'
import MathUtils from './MathUtils'
import { colors, strokes } from '../Config.js'

export default class Line extends View {
  static get serializableAttributes() {
    return ['x', 'y', 'x2', 'y2']
  }
  static FromSerialized(obj) {
    return View.FromSerialized(Line, obj)
  }
  static Serialize(obj) {
    return View.Serialize(Line, obj)
  }
  static get className() { return 'Line' }
  constructor(x, y, x2, y2) {
    super()
    this._x = x
    this._y = y
    this._width = x2 - x
    this._height = y2 - y
    this._color = new Color(colors.lines)
    this._highlightColor = new Color(colors.editHighlight)
    this.actionRadius = 15
  }
  serialize() {
    return Line.Serialize(this)
  }
  get checksOffscreen() { return true }
  get x() { return this._x }
  set x(x) { this._x = x }
  get y() { return this._y }
  set y(y) { this._y = y }
  get x2() { return this._x + this._width }
  set x2(x) { this._width = x - this._x }
  get y2() { return this._y + this._height }
  set y2(y) { this._height = y - this._y }
  get width() { return this._width }
  set width(w) { this._width = w }
  get height() { return this._height }
  set height(h) { this._height = h }
  duplicate() {
    return new Line(this.x, this.y, this.x2, this.y2)
  }
  get color() { return this._color }
  set color(c) { this._color = c }
  pointInView(x, y) {
    const distance = MathUtils.distToSegment(
      { x: x, y: y },
      { x: this.x, y: this.y },
      { x: this.x2, y: this.y2 }
    )
    if (distance <= this.actionRadius) return true
    return false
  }
  draw() {
    this.p5.noFill()
    this.p5.strokeWeight(strokes.weight)
    this.p5.stroke(this.p5.color(...this.color.array))    
    this.p5.line(this.x, this.y, this.x2, this.y2)

    if (this.highlight) {
      this.p5.push()
      this.p5.strokeWeight(this.actionRadius)
      this.p5.noFill()
      this.p5.stroke(this.p5.color(...this._highlightColor.array))
      this.p5.line(this.x, this.y, this.x2, this.y2)
      this.p5.pop()
    }
  }
}