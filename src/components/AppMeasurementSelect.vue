<template>
  <div class="row no-wrap">
    <q-btn
      @click.stop.prevent="opened = true"
      class="no-transition no-wrap"
      :class="value === null ? 'col-12' : 'col-10'"
      outline
      no-caps
      align="left"
      color="primary"
      size="form"
      icon="tune"
      :label="value === null ? $t('fields.measurementSelect.notSet') : $unitOfMeasurement.valueToText(value, unitOfMeasurement)"
    />
    <q-modal transition="none" v-model="opened" maximized>
      <q-modal-layout>
        <q-toolbar slot="footer">
          <q-btn
            flat
            class="full-width"
            :label="$t('generic.cancel')"
            @click.stop.passive="opened = false"
            icon="clear"
          />
        </q-toolbar>
        <div class="q-mb-xl q-mt-xl">
          <q-inner-loading :visible="tree.length === 0">
            <q-spinner size="150px" color="primary" />
          </q-inner-loading>
          <div v-for="item in tree" :key="item.value">
            <q-btn
              class="row full-width"
              align="left"
              :icon="item.subtree.length ? 'keyboard_arrow_down' : 'keyboard_arrow_right'"
              :label="item.label"
              no-caps
              no-ripple
              flat
              dense
              @click.stop.passive="handleSubtreeToggle(item.value)"
              color="dark"
            />
            <div class="row full-width">
              <q-btn
                v-for="subitem in item.subtree" :key="subitem.value"
                no-caps
                no-ripple
                flat
                dense
                class="col-sm-3 no-wrap"
                icon="done"
                color="primary"
                align="left"
                :label="subitem.label"
                @click.stop.passive="select(subitem.value)"
              />
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-btn
      v-if="value !== null"
      flat
      size="form"
      dense
      color="faded"
      class="col-2"
      @click.stop.passive="$emit('input', null)"
      icon="clear"
    />
  </div>
</template>

<script>
/*
 * Because the number of nodes can get very large a lot of work has gone in to the performance tuning of this.
 *
 * Some notes about what to watch out for:
 * 1) There can be many AppMeasurementSelect components on a single page, so the tree isn't generated when the component
 *    is loaded and is instead delayed until the user clicks to open it. This drastically reduces the amount of DOM
 *    elements, observers, etc.
 * 2) To save further DOM elements, observers, etc. the subtree for each measurement is generated on the fly.
 * 3) The entire tree is destroyed every time the modal window is closed in order to free up memory before the next
 *    AppMeasurementSelect might be opened. This is done with a slight delay to let the modal window close giving the
 *    'feeling' that things are working smoothly.
 * 4) Animations have mostly been disabled because they aren't smooth given the number of DOM elements, even on a
 *    laptop.
 */

import {
  getSubunitIncrementInMicrometers,
  getWholeUnitIncrementInMicrometers
} from '../types/unitOfMeasurementType'

export default {
  props: {
    value: Number,
    min: Number,
    max: Number,
    showSubunits: Boolean,
    unitOfMeasurement: String
  },
  data () {
    return {
      opened: false,
      tree: []
    }
  },
  watch: {
    opened (newValue, oldValue) {
      // setTimeout lets the modal window open/close before hanging on a redraw thus 'feeling' quicker
      if (newValue) {
        setTimeout(this.computeTree, 10)
      } else {
        setTimeout(() => { this.tree = [] }, 10)
      }
    }
  },
  methods: {
    computeTree () {
      let increment = getWholeUnitIncrementInMicrometers(this.unitOfMeasurement)
      for (let i = this.min; i <= this.max; i += increment) {
        this.tree.push({
          label: this.$unitOfMeasurement.valueToText(i, this.unitOfMeasurement),
          value: i,
          subtree: [] // Dynamically generated to considerably reduce number of DOM elements.
        })
      }
    },
    select (value) {
      this.tree = []
      this.opened = false
      this.$emit('input', value)
    },
    handleSubtreeToggle (value) {
      // I'm keeping the original clean version here just so you can see that this is not readable for a reason :)
      // On low-range Android devices the following map technique was too slow so I replaced it with the forEach/splice
      // below instead for performance reasons.

      // this.tree = this.tree.map((node) =>
      //   node.value === value && node.subtree.length === 0 ? this.openSubtree(node) : this.closeSubtree(node)
      // )
      this.tree.forEach((node, i) => {
        let change = false
        if (node.value === value && node.subtree.length === 0) {
          node = this.openSubtree(node)
          change = true
        } else if (node.subtree.length > 0) {
          node = this.closeSubtree(node)
          change = true
        }
        if (change) {
          this.tree.splice(i, 1, node)
        }
      })
    },
    closeSubtree (node) {
      if (node.subtree.length > 0) {
        node.subtree = []
      }

      return node
    },
    openSubtree (node) {
      node.subtree = []
      let increment = getSubunitIncrementInMicrometers(this.unitOfMeasurement)
      let end = node.value + getWholeUnitIncrementInMicrometers(this.unitOfMeasurement)
      for (let i = node.value; i < end && i <= this.max; i += increment) {
        node.subtree.push({
          label: this.$unitOfMeasurement.valueToText(i, this.unitOfMeasurement),
          value: i
        })
      }

      return node
    }
  }
}
</script>

<style lang="stylus">
  @import '~variables'

  .q-field-with-error
    color $negative

  .q-field-with-error .q-btn:first-of-type
    color $negative !important
</style>
