import { canvasSize, grid } from '../Config'
import View from '../core/View'
import GridHighlight from './GridHighlight'
import Canvas from './Canvas'

export default class RootView extends View {
  constructor(phalanxRoot) {
    super()  
    this.root = phalanxRoot
    this.setup()
  }
  setup() {
    this.canvasView = this.addView(new Canvas())
    this.gridHighlight = this.addView(new GridHighlight())    
  }
  reset() {
    if (this.canvasView) {
      this.canvasView.stop()
      this.removeView(this.canvasView)
    }
    if (this.gridHighlight) this.removeView(this.gridHighlight)
    this.setup()
  } 
  onChangeEditingMode() {
    this.canvasView.reset()
  }
  draw() {
    this.p5.clear()
    this.p5.background('rgba(255, 0, 0, 0.05)')
  }
  updateScrollPosition(offsetX, offsetY) {
    this.canvasView.x = offsetX
    this.canvasView.y = offsetY
    this.gridHighlight.x = offsetX
    this.gridHighlight.y = offsetY
    this.p5.clear()
    this.redraw()
  }
  onPaste(pastedText) {
    if (this.canvasView) {
      this.canvasView.onPaste(pastedText)
    }
  }
}