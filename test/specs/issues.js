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
      vm = new Vue({ el, data: { value: 0 } })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      const field1 = el.getElementsByTagName('input')[0]
      const field2 = el.getElementsByTagName('input')[1]
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
        vm = new Vue({ el })
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
        vm = new Vue({ el })
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
        vm = new Vue({ el })
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
        vm = new Vue({ el, data: { msg: 'hello' } })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        const field = el.getElementsByTagName('input')[0]
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
        vm = new Vue({ el, data: { checkedNames: [] } })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        const foo = el.getElementsByTagName('input')[0]
        const bar = el.getElementsByTagName('input')[1]
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
        vm = new Vue({ el, data: { picked: 'foo' } })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        const foo = el.getElementsByTagName('input')[0]
        const bar = el.getElementsByTagName('input')[1]
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
        vm = new Vue({ el, data: { lang: 'ja' } })
        vm.$nextTick(done)
      })

      it('should be validated', (done) => {
        const select = el.getElementsByTagName('select')[0]
        const en = el.getElementsByTagName('option')[0]
        const zh = el.getElementsByTagName('option')[2]
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
        el,
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
      let input = el.getElementsByTagName('input')[0]
      const button = el.getElementsByTagName('button')[0]
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


  describe('#243', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <input type="text" v-pickadate="'date'" v-validate:name="['required']">
          </form>
        </validator>
      `
      vm = new Vue({
        el,
        directives: {
          pickadate: {
            bind () {
              const elm = document.createElement('div')
              elm.innerHTML = '<p>hello world</p>'
              Vue.util.after(elm, this.el)
            }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      const field1 = vm.$el.querySelector('input')
      field1.value = 'hello'
      trigger(field1, 'input')
      trigger(field1, 'blur')
      vm.$nextTick(() => {
        assert(vm.$validator1.name.required === false)
        done()
      })
    })
  })


  describe('#274', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validation1">
          <form novalidate>
            <div class="inputs">
              <input type="text" id="username" v-validate:username="customeValidator">
              <input type="text" id="comment" v-validate:comment="{ maxlength: 4 }">
            </div>
            <div class="errors">
              <p v-if="$validation1.username.required">Required your name.</p>
              <p v-if="$validation1.comment.maxlength">Your comment is too long.</p>
            </div>
            <input type="submit" value="send" v-if="$validation1.valid">
            <button id="buttonCustom1" type="button" @click="onCustomValidator1">custom1</button>
            <button id="buttonCustom2" type="button" @click="onCustomValidator2">custom2</button>
          </form>
        </validator>
      `
      vm = new Vue({
        el,
        data: {
          customeValidator: ['custom1']
        },
        validators: {
          custom1 (val) {
            return val === 'custom1'
          },
          custom2 (val) {
            return val === 'custom2'
          }
        },
        methods: {
          onCustomValidator1 () {
            this.customeValidator = ['custom1']
          },
          onCustomValidator2 () {
            this.customeValidator = ['custom2']
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be validated', (done) => {
      const username = el.querySelector('#username')
      const buttonCustom2 = el.querySelector('#buttonCustom2')
      assert(vm.$validation1.invalid === true)
      assert(vm.$validation1.username.custom1 === true)
      assert(vm.$validation1.username.custom2 === undefined)
      username.value = 'custom1'
      trigger(username, 'input')
      trigger(username, 'blur')
      vm.$nextTick(() => {
        assert(vm.$validation1.valid === true)
        assert(vm.$validation1.username.custom1 === false)
        assert(vm.$validation1.username.custom2 === undefined)
        buttonCustom2.click()
        vm.$nextTick(() => {
          assert(vm.$validation1.invalid === true)
          assert(vm.$validation1.username.custom1 === undefined)
          assert(vm.$validation1.username.custom2 === true)
          username.value = 'custom2'
          trigger(username, 'input')
          trigger(username, 'blur')
          vm.$nextTick(() => {
            assert(vm.$validation1.valid === true)
            assert(vm.$validation1.username.custom1 === undefined)
            assert(vm.$validation1.username.custom2 === false)
            done()
          })
        })
      })
    })
  })

  describe('#284', () => {
    beforeEach(done => {
      el.innerHTML = `
        <validator name="validation">
          <input id="foo" type="text" v-model="foo" v-validate:foo="rules">
        </validator>
      `
      vm = new Vue({
        el,
        data: {
          foo: '',
          rules: {
            maxlength: {
              rule: 4,
              message: 'too long!!'
            },
            required: {
              rule: true,
              message: 'required!!'
            }
          }
        }
      })
      vm.$nextTick(done)
    })

    it('should be validated', done => {
      const input = el.querySelector('#foo')
      vm.rules.required.message = 'required "foo" field!!'
      vm.$nextTick(() => {
        assert.equal(vm.$validation.foo.required, 'required "foo" field!!')
        input.value = 'hello'
        trigger(input, 'input')
        trigger(input, 'blur')
        vm.$nextTick(() => {
          assert.equal(vm.$validation.foo.maxlength, 'too long!!')
          vm.rules.maxlength.rule = 10
          vm.$nextTick(() => {
            assert(vm.$validation.foo.maxlength === false)
            done()
          })
        })
      })
    })
  })


  // Fix $resetValidation bug for textbox with using initial params
  describe('#307', () => {
    beforeEach((done) => {
      el.innerHTML = `
        <validator name="validator1">
          <form novalidate>
            <input type="text" v-model="msg" initial="off" v-validate:field1="{ required: true }">
          </form>
        </validator>
      `
      vm = new Vue({ el, data: { msg: '' } })
      vm.$nextTick(done)
    })

    it('should be reset', (done) => {
      // default
      assert(vm.$validator1.field1.required === false)
      assert(vm.$validator1.field1.valid === true)
      assert(vm.$validator1.field1.dirty === false)
      assert(vm.$validator1.field1.modified === false)
      assert(vm.$validator1.field1.touched === false)
      assert(vm.$validator1.valid === true)
      assert(vm.$validator1.dirty === false)
      assert(vm.$validator1.modified === false)
      assert(vm.$validator1.touched === false)
      // set
      vm.msg = 'hello'
      vm.$nextTick(() => {
        // initialize
        vm.msg = ''
        vm.$nextTick(() => {
          assert(vm.$validator1.field1.required)
          assert(vm.$validator1.field1.valid === false)
          assert(vm.$validator1.field1.dirty === true)
          assert(vm.$validator1.field1.modified === false)
          assert(vm.$validator1.field1.touched === false)
          assert(vm.$validator1.valid === false)
          assert(vm.$validator1.dirty === true)
          assert(vm.$validator1.modified === false)
          assert(vm.$validator1.touched === false)
          // reset
          vm.$resetValidation(() => {
            assert(vm.$validator1.field1.required === false)
            assert(vm.$validator1.field1.valid === true)
            assert(vm.$validator1.field1.dirty === false)
            assert(vm.$validator1.field1.modified === false)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.valid === true)
            assert(vm.$validator1.dirty === false)
            assert(vm.$validator1.modified === false)
            assert(vm.$validator1.touched === false)
            done()
          })
        })
      })
    })
  })


  // fix $resetValidation bug with using initial value in object
  describe('#299', () => {
    describe('checkbox', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <input type="checkbox" value="foo" v-model="items" v-validate:field1="{ minlength: { rule: 1, initial: 'off' } }">
              <input type="checkbox" value="bar" v-model="items" v-validate:field1>
              <input type="checkbox" value="buz" v-model="items" v-validate:field1>
            </form>
          </validator>
        `
        vm = new Vue({ el, data: { items: [] } })
        vm.$nextTick(done)
      })

      it('should be reset', (done) => {
        assert(vm.$validator1.field1.minlength === false)
        assert(vm.$validator1.field1.valid === true)
        assert(vm.$validator1.field1.touched === false)
        assert(vm.$validator1.field1.dirty === false)
        assert(vm.$validator1.field1.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)
        assert(vm.$validator1.touched === false)
        // set
        vm.items = ['foo', 'bar']
        vm.$nextTick(() => {
          // initialize
          vm.items = []
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.minlength === true)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === false)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === false)
            assert(vm.$validator1.touched === false)
            // reset
            vm.$resetValidation(() => {
              assert(vm.$validator1.field1.minlength === false)
              assert(vm.$validator1.field1.valid === true)
              assert(vm.$validator1.field1.touched === false)
              assert(vm.$validator1.field1.dirty === false)
              assert(vm.$validator1.field1.modified === false)
              assert(vm.$validator1.valid === true)
              assert(vm.$validator1.dirty === false)
              assert(vm.$validator1.modified === false)
              assert(vm.$validator1.touched === false)
              done()
            })
          })
        })
      })
    })

    describe('radio', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <input type="radio" v-model="picked" name="r1" value="foo" v-validate:field1="{ required: { rule: true, initial: 'off' } }">
              <input type="radio" v-model="picked" name="r1" value="bar" v-validate:field1>
            </form>
          </validator>
        `
        vm = new Vue({ el, data: { picked: '' } })
        vm.$nextTick(done)
      })

      it('should be reset', (done) => {
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
        // set
        vm.picked = 'foo'
        vm.$nextTick(() => {
          // initialize
          vm.picked = ''
          vm.$nextTick(() => {
            assert(vm.$validator1.field1.required)
            assert(vm.$validator1.field1.valid === false)
            assert(vm.$validator1.field1.touched === false)
            assert(vm.$validator1.field1.dirty === true)
            assert(vm.$validator1.field1.modified === false)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === false)
            // reset
            vm.$resetValidation(() => {
              assert(vm.$validator1.field1.required === false)
              assert(vm.$validator1.field1.valid === true)
              assert(vm.$validator1.field1.touched === false)
              assert(vm.$validator1.field1.dirty === false)
              assert(vm.$validator1.field1.modified === false)
              assert(vm.$validator1.valid === true)
              assert(vm.$validator1.touched === false)
              assert(vm.$validator1.dirty === false)
              assert(vm.$validator1.modified === false)
              done()
            })
          })
        })
      })
    })

    describe('select', () => {
      beforeEach((done) => {
        el.innerHTML = `
          <validator name="validator1">
            <form novalidate>
              <select v-model="lang" v-validate:lang="{ required: { rule: true, initial: 'off' } }">
                <option value="en">english</option>
                <option selected value="ja">japanese</option>
                <option value="zh">chinese</option>
              </select>
            </form>
          </validator>
        `
        vm = new Vue({ el, data: { lang: '' } })
        vm.$nextTick(done)
      })

      it('should be reset', (done) => {
        // default
        assert(vm.$validator1.lang.required === false)
        assert(vm.$validator1.lang.valid === true)
        assert(vm.$validator1.lang.touched === false)
        assert(vm.$validator1.lang.dirty === false)
        assert(vm.$validator1.lang.modified === false)
        assert(vm.$validator1.valid === true)
        assert(vm.$validator1.touched === false)
        assert(vm.$validator1.dirty === false)
        assert(vm.$validator1.modified === false)
        // set
        vm.lang = 'ja'
        vm.$nextTick(() => {
          // initialize
          vm.lang = ''
          vm.$nextTick(() => {
            assert(vm.$validator1.lang.required)
            assert(vm.$validator1.lang.valid === false)
            assert(vm.$validator1.lang.touched === false)
            assert(vm.$validator1.lang.dirty === true)
            assert(vm.$validator1.lang.modified === true)
            assert(vm.$validator1.valid === false)
            assert(vm.$validator1.touched === false)
            assert(vm.$validator1.dirty === true)
            assert(vm.$validator1.modified === true)
            // reset
            vm.$resetValidation(() => {
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
      })
    })
  })
})
