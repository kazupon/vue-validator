/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('multiple', function () {
    var element  = mock(
        'validator-multiple',
        '<form v-validate>' +
        'Name: <input type="text" v-model="name | required | length min:3 max:32" /><br />' +
        'Age: <input type="text" v-model="age | required | numeric min:18" /><br />' +
        'Zip: <input type="text" v-model="zip | required | pattern /^[0-9]{3}-[0-9]{4}$/" /><br />' +
        '</form>'
    )

    Vue.use(validator)

    var form = new Vue({
        el: '#validator-multiple',
        data: {
            name: '',
            age: 18,
            zip: '0001111'
        }
    })
    

    describe('when load form', function () {
        describe('Name', function () {
            describe('required', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.name.required).to.be(true)
                        done()
                    })
                })
            })

            describe('length', function () {
                describe('min', function () {
                    it('should be true', function (done) {
                        nextTick(function () {
                            expect(form.$validation.name.length.min).to.be(true)
                            done()
                        })
                    })
                })

                describe('max', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.name.length.max).to.be(false)
                            done()
                        })
                    })
                })
            })
        })

        describe('Age', function () {
            describe('required', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.age.required).to.be(false)
                        done()
                    })
                })
            })

            describe('numeric', function () {
                describe('min', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.age.numeric.min).to.be(false)
                            done()
                        })
                    })
                })

                describe('max', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.age.numeric.max).to.be(false)
                            done()
                        })
                    })
                })

                describe('value', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.age.numeric.value).to.be(false)
                            done()
                        })
                    })
                })
            })
        })

        describe('Zip', function () {
            describe('required', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.zip.required).to.be(false)
                        done()
                    })
                })
            })

            describe('pattern', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.zip.pattern).to.be(true)
                        done()
                    })
                })
            })
        })
    })


    describe('when input form', function () {
        before(function (done) {
            var name_input = element.getElementsByTagName('input')[0],
                age_input = element.getElementsByTagName('input')[1],
                zip_input = element.getElementsByTagName('input')[2]
            name_input.value = 'validator'
            name_input.dispatchEvent(mockHTMLEvent('input'))
            age_input.value = '17'
            age_input.dispatchEvent(mockHTMLEvent('input'))
            zip_input.value = '111-2222'
            zip_input.dispatchEvent(mockHTMLEvent('input'))
            done()
        })

        describe('Name', function () {
            describe('required', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.name.required).to.be(false)
                        done()
                    })
                })
            })

            describe('length', function () {
                describe('min', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.name.length.min).to.be(false)
                            done()
                        })
                    })
                })

                describe('max', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.name.length.max).to.be(false)
                            done()
                        })
                    })
                })
            })
        })

        describe('Age', function () {
            describe('required', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.age.required).to.be(false)
                        done()
                    })
                })
            })

            describe('numeric', function () {
                describe('min', function () {
                    it('should be true', function (done) {
                        nextTick(function () {
                            expect(form.$validation.age.numeric.min).to.be(true)
                            done()
                        })
                    })
                })

                describe('max', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.age.numeric.max).to.be(false)
                            done()
                        })
                    })
                })

                describe('value', function () {
                    it('should be false', function (done) {
                        nextTick(function () {
                            expect(form.$validation.age.numeric.value).to.be(false)
                            done()
                        })
                    })
                })
            })
        })

        describe('Zip', function () {
            describe('required', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.zip.required).to.be(false)
                        done()
                    })
                })
            })

            describe('pattern', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.zip.pattern).to.be(false)
                        done()
                    })
                })
            })
        })
    })
})
