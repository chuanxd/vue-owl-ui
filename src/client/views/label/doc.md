# Label

## Props

```js
{
  name: 'Label',
  props: {
    typ: {
      type: String,
      default: 'label'
      //label, outline, tag
    },
    status: {
      type: String,
      default: 'default'
      //default, primary, success, error, warning, inverted
    },
    badge: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    }
  }
},
{
  name: 'LabelGroup',
  props: {
    options: {
      type: Array,
      required: true
    },
    focused: {
      type: Number,
      default: -1
    },
    displayKey: {
      type: String,
      required: true
    },
    newTag: {
      type: Boolean,
      default: false
    },
    newTagMsg: {
      type: String,
      default: '+ New Tag'
    },
    preventDuplicate: {
      type: Boolean,
      default: true
    }
    /* typ, status, badge, and x are the same as 'Label'*/
  }
}
```

## Options data structure for `<Label.Group>`
The `options` of props must be an `Array Object`.  
Give `displayKey` to determine what should be display in a single list

Suggested format:
```json
[
  { value: 'winnie', title: 'Winnie The Pooh' },
  { value: 'piglet', title: 'Piglet' },
  { value: 'tigger', title: 'Tigger' }
]
```

## Usage

### Label

Labels
```jsx
<Label>Default</Label>
<Label status="primary">Primary</Label>
```
Outline
```
<Label typ="outline">Default</Label>
<Label typ="outline" status="primary">Primary</Label>
```
Tags
```jsx
<Label typ="tag">Default</Label>
<Label typ="tag" status="primary">Primary</Label>
```
Badges
```jsx
<Label badge={true}>Default</Label>
<Label badge={true} status="primary">1</Label>
```
Badge Outline
```jsx
<Label badge={true} typ="outline">Default</Label>
<Label badge={true} typ="outline" status="primary">1</Label>
```
Closable Label (the style)
```jsx
<Label x badge status="success">hello</Label>
<Label x badge status="primary" typ="outline">This</Label>
```

### Label Group  

1. Use `onChange` as a listener to get existing label data from `$emit('change')`  
2. Use `onRemove` as a listener to get removed data from `$emit('remove')`
 (supported when `<Label.Group>` with `x={true}`)  
3. Use `onCreate` as a listener to get newly added data from `$emit('create')`
(supported when `<Label.Group>` with `newTag={true}`)  
4. get labelGroup data by `this.$refs.labelGroup.labelData`
```jsx
data() {
 return {
   options: [
     { value: 'Winnie The Pooh' },
     { value: 'Piglet' },
     { value: 'Tigger' }
   ]
 }
},

methods: {
  getLabelGroupData((data) => console.log(data))
},

render(h) {
  return (
    <Label.Group  displayKey="value" 
                  ref="labelGroup"
                  typ="outline" 
                  x={true} 
                  badge={true} 
                  newTag={true}
                  options={this.options} 
                  onChange={this.getLabelGroupData} 
                  focused={1}
    />
  )
}
```

## Demo
