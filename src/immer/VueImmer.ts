import { shallowRef } from 'vue'
import type { ShallowRef } from 'vue'
import produce from 'immer'

export default class VueImmer {
	protected readonly _state: ShallowRef
	
	constructor(baseState: any) {
		this._state = shallowRef(baseState)
	}
	
	get state(): ShallowRef {
		return this._state
	}
	
	update(updater: Function) {
		this._state.value = produce(this._state.value, updater)
	}
}