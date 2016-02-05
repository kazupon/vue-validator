import assert from 'power-assert'
import Vue from 'vue'
import { trigger, each } from '../../../src/util'


describe('validate directive', () => {
  let vm, el

  beforeEach(() => {
    Vue.config.debug = true
    el = document.createElement('div')
  })


  describe('normal', () => {
    beforeEach((done) => {
      vm = new Vue({
        el: el,
        template: '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-validate:field1="{ required: true }">' +
          '</form>' +
          '</validator>'
      })
      vm.$nextTick(done)
    })

    it('field scope should be assigned', () => {
      assert(vm.$validator1.field1 !== undefined)
      assert(vm.$validator1.field1.required !== undefined)
      assert(vm.$validator1.field1.valid !== undefined)
      assert(vm.$validator1.field1.invalid !== undefined)
      assert(vm.$validator1.field1.touched !== undefined)
      assert(vm.$validator1.field1.untouched !== undefined)
      assert(vm.$validator1.field1.modified !== undefined)
      assert(vm.$validator1.field1.dirty !== undefined)
      assert(vm.$validator1.field1.pristine !== undefined)
    })
  })


  describe('expression evaluate error', () => {
    // TODO: should be tested with spy library (we try to use sinon.js, however it not work ... )
    it('should not be called warn', (done) => {
      el.innerHTML = 
        '<validator name="validator">' +
        '<form novalidate>' +
        '<input type="text" v-validate:field1="{ required: true }">' +
        '<p>field1 value: {{ $validator.field1.valid }}</p>' + 
        '<div v-for="index in indexes">' + 
        '<input type="text" :field="\'field\' + index" v-validate="{ minlength: 4 }">' + 
        '<p>field{{index}} valid: {{ $validator[\'field\' + index].valid }}</p>' + 
        '<span v-if="$validator[\'field\' + index].valid"> valid !!</span>' + 
        '</div>' +
        '<input type="submit" v-if="$validator.valid">' + 
        '</form>' +
        '</validator>'
      vm = new Vue({
        el: el,
        data: {
          indexes: [2, 3]
        }
      })
      vm.$nextTick(() => {
        assert(true)
        done()
      })
    })
  })


  describe('v-show', () => {
    beforeEach(() => {
      vm = new Vue({
        el: el,
        data: {
          hidden: false
        },
        template: '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-show="hidden" v-validate:field1="{ min: 0, max: 10 }">' +
          '</form>' +
          '</validator>'
      })
    })

    describe('set true', () => {
      beforeEach((done) => {
        vm.hidden = true
        vm.$nextTick(done)
      })

      it('field scope should be assigned', () => {
        assert(vm.$validator1.field1 !== undefined)
        assert(vm.$validator1.field1.min !== undefined)
        assert(vm.$validator1.field1.max !== undefined)
        assert(vm.$validator1.field1.valid !== undefined)
        assert(vm.$validator1.field1.invalid !== undefined)
        assert(vm.$validator1.field1.touched !== undefined)
        assert(vm.$validator1.field1.untouched !== undefined)
        assert(vm.$validator1.field1.modified !== undefined)
        assert(vm.$validator1.field1.dirty !== undefined)
        assert(vm.$validator1.field1.pristine !== undefined)
      })

      context('set false', () => {
        beforeEach((done) => {
          vm.hidden = false
          vm.$nextTick(done)
        })

        it('validator scope should be assigned', () => {
          assert(vm.$validator1.field1 !== undefined)
          assert(vm.$validator1.field1.min !== undefined)
          assert(vm.$validator1.field1.max !== undefined)
          assert(vm.$validator1.field1.valid !== undefined)
          assert(vm.$validator1.field1.invalid !== undefined)
          assert(vm.$validator1.field1.touched !== undefined)
          assert(vm.$validator1.field1.untouched !== undefined)
          assert(vm.$validator1.field1.modified !== undefined)
          assert(vm.$validator1.field1.dirty !== undefined)
          assert(vm.$validator1.field1.pristine !== undefined)
        })

        describe('set true', () => {
          beforeEach((done) => {
            vm.hidden = true
            vm.$nextTick(done)
          })

          it('validator scope should be assigned', () => {
            assert(vm.$validator1.field1 !== undefined)
            assert(vm.$validator1.field1.min !== undefined)
            assert(vm.$validator1.field1.max !== undefined)
            assert(vm.$validator1.field1.valid !== undefined)
            assert(vm.$validator1.field1.invalid !== undefined)
            assert(vm.$validator1.field1.touched !== undefined)
            assert(vm.$validator1.field1.untouched !== undefined)
            assert(vm.$validator1.field1.modified !== undefined)
            assert(vm.$validator1.field1.dirty !== undefined)
            assert(vm.$validator1.field1.pristine !== undefined)
          })
        })
      })
    })
  })


  describe('v-if', () => {
    context('text', () => {
      beforeEach(() => {
        el.innerHTML = '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-if="hidden" v-validate:field1="{ minlength: 0, maxlength: 10 }">' +
          '</form>' +
          '<pre>{{ $validator1 | json }}</pre>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { hidden: false }
        })
      })

      describe('set true', () => {
        beforeEach((done) => {
          vm.hidden = true
          vm.$nextTick(done)
        })

        it('field scope should be assigned', () => {
          assert(vm.$validator1.field1 !== undefined)
          assert(vm.$validator1.field1.minlength !== undefined)
          assert(vm.$validator1.field1.maxlength !== undefined)
          assert(vm.$validator1.field1.valid !== undefined)
          assert(vm.$validator1.field1.invalid !== undefined)
          assert(vm.$validator1.field1.touched !== undefined)
          assert(vm.$validator1.field1.untouched !== undefined)
          assert(vm.$validator1.field1.modified !== undefined)
          assert(vm.$validator1.field1.dirty !== undefined)
          assert(vm.$validator1.field1.pristine !== undefined)
        })

        describe('set false', () => {
          beforeEach((done) => {
            vm.hidden = false
            vm.$nextTick(done)
          })

          it('field scope should not be assigned', () => {
            assert(vm.$validator1.field1 === undefined)
          })

          describe('set true', () => {
            beforeEach((done) => {
              vm.hidden = true
              vm.$nextTick(done)
            })

            it('field scope should be assigned', () => {
              assert(vm.$validator1.field1 !== undefined)
              assert(vm.$validator1.field1.minlength !== undefined)
              assert(vm.$validator1.field1.maxlength !== undefined)
              assert(vm.$validator1.field1.valid !== undefined)
              assert(vm.$validator1.field1.invalid !== undefined)
              assert(vm.$validator1.field1.touched !== undefined)
              assert(vm.$validator1.field1.untouched !== undefined)
              assert(vm.$validator1.field1.modified !== undefined)
              assert(vm.$validator1.field1.dirty !== undefined)
              assert(vm.$validator1.field1.pristine !== undefined)
            })
          })
        })
      })
    })

    context('checkbox', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="checkbox" v-if="hidden" v-validate:field1="[\'required\']">' +
          '</form>' +
          '<pre>{{ $validator1 | json }}</pre>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { hidden: false }
        })
        vm.$nextTick(done)
      })

      describe('toggling', () => {
        beforeEach((done) => {
          vm.hidden = true
          vm.$nextTick(() => {
            vm.hidden = false
            vm.$nextTick(done)
          })
        })

        it('field scope should be assigned', () => {
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.invalid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.untouched === true)
          assert(vm.$validator1.modified === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.pristine === true)
        })
      })
    })

    context('radio', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="radio" v-if="hidden" value="one" v-validate:field1="[\'required\']">' +
          '</form>' +
          '<pre>{{ $validator1 | json }}</pre>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { hidden: false }
        })
        vm.$nextTick(done)
      })

      describe('toggling', () => {
        beforeEach((done) => {
          vm.hidden = true
          vm.$nextTick(() => {
            vm.hidden = false
            vm.$nextTick(done)
          })
        })

        it('field scope should be assigned', () => {
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.invalid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.untouched === true)
          assert(vm.$validator1.modified === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.pristine === true)
        })
      })
    })

    context('select', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">' +
          '<form novalidate>' +
          '<select v-if="hidden" v-validate:lang="{ required: true }">' +
          '<option value="en">english</option>' +
          '<option value="ja">japanese</option>' +
          '<option value="zh">chinese</option>' +
          '</select>' +
          '</form>' +
          '<pre>{{ $validator1 | json }}</pre>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { hidden: false }
        })
        vm.$nextTick(done)
      })

      describe('toggling', () => {
        beforeEach((done) => {
          vm.hidden = true
          vm.$nextTick(() => {
            vm.hidden = false
            vm.$nextTick(done)
          })
        })

        it('field scope should be assigned', () => {
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.invalid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.untouched === true)
          assert(vm.$validator1.modified === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.pristine === true)
        })
      })
    })
  })


  describe('v-model', () => {
    describe('text', () => {
      beforeEach((done) => {
        el.innerHTML = '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="text" v-model="msg" v-validate:field1="{ required: true, minlength: 10 }">' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { msg: 'hello' }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        let field = el.getElementsByTagName('input')[0]

        // default
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.minlength === true)
        assert(vm.$validator1.field1.valid === false)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.modified === false)
        assert(vm.$validator1.field1.dirty === false)
        assert(field.value === vm.msg)

        // modify vm property
        vm.msg = 'helloworld!!'
        setTimeout(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.minlength === false)
          assert(vm.$validator1.field1.valid === true)
          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field1.modified === true)
          assert(vm.$validator1.field1.dirty === true)
          assert(field.value === vm.msg)

          field.value = 'foo'
          trigger(field, 'input')
          trigger(field, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.minlength === true)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.touched === true)
            assert(vm.$validator1.field1.modified === true)
            assert(vm.$validator1.field1.dirty === true)

            done()
          })
        }, 10)
      })
    })

    describe('checkbox', () => {
      context('single', () => {
        beforeEach((done) => {
          el.innerHTML = 
            '<validator name="validator1">' +
            '<form novalidate>' +
            '<input type="checkbox" v-model="checked" v-validate:field1="[\'required\']">' +
            '</form>' +
            '</validator>'
          vm = new Vue({
            el: el,
            data: { checked: true }
          })
          vm.$nextTick(done)
        })

        it('should be validated', (done) => {
          // default
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.valid === true)
          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field1.dirty === false)
          assert(vm.$validator1.field1.modified === false)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.modified === false)

          // checkbox off
          let checkbox = el.getElementsByTagName('input')[0]
          checkbox.checked = false
          trigger(checkbox, 'change')
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required === true)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === true)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            assert(vm.checked === false)

            done()
          })
        })
      })

      context('multiple', () => {
        beforeEach((done) => {
          el.innerHTML = 
            '<validator name="validator1">' +
            '<form novalidate>' +
            '<input type="checkbox" v-model="checkedNames" value="foo" v-validate:field1="{ required: true, minlength: 2 }">' +
            '<input type="checkbox" v-model="checkedNames" value="bar" v-validate:field1>' +
            '<input type="checkbox" v-model="checkedNames" value="buz" v-validate:field1>' +
            '</form>' +
            '</validator>'
          vm = new Vue({
            el: el,
            data: { checkedNames: [] }
          })
          vm.$nextTick(done)
        })

        it('should be validated', (done) => {
          let foo = el.getElementsByTagName('input')[0]
          let bar = el.getElementsByTagName('input')[1]

          // default
          assert(vm.$validator1.field1.required === true)
          assert(vm.$validator1.field1.minlength === true)
          assert(vm.$validator1.field1.valid === false)
          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.field1.dirty === false)
          assert(vm.$validator1.field1.modified === false)

          // checked foo
          foo.checked = true
          trigger(foo, 'change')
          trigger(foo, 'click')
          trigger(foo, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.minlength === true)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.touched === true)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === true)
            assert(vm.checkedNames.sort().toString() === ['foo'].sort().toString())

            // checked bar
            bar.checked = true
            trigger(bar, 'change')
            trigger(bar, 'click')
            trigger(bar, 'blur')
            vm.$nextTick(() => {
              assert(vm.$validator1.field1.required === false)
              assert(vm.$validator1.field1.minlength === false)
              assert(vm.$validator1.field1.valid === true)
              assert(vm.$validator1.field1.touched === true)
              assert(vm.$validator1.field1.dirty === true)
              assert(vm.$validator1.field1.modified === true)
              assert(vm.checkedNames.sort().toString() === ['foo', 'bar'].sort().toString())

              done()
            })
          })
        })
      })
    })


    describe('radio', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator1">' +
          '<form novalidate>' +
          '<input type="radio" v-model="picked" name="r1" value="foo" v-validate:field1="{ required: true }">' +
          '<input type="radio" v-model="picked" name="r1" value="bar" v-validate:field1>' +
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { picked: 'foo' }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        let foo = el.getElementsByTagName('input')[0]
        let bar = el.getElementsByTagName('input')[1]

        // default
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === false)
        assert(vm.$validator1.field1.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        // change bar radio
        bar.checked = true
        trigger(bar, 'change')
        trigger(bar, 'blur')
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required === false)
          assert(vm.$validator1.field1.valid === true)
          assert(vm.$validator1.field1.touched === true)
          assert(vm.$validator1.field1.dirty === true)
          assert(vm.$validator1.field1.modified === true)
          assert(vm.$validator1.valid === true)
          assert(vm.$validator1.touched === true)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === true)
          assert(vm.picked === 'bar')

          // back to foo radio
          foo.checked = true
          trigger(foo, 'change')
          trigger(foo, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.valid === true)
            assert(vm.$validator1.field1.touched === true)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === false)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === true)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === false)
            assert(vm.picked === 'foo')

            done()
          })
        })
      })
    })


    describe('select', () => {
      context('single', () => {
        beforeEach((done) => {
          el.innerHTML = 
            '<validator name="validator1">' +
            '<form novalidate>' +
            '<select v-model="lang" v-validate:lang="{ required: true }">' +
            '<option value="en">english</option>' +
            '<option selected value="ja">japanese</option>' +
            '<option value="zh">chinese</option>' +
            '</select>' +
            '</form>' +
            '</validator>'
          vm = new Vue({
            el: el,
            data: { lang: 'ja' }
          })
          vm.$nextTick(done)
        })

        it('should be validated', (done) => {
          let select = el.getElementsByTagName('select')[0]
          let en = el.getElementsByTagName('option')[0]
          let zh = el.getElementsByTagName('option')[2]

          // default
          assert(vm.$validator1.lang.required === false)
          assert(vm.$validator1.lang.valid === true)
          assert(vm.$validator1.lang.touched === false)
          assert(vm.$validator1.lang.dirty === false)
          assert(vm.$validator1.lang.modified === false)
          assert(vm.lang === 'ja')

          en.selected = true
          trigger(select, 'change')
          vm.$nextTick(() => {
            assert(vm.$validator1.lang.required === false)
            assert(vm.$validator1.lang.valid === true)
            assert(vm.$validator1.lang.touched === false)
            assert(vm.$validator1.lang.dirty === true)
            assert(vm.$validator1.lang.modified === true)
            assert(vm.lang === 'en')

            zh.selected = true
            trigger(select, 'change')
            trigger(select, 'blur')
            vm.$nextTick(() => {
              assert(vm.$validator1.lang.required === false)
              assert(vm.$validator1.lang.valid === true)
              assert(vm.$validator1.lang.touched === true)
              assert(vm.$validator1.lang.dirty === true)
              assert(vm.$validator1.lang.modified === true)
              assert(vm.lang === 'zh')

              done()
            })
          })
        })
      })

      context('multiple', () => {
        beforeEach((done) => {
          el.innerHTML = 
            '<validator name="validator1">' +
            '<form novalidate>' +
            '<select multiple v-model="langs" v-validate:langs="{ required: true, minlength: 2 }">' +
            '<option value="">select a language</option>' +
            '<option selected value="en">english</option>' +
            '<option value="ja">japanese</option>' +
            '<option value="zh">chinese</option>' +
            '<option value="fr">french</option>' +
            '<option value="de">german</option>' +
            '</select>' +
            '</form>' +
            '</validator>'
          vm = new Vue({
            el: el,
            data: { langs: [] }
          })
          vm.$nextTick(done)
        })

        it('should be validated', (done) => {
          let select = el.getElementsByTagName('select')[0]
          let empty = el.getElementsByTagName('option')[0]
          let en = el.getElementsByTagName('option')[1]
          let ja = el.getElementsByTagName('option')[2]
          let zh = el.getElementsByTagName('option')[3]

          // default
          assert(vm.$validator1.langs.required === false)
          assert(vm.$validator1.langs.minlength === true)
          assert(vm.$validator1.langs.valid === false)
          assert(vm.$validator1.langs.touched === false)
          assert(vm.$validator1.langs.dirty === false)
          assert(vm.$validator1.langs.modified === false)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.touched === false)
          assert(vm.$validator1.dirty === false)
          assert(vm.$validator1.modified === false)
          assert(vm.langs.sort().toString() === ['en'].sort().toString())

          ja.selected = true
          zh.selected = true
          trigger(select, 'change')
          vm.$nextTick(() => {
            assert(vm.$validator1.langs.required === false)
            assert(vm.$validator1.langs.minlength === false)
            assert(vm.$validator1.langs.valid === true)
            assert(vm.$validator1.langs.touched === false)
            assert(vm.$validator1.langs.dirty === true)
            assert(vm.$validator1.langs.modified === true)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.touched === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            assert(vm.langs.sort().toString() === ['en', 'ja', 'zh'].sort().toString())

            // change selected options
            en.selected = false
            ja.selected = false
            empty.selected = true
            trigger(select, 'change')
            trigger(select, 'blur')
            vm.$nextTick(() => {
              assert(vm.$validator1.langs.required === true)
              assert(vm.$validator1.langs.minlength === false)
              assert(vm.$validator1.langs.valid === false)
              assert(vm.$validator1.langs.touched === true)
              assert(vm.$validator1.langs.dirty === true)
              assert(vm.$validator1.langs.modified === true)
              assert(vm.$validator1.valid === false)
              assert(vm.$validator1.touched === true)
              assert(vm.$validator1.dirty === true)
              assert(vm.$validator1.modified === true)
              assert(vm.langs.sort().toString() === ['', 'zh'].sort().toString())

              done()
            })
          })
        })
      })
    })

    describe('v-for', () => {
      beforeEach((done) => {
        el.innerHTML = 
          '<validator name="validator">' +
          '<form novalidate>' +
          '<div v-for="item in items">' + 
          '<input type="text" :field="\'name\' + ($index + 1)" v-model="item.name" v-validate="{ required: true }">' + 
          '</div>' +
          '<input type="submit" v-if="$validator.valid">' + 
          '</form>' +
          '</validator>'
        vm = new Vue({
          el: el,
          data: { items: [{}, {}] }
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        const fields = ['name1', 'name2']
        each(fields, (field) => {
          assert(vm.$validator[field].required === true)
          assert(vm.$validator[field].valid === false)
          assert(vm.$validator[field].touched === false)
          assert(vm.$validator[field].dirty === false)
          assert(vm.$validator[field].modified === false)
        })
        assert(vm.$validator.valid === false)
        assert(vm.$validator.touched === false)
        assert(vm.$validator.dirty === false)
        assert(vm.$validator.modified === false)

        // change field value with intaraction
        let name1 = el.getElementsByTagName('input')[0]
        let name2 = el.getElementsByTagName('input')[1]
        name1.value = 'hi'
        name2.value = 'hello'
        each([name1, name2], (input) => {
          trigger(input, 'input')
          trigger(input, 'blur')
        })
        vm.$nextTick(() => {
          each(fields, (field) => {
            assert(vm.$validator[field].required === false)
            assert(vm.$validator[field].valid === true)
            assert(vm.$validator[field].touched === true)
            assert(vm.$validator[field].dirty === true)
            assert(vm.$validator[field].modified === true)
          })
          assert(vm.$validator.valid === true)
          assert(vm.$validator.touched === true)
          assert(vm.$validator.dirty === true)
          assert(vm.$validator.modified === true)

          // add item
          vm.items.push({ name: '' })
          vm.$nextTick(() => {
            each(fields, (field) => {
              assert(vm.$validator[field].required === false)
              assert(vm.$validator[field].valid === true)
              assert(vm.$validator[field].touched === true)
              assert(vm.$validator[field].dirty === true)
              assert(vm.$validator[field].modified === true)
            })
            assert(vm.$validator.name3.required === true)
            assert(vm.$validator.name3.valid === false)
            assert(vm.$validator.name3.touched === false)
            assert(vm.$validator.name3.dirty === false)
            assert(vm.$validator.name3.modified === false)

            assert(vm.$validator.valid === false)
            assert(vm.$validator.touched === true)
            assert(vm.$validator.dirty === true)
            assert(vm.$validator.modified === true)

            // remove item
            vm.items.$remove(1)
            vm.$nextTick(() => {
              assert(vm.$validator.name1.required === false)
              assert(vm.$validator.name1.valid === true)
              assert(vm.$validator.name1.touched === true)
              assert(vm.$validator.name1.dirty === true)
              assert(vm.$validator.name1.modified === true)
              assert(vm.$validator.name3.required === true)
              assert(vm.$validator.name3.valid === false)
              assert(vm.$validator.name3.touched === false)
              assert(vm.$validator.name3.dirty === false)
              assert(vm.$validator.name3.modified === false)
              assert(vm.$validator.valid === false)
              assert(vm.$validator.touched === true)
              assert(vm.$validator.dirty === true)
              assert(vm.$validator.modified === true)

              done()
            })
          })
        })
      })
    })
  })
})
