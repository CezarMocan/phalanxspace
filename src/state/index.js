import api from '../api/api.js'
import Line from '../core/Line.js'
import Text from '../core/Text.js'
import Rect from '../core/Rect.js'
import ImageRect from '../core/ImageRect.js'
import ImagePool from './ImagePool.js'
import { setCoordinates, setVersionNumber } from '../menu'
import router from '../router'
import { getAbsoluteURL } from '../utils'

const EDITING_MODES = {
  LINE: 'LINE',
  BOX: 'BOX',
  MOVE: 'MOVE',
  REMOVE: 'REMOVE',
  IMAGE: 'IMAGE',
  TEXT: 'TEXT'
}

class GlobalState {
  constructor() {
    this._state = {
      editing: false,
      editingMode: null,
      version: 0
    }
    this._editController = null
    this.onSaveDone = this.onSaveDone.bind(this)
    this.onSaveFailed = this.onSaveFailed.bind(this)
    this.scrollOffset = {
      x: 0,
      y: 0
    }
  }
  registerEditController(c) {
    this._editController = c
  }
  registerMenuController(c) {
    this._menuController = c
  }
  registerMainController(c) {
    this._mainController = c
  }
  registerGridController(c) {
    this._gridController = c
  }
  get version() { return this._state.version }
  set version(v) { 
    this._state.version = v
    setVersionNumber(v)
    // if (this._menuController)
    //   this._menuController.setVersion(v)
  }
  get EDITING_MODES() {
    return EDITING_MODES
  }
  get isEditing() { return this._state.editing }
  get isLineEditingMode() { return this._state.editingMode === this.EDITING_MODES.LINE }
  get isBoxEditingMode() { return this._state.editingMode === this.EDITING_MODES.BOX }
  get isMoveEditingMode() { return this._state.editingMode === this.EDITING_MODES.MOVE }
  get isRemoveEditingMode() { return this._state.editingMode === this.EDITING_MODES.REMOVE }
  get isImageEditingMode() { return this._state.editingMode === this.EDITING_MODES.IMAGE }
  get isTextEditingMode() { return this._state.editingMode === this.EDITING_MODES.TEXT }

  // pointInMenu(x, y) { return this._menuController.pointInMenu(x, y) }
  
  startEditing(editingMode) {
    if (!this._state.editing) {
      this._state.editing = true
      this._state.editingMode = editingMode

      this._editController.onStartEditing()
      // this._menuController.onStartEditing()

      this.currentContents = this._mainController.getAndClearContents()
      this._editController.setContents(this.currentContents.childrenToEdit)
      this._editController.updateScrollPosition(this.scrollOffset.x, this.scrollOffset.y)
      this._mainController.redraw()
    } else {
      console.log('change editing mode')
      this._state.editingMode = editingMode
      // this._menuController.redraw()
      this._editController.onChangeEditingMode()
    }
    this.newScrollOffset({ deltaX: 0, deltaY: 0 }, true)
  }
  saveEditing() {
    const contentView = this._editController.getContents()
    const serializedContents = contentView.children.map(child => child.serialize())
    console.log(serializedContents)

    api.save(serializedContents, this.onSaveDone, this.onSaveFailed)

    this._state.editing = false
    this._state.editingMode = null    
    this._mainController.setContents(contentView.children)
    console.log('Called setContents with: ', contentView.children)
    this._mainController.onDoneEditing()
    this._editController.onDoneEditing()
    // this._menuController.onDoneEditing()
    this.newScrollOffset({ deltaX: 0, deltaY: 0 }, true)

    // Remove old views that were stored in case the user tapped cancel
    delete this.currentContents.oldChildren
  }
  onSaveDone(data) {
    console.log('onSaveDone', data)
    this.version = data.version
  }
  onSaveFailed(evt) {
    console.log('onSaveFailed', evt)
  }
  cancelEditing() {
    this._state.editing = false
    this._state.editingMode = null
    this._mainController.setContents(this.currentContents.oldChildren)
    this._mainController.onDoneEditing()
    this._editController.onDoneEditing()

    this.newScrollOffset({ deltaX: 0, deltaY: 0 }, true)
    // this._menuController.onDoneEditing()

    // Remove newly created children
    delete this.currentContents.childrenToEdit
  }

  setContents(contents) {
    // console.log('Contents: ', contents)
    if (!contents.version) {
      // This means we received an empty string => no contents in the database.
      return
    }
    this.version = contents.version
    const { versionData } = contents
    const o = JSON.parse(versionData)

    const deserialized = o.map(s => {
      switch (s.type.toLowerCase()) {
        case 'line':
          return Line.FromSerialized(s)
          break
        case 'rect':
          return Rect.FromSerialized(s)
          break
        case 'imagerect':
          return ImageRect.FromSerialized(s)
          break
        case 'text':
          return Text.FromSerialized(s)
          break
      }
    })

    this._mainController.setContents(deserialized)
    this._mainController.refresh()    
  }

  setInitialScroll(deltaX, deltaY) {
    this.newScrollOffset({ deltaX: deltaX + this.scrollOffset.x, deltaY: deltaY + this.scrollOffset.y }, true)
  }

  newScrollOffset(offset, force) {
    const { deltaX, deltaY } = offset
    this.scrollOffset.x = parseInt(this.scrollOffset.x - deltaX)
    this.scrollOffset.y = parseInt(this.scrollOffset.y - deltaY)
    this._mainController.updateScrollPosition(this.scrollOffset.x, this.scrollOffset.y)
    this._editController.updateScrollPosition(this.scrollOffset.x, this.scrollOffset.y)
    this._gridController.updateScrollPosition(this.scrollOffset.x, this.scrollOffset.y)
    ImagePool.updateScrollPosition(this.scrollOffset.x, this.scrollOffset.y, force)
    setCoordinates(this.scrollOffset.x, this.scrollOffset.y)

    // router.pause(true)
    // router.navigate(`/version/${this.version}/x/${-this.scrollOffset.x}/y/${-this.scrollOffset.y}`)
    // router.pause(false)
  }

  // Navigation related methods
  getCurrentURL() {
    return getAbsoluteURL(`/version/${this.version}/x/${-this.scrollOffset.x}/y/${-this.scrollOffset.y}`)
  }

  navigateLatestWithPosition() {
    router.navigate(`/x/${-this.scrollOffset.x}/y/${-this.scrollOffset.y}`)
  }

}

export default new GlobalState()