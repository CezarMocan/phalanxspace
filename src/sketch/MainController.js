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
  preload() {
    this.fonts = {}
    this.fonts.fugueRegular = this.p5.loadFont('assets/fugue-regular.ttf')
    this.fonts.fugueMono = this.p5.loadFont('assets/fugue_mono.ttf')
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
  getContentsOriginal() {
    return this.rootView.dynamicContent.children
  }
  getContents() {
    return this.rootView.dynamicContent.children.slice(0)
  }
  getAndClearContents() {
    let childrenToEdit = []
    const currentChildren = this.rootView.dynamicContent.children.slice(0)
    this.rootView.dynamicContent.children.forEach(child => childrenToEdit.push(child.duplicate()))
    this.rootView.dynamicContent.removeAll()
    return {
      childrenToEdit: childrenToEdit,
      oldChildren: currentChildren
    }
  }
  setContents(viewArray) {
    this.rootView.dynamicContent.removeAll()
    viewArray.forEach(view => this.rootView.dynamicContent.addView(view))
  }
  onDoneEditing() {
    this.refresh()
  }
  refresh() {
    this.p5.clear()
    this.redraw()
  }
  updateScrollPosition(offsetX, offsetY) {
    this.rootView.updateScrollPosition(offsetX, offsetY)
  }
}

export default new MainController()