/**
 * Расширение модели поддержкой состоянием.
 * @package evas-vue-filter-plugin
 * @author Almaz Farkhutdinov <prodvair.almaz@ya.ru>
 * @license CC-BY-4.0
 */
import { setModelValidate } from 'evas-vue-store-plugin/src/Model/Model.validate'
import { Field, VariableField } from '../Field'

export function setFilterValidate(FilterModel) {
    setModelValidate(FilterModel)

    /**
     * Валидация записи.
     */
    FilterModel.prototype.$validate = function (fieldNames = null) {
        if (!fieldNames) fieldNames = this.$fieldNamesForValidate()
        this.$clearErrors()
        this.constructor.eachFields(field => {
            if (!(field instanceof VariableField || field instanceof Field)) return
            // console.warn(field.name, this[field.name])

            if (!field.isValid(this[field.name], this)) {
                this.constructor.handleValidateError(field, field.error)
                this.$errors.push(field.error)
            }
        }, fieldNames)
        return this.$errors.length < 1
    }
}
