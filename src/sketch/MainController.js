import PhalanxRoot from '../core/PhalanxRoot'
import RootView from './RootView'
import { canvasSize, grid } from '../Config'

class MainController extends PhalanxRoot {
  constructor() {
    super()
  }
  setRootView() {
    this.rootView = new RootView(this)
  }
  setup() {
    this.canvas.style('position', 'absolute')
    this.p5.noLoop()
  }
  preDraw() {
    this.p5.clear()
  }
  postDraw() {

  }
  mousePressed() {
    console.log('Main mouse pressed')
  }
}

export default new MainController()