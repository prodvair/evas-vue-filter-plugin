# Evas Vue Filter Plugin

Vue plugin adding filter contract for ORM [evas-vue-store-plugin](https://github.com/evasyakin/evas-vue-store-plugin)

## install

```
npm i evas-vue-filter-plugin
```

## Models syntax

```js
export class User {
    setFields() {
        return {
            nameIn: this.array(this.string()).wheres('name').condition('in'),
            nameDesc: this.boolean().orders('name'),
            page: this.number(1).page(),
            limit: this.number(10).options([10, 20]).limit(),
        }
    }
}
```

## Add plugin

```js
const app = createApp(App /** root component */).use(EvasVueFilter, {
    filters: { User }, // filter models
})
```

@prodvair
