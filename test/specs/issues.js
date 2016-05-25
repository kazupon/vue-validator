import assert from 'power-assert'
import Vue from 'vue'
import { trigger } from '../../src/util'


describe('github issues', () => {
  let el, vm

  beforeEach(() => {
    el = document.createElement('div')
  })


  describe('#195', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <input type="text" v-model="value" number>
            <input type="text" v-model="value" number v-validate:value="['required']">
          </form>
        </validator>
      `
      vm = new Vue({ el: el, data: { value: 0 } })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      let field1 = el.getElementsByTagName('input')[0]
      let field2 = el.getElementsByTagName('input')[1]
      assert(field1.value === '0')
      assert(field2.value === '0')
      done()
    })
  })

  describe('#208', () => {
    describe('radio', () => {
      beforeEach((done) => {
        el.innerHTML = `
          '<validator name="validator1">
            <form novalidate>
              <h1>Survey</h1>
              <fieldset>
                <legend>Which do you like fruit ?</legend>
                <input id="apple" type="radio" name="fruit" initial="off" value="apple" v-validate:fruits="{
                  required: true
                }">
                <label for="apple">Apple</label>
                <input id="orange" type="radio" name="fruit" value="orange" initial="off" v-validate:fruits> 
                <label for="orange">Orage</label>
                <input id="grape" type="radio" name="fruit" value="grape" initial="off" v-validate:fruits>
                <label for="grape">Grape</label>
                <input id="banana" type="radio" name="fruit" value="banana" initial="off" v-validate:fruits>
                <label for="banana">Banana</label>
                <p v-if="$validator1.fruits.required">required fields</p>
              </fieldset>
            </form>
          </validator>
        `
        vm = new Vue({ el: el })
        vm.$nextTick(done)
      })

      it('should not validated', (done) => {
        assert(vm.$validator1.fruits.valid === true)
        assert(vm.$validator1.fruits.invalid === false)
        assert(vm.$validator1.fruits.required === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.invalid === false)
        done()
      })
    })

    describe('checkbox', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <input type="checkbox" initial="off" value="foo" v-validate:field1="{ required: true, minlength: 1 }">
              <input type="checkbox" initial="off" value="bar" v-validate:field1="{ required: true, minlength: 1 }">
            </form>
          </validator>
        `
        vm = new Vue({
          el: el
        })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === false)

        done()
      })
    })

    describe('select', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <select initial="off" v-validate:lang="{ required: true }">
                <option value="en">english</option>
                <option value="ja">japanese</option>
                <option value="zh">chinese</option>
              </select>
            </form>
          </validator>
        `
        vm = new Vue({ el: el })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)

        done()
      })
    })
  })


  describe('#214', () => {
    describe('text v-model', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <input type="text" v-model="msg" initial="off" v-validate:field1="{ required: true, minlength: 10 }">
            </form>
          </validator>
        `
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
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
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

    describe('checkbox v-model', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <input type="checkbox" v-model="checkedNames" initial="off" value="foo" v-validate:field1="{ required: true, minlength: 2 }">
              <input type="checkbox" v-model="checkedNames" initial="off" value="bar" v-validate:field1>
              <input type="checkbox" v-model="checkedNames" initial="off" value="buz" v-validate:field1>
            </form>
          </validator>
        `
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
        assert(vm.$validator1.field1.required === false)
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
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

    describe('radio v-model', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <input type="radio" v-model="picked" name="r1" value="foo" initial="off" v-validate:field1="{ required: true }">
              <input type="radio" v-model="picked" name="r1" value="bar" initial="off" v-validate:field1>
            </form>
          </validator>
        `
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

    describe('select v-model', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <select v-model="lang" initial="off" v-validate:lang="{ required: true }">
                <option value="en">english</option>
                <option selected value="ja">japanese</option>
                <option value="zh">chinese</option>
              </select>
            </form>
          </validator>
        `
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
  })

  describe('#236', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <div v-if='show'>
          <validator name="validator1">
            <form novalidate>
              <input type="text" v-model="name" v-validate:name="['required']">
              <span v-if="!$validator1.valid">Name is required</span>
              <pre>{{$validator1 | json}}</pre>
            </form>
          </validator>
        </div>
        <button @click="toogle">Toogle</button>{{ show }}
        <pre>{{$validator1 | json}}</pre>
      `
      vm = new Vue({
        el: el,
        data: {
          name: 'test',
          show: true
        },
        methods: {
          toogle () {
            if (this.$data.show) {
              this.$data.show = false
            } else {
              this.show = true
            }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      assert(vm.validator1 !== null)

      let button = el.getElementsByTagName('button')[0]
      let input = el.getElementsByTagName('input')[0]
      input.value = ''
      trigger(input, 'input')
      trigger(input, 'blur')
      trigger(button, 'click')
      vm.$nextTick(() => {
        assert(vm['$validator1'] === undefined)
        assert(vm._validatorMaps['$validator1'] === undefined)

        trigger(button, 'click')
        vm.$nextTick(() => {
          assert(vm.$validator1 !== null)
          assert(vm.$validator1.name.invalid === true)
          assert(vm.$validator1.name.required)

          input = el.getElementsByTagName('input')[0]
          input.value = 'test'
          trigger(input, 'input')
          trigger(input, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validator1.name.invalid === false)
            assert(vm.$validator1.name.required === false)

            done()
          })
        })
      })
    })
  })
})
