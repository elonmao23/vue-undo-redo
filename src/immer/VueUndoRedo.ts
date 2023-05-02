import VueImmer from './VueImmer'
import { produceWithPatches, applyPatches } from 'immer'
import type { Patch } from 'immer'

export default class VueUndoRedo extends VueImmer {
	private _currentStep: number
	private readonly _maxStep: number
	private readonly _changes: Array<Array<Patch>>
	private readonly _inverseChanges: Array<Array<Patch>>

	constructor(baseState: any, maxStep: number) {
		super(baseState)
		this._currentStep = 0
		this._maxStep = maxStep
		this._changes = []
		this._inverseChanges = []
	}

	update(updater: Function) {
		const [nextState, patches, inversePatches] = produceWithPatches(this._state.value, updater) as unknown as any[]
		if (patches.length === 0) {
			return null
		}
		this._state.value = nextState
		this._changes.splice(++this._currentStep)
		this._changes.push(patches)
		this._inverseChanges.splice(this._currentStep)
		this._inverseChanges.push(inversePatches)
		if (this._currentStep > this._maxStep) {
			this._changes.shift()
			this._inverseChanges.shift()
			this._currentStep--
		}
		return patches
	}

	undo() {
		if (this._currentStep === 0) {
			return null
		}
		const inverseChanges = this._inverseChanges[--this._currentStep]
		this._state.value = applyPatches(this._state.value, inverseChanges)
		return inverseChanges
	}
	
	redo() {
		if (this._currentStep >= this._changes.length) {
			return null
		}
		const changes = this._changes[this._currentStep++]
		this._state.value = applyPatches(this._state.value, changes)
		return changes
	}
}
