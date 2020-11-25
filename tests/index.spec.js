'use strict'

require('mocha')
const { expect } = require('chai')

const cedict = require('../index')

describe('Validate cedict data', () => {
	it('should validate the cedict data', done => {
		for (let entry of cedict) {
			const traditionalType = typeof entry.traditional
			const simplifiedType = typeof entry.simplified
			const hskType = typeof entry.hsk
			const definitionsType = typeof entry.definitions
			const definitionsLength = entry.definitions.length
			expect(traditionalType).equal('string')
			expect(simplifiedType).equal('string')
			expect(hskType).equal('number')
			expect(definitionsType).equal('object')
			expect(definitionsLength).greaterThan(0)
		}
		done()
	})
})
