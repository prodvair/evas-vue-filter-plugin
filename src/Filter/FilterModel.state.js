/**
 * Расширение модели поддержкой состоянием.
 * @package evas-vue-filter-plugin
 * @author Almaz Farkhutdinov <prodvair.almaz@ya.ru>
 * @license CC-BY-4.0
 */
import { setModelState } from 'evas-vue-store-plugin/src/Model/Model.state.js'

export function setFilterState(FilterModel) {
    setModelState(FilterModel)

    /**
     * Получение имён изменённых полей и связанных записей.
     * @param Array|null имена полей и/или связей
     * @return String[]
     */
    FilterModel.prototype.$dirtyFields = function (names) {
        let dirty = []
        this.constructor.eachFields((field) => {
            if (this.$isDirtyField(field.name)) dirty.push(field.name)
        }, names)
        return dirty
    }

    /**
     * Проверка поля на изменённость.
     * @param String|Number имя поля
     * @return Boolean
     */
    FilterModel.prototype.$isDirtyField = function (name) {
        let defaultValue = this.$field(name).getDefault()
        let value = this[name]
        if (Array.isArray(defaultValue) && Array.isArray(value)) {
            return JSON.stringify(defaultValue) !== JSON.stringify(value)
        } else if (typeof(defaultValue) === 'object' && ![null, undefined].includes(defaultValue)) {
            return JSON.stringify(defaultValue) !== JSON.stringify(value)
        } else if ([null, undefined].includes(defaultValue) && value === '') {
            return false
        }
        return defaultValue !== value
    }

    /**
     * Количество изменённых полей.
     * @param Array имена полей
     * @return Array имена полей
     */
    FilterModel.prototype.$dirtyFieldsCount = function (names) {
        // const getNames = names => {
        //     if (names?.items) names = Object.values(names.items)
        //     if (Array.isArray(names) && 'string' === typeof names[0]) return names
        //     return names
        // }

        return (
            this.$dirtyFields(
                (names?.items ? Object.values(names.items) : names)?.map(
                    (name, key) => (String(name) ?? String(key) ?? '').split('->')[0]
                )
            )?.length || 0
        )
    }
}
