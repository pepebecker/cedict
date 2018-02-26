'use strict'

const cedict = require('../index')

describe('Validate cedict data', () => {
	it('should validate the cedict data', done => {
		for (let entry of cedict) {
			const traditionalType = typeof entry.traditional
			const simplifiedType = typeof entry.simplified
			const definitionsType = typeof entry.definitions
			const definitionsLength = entry.definitions.length
			traditionalType.should.equal('string')
			simplifiedType.should.equal('string')
			definitionsType.should.equal('object')
			definitionsLength.should.greaterThan(0)
		}
		done()
	})
})
