<template>
  <div>
    {{ $unitOfMeasurement.valueToText(value, unitOfMeasurement) }}
    <q-chip
      @click.stop.prevent="open()"
      outline
      class="q-ml-md cursor-pointer"
      dense
      round
      color="primary"
    >
      <q-icon name="tune" />
    </q-chip>
    <q-modal v-model="opened">
      <q-tree
        accordion
        :no-nodes-label="$t('generic.loading')"
        :nodes="tree"
        node-key="id"
        @lazy-load="onLazyLoad"
      >
        <div slot="header-generic" slot-scope="prop">
          {{ prop.node.label }}
          <q-btn
            icon="done"
            flat
            dense
            class="q-ml-sm"
            color="primary"
            @click.stop.prevent="
              $emit('input', prop.node.value)
              opened = false
            "
          />
        </div>
      </q-tree>
    </q-modal>
  </div>
</template>

<script>
import { uid } from 'quasar'
import {
  unitOfMeasurementToMicrometers,
  subunitListInMicrometers
} from '../types/unitOfMeasurementType'

export default {
  props: [ 'value', 'min', 'max', 'unitOfMeasurement' ],
  data () {
    return {
      opened: false,
      /*
       * First: in order to improve initial rendering performance I don't want to use a computed property for the tree
       * which causes a considerable rendering delay for loading the QTree with a full list of measurements. Instead I
       * want the tree to be rendered only when it's needed.
       *
       * Second: the QTree component tries to be clever when deciding what to render and with lazy loaded sub-items when
       * you change what values are in the tree it stops showing the expansion arrow for some existing ones.
       *
       * So force a recompute if the min/max values change, treating the new values as different to the old ones (even
       * if they're the same) by using a unique ID so that we bust the internal caching of the QTree component.
       */
      recompute: true,
      tree: []
    }
  },
  watch: {
    min (newValue, oldValue) {
      this.recompute = true
    },
    max (newValue, oldValue) {
      this.recompute = true
    }
  },
  methods: {
    open () {
      this.computeTree()
      this.opened = true
    },
    computeTree () {
      if (!this.recompute && this.tree.length > 0) {
        return
      }

      this.tree = []

      setTimeout(() => {
        for (let i = this.min; i <= this.max; ++i) {
          let micrometers = unitOfMeasurementToMicrometers([i, 0], this.unitOfMeasurement)
          this.tree.push({
            label: this.$unitOfMeasurement.valueToText(micrometers, this.unitOfMeasurement),
            header: 'generic',
            lazy: true,
            id: uid(),
            value: micrometers
          })
        }
      }, 100)

      this.recompute = false
    },
    // Lazy load subunit selection to reduce number of DOM elements considerably.
    onLazyLoad ({ node, done }) {
      done(subunitListInMicrometers(this.unitOfMeasurement).map(subUnitInMicrometers => {
        return {
          label: this.$unitOfMeasurement.valueToText(node.value + subUnitInMicrometers, this.unitOfMeasurement),
          header: 'generic',
          value: node.value + subUnitInMicrometers,
          id: uid()
        }
      }))
    }
  }
}
</script>

<style lang="stylus">
  @import '~variables'

  .q-field-with-error
    color $negative
</style>
