/**
 * Модель фильтров.
 * @package evas-vue-filter-plugin
 * @author Almaz Farkhutdinov <prodvair.almaz@ya.ru>
 * @license CC-BY-4.0
 */

import { URLQueryParams } from '@prodvair/url-query-params'
import { setFilterFields } from './FilterModel.fields.js'
import { setFilterFieldsDisplay } from './FilterModel.display.js'
import { setFilterContract } from './FilterModel.contract.js'
import { setFilterState } from './FilterModel.state.js'
import { setFilterValidate } from './FilterModel.validate.js'

export class FilterModel {
    static entityName = null
    static queryAlias = {}

    set(target, key, value) {
        const field = target.constructor?.field(key)
        if (field) value = field.convertTypeWithDefault(value)
        target[key] = value
        return true
    }
    constructor(data = {}, setQuery = false) {
        this.$fill(data)
        if (setQuery) this.$setQueryDataIfExist()
        console.log(this.constructor.setFields(),new Proxy(this, this),this, '!!!2');
        return new Proxy(this, this)
    }

    get $entityName() {
        return this.constructor.entityName
    }
}

FilterModel.prototype.$setQueryDataIfExist = function () {
    const queryData = this.constructor.$queryUrl.queryParamsParse()
    if (!queryData) return
    let fieldTypeData = {}
    Object.keys(queryData).forEach(fieldName => {
        const field = this.$field(fieldName)
        if (!field) return
        if (!fieldTypeData[field.filter]) fieldTypeData[field.filter] = {}
        fieldTypeData[field.filter][fieldName] = queryData[fieldName]
    })
    Object.keys(fieldTypeData).forEach(type => this.$resetFieldsByType(type, fieldTypeData[type]))
}

/**
 * Заполнение свойств записи.
 * @param Object данные [имя поля/связи => значение]
 */
FilterModel.prototype.$fill = function (data) {
    this.constructor.eachFields(field => {
        // конвертируем тип значения
        this.set(this, field.name, field.convertTypeWithDefault(data?.[field.name]))
    })
}


FilterModel.$queryUrl = new URLQueryParams(FilterModel.queryAlias)

/**
 * Вывод Query параметров
 */
Object.defineProperty(FilterModel.prototype, '$queryParams', {
    get: function () {
        let params = {}
        this.constructor.eachFields(field => {
            let value = this[field.name]
            'object' === field.type &&
                !['globalSearch', 'groups'].includes(field.filter) &&
                value &&
                Object.keys(field.itemOf).forEach(key => {
                    if (field.isEmptyValue(this[field.name]?.[key])) value = null
                })
            if (field.queryable) params[field.name] = value
        })
        return this.constructor.$queryUrl.queryParamsBuild(params)
    },
})

FilterModel.isRootModel = function () {
    return this.name === 'FilterModel' // || this.entityName === null
}

// Расширения модели
setFilterFields(FilterModel)
setFilterFieldsDisplay(FilterModel)
setFilterState(FilterModel)
setFilterContract(FilterModel)
setFilterValidate(FilterModel)

