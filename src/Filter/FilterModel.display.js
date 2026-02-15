/**
 * Расширение модели поддержкой отображения полей.
 * @package evas-vue-filter-plugin
 * @author Almaz Farkhutdinov <prodvair.almaz@ya.ru>
 * @license CC-BY-4.0
 */

import { Collapse } from './FieldGroupping'
import { setModelFieldsDisplay } from 'evas-vue-store-plugin/src/Model/Model.fields.display.js'

export function setFilterFieldsDisplay(FilterModel) {
    setModelFieldsDisplay(FilterModel)

    /**
     * Группировка полей в группу-блок.
     * @param String|Number имя группы
     * @param Array|Object содержимое группы
     * @return Block
     */
    FilterModel.collapse = function (name, items, ctx, props = {}) {
        return new Collapse(name, items, ctx, props)
    }
    FilterModel.prototype.$collapse = function (name, items, props = {}) {
        return this.constructor.collapse(name, items, this, props)
    }

    /**
     * Группировка полей в группы-скрывающийся-блоков.
     * @param Array|Object группы-скрывающийся-блоки
     * @return Array
     */
    FilterModel.collapses = function (items, ctx, props = {}) {
        return Object.entries(items).map(([name, item]) => {
            return this.collapse(name, item, ctx, props)
        })
    }
    FilterModel.prototype.$collapses = function (items, props = {}) {
        return this.constructor.collapses(items, this, props)
    }

    FilterModel.closeCollapses = function (displayGroup) {
        if (displayGroup?.type === 'collapse') {
            displayGroup.props = { ...displayGroup.props, open: false }
        } else if (displayGroup?.items) {
            Object.keys(displayGroup.items).forEach(key => {
                displayGroup.items[key] = this.closeCollapses(displayGroup.items[key])
            })
        }
        return displayGroup
    }

    FilterModel.prototype.$closeCollapses = function () {
        this.$displayGroup = this.constructor.closeCollapses(this.$displayGroup)
    }

    FilterModel.prototype.$getFieldNamesWithoutDisplay = function (type, names = null) {
        const fieldNames = []
        this.$fieldsByType(type, names).forEach(
            field => !field.display && fieldNames.push(field.name)
        )
        return fieldNames
    }
}
