/**
 * Расширение модели поддержкой полей.
 * @package evas-vue-filter-plugin
 * @author Almaz Farkhutdinov <prodvair.almaz@ya.ru>
 * @license CC-BY-4.0
 */

import { setModelFields } from 'evas-vue-store-plugin/src/Model/Model.fields'
export function setFilterFields(FilterModel) {
    setModelFields(FilterModel)

    /**
     * Очистка данных полей.
     * @param Array имена полей
     * @return Array имена полей
     */
    FilterModel.prototype.$clearFields = function (fieldNames = null) {
        if (!fieldNames) fieldNames = this.$fieldNames()
        fieldNames.forEach(name => {
            this[name] = this.$field(name).getDefault()
        })
        return fieldNames
    }

    FilterModel.fieldsByType = function (type, names = null) {
        const fieldNames = []
        this.eachFields(field => {
            if (field.filter === type) fieldNames.push(field)
        }, names)
        return fieldNames
    }

    FilterModel.prototype.$fieldsByType = function (type, names = null) {
        return this.constructor.fieldsByType(type, names)
    }

    FilterModel.prototype.$resetFieldsByType = function (type, defaultParam = {}, names = null) {
        this.$fieldsByType(type, names).forEach(field => {
            this[field.name] = field.convertTypeWithDefault(defaultParam?.[field.name])
        })
    }
}
