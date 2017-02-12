<!--CSS-->
<style scoped>  
 
  form .fade-enter-active, .fade-leave-active {  transition: opacity 1.5s }
  form .fade-enter, .fade-leave-to{ opacity: 0 }

</style>

<!--HTML-->
<template>     

  <form id="form-base" >

    <slot></slot>
    
    <ul class="collection"> 
        <slot name="collection"></slot>

      <li class="collection-item" :class="getItemClassName(obj)" v-for="(obj, index) in flatCombinedArraySorted" v-if="obj.schema.hidden !== true">
        
        <slot name="item"></slot>
        <slot :name="getTypeClassName(obj)"></slot>
        <slot :name="getKeyClassName(obj)"></slot>
        
        <div class="label">
          <label v-if="obj.schema.label !== null" :for="makeKeyUnique(obj)">{{obj.schema.label || obj.key}}</label>
        </div>
        
        <!-- type select-->
        <!--IMPORTANT class="browser-default" must be set in <select> for working VUE.JS with MATERIALIZE.CSS-->
        <select :id="makeKeyUnique(obj,index)"  class="browser-default select" v-if="obj.schema.type === 'select'" 
          :readonly="obj.schema.readonly" :required="obj.schema.required" :disabled="obj.schema.disabled" 
          :title="obj.schema.title" @change="setValue($event, obj)">              
          <option v-for="val in obj.schema.options" :selected="val == obj.value" :value="val">{{val}}</option>
        </select>

        <!-- type multiselect -->
        <!--IMPORTANT class="browser-default" must be set in <multiselect> for working VUE.JS with MATERIALIZE.CSS-->
        <select :id="makeKeyUnique(obj,index)"  class="browser-default multiselect" v-if="obj.schema.type === 'multiselect'" multiple
          :readonly="obj.schema.readonly" :required="obj.schema.required" :disabled="obj.schema.disabled"             
          :title="obj.schema.title" @change="setValue($event, obj)">              
          <option v-for="val in obj.schema.options" :selected="obj.value && obj.value.includes(val)" :value="val">{{val}}</option>
        </select>

        <!-- type radio -->
        <div :id="makeKeyUnique(obj)" v-if="obj.schema.type === 'radio'" >     
          <template v-for="(val, idx) in obj.schema.options" >
            <input :id="makeKeyUnique(obj, idx)"  :name="obj.key" type="radio" :readonly="obj.schema.readonly" 
            :required="obj.schema.required" :disabled="obj.schema.disabled"             
            :title="obj.schema.title" :value="val" :checked="val === obj.value" @change="setValue($event, obj)" @input="setValue($event, obj)" />
            <label :for="makeKeyUnique(obj, idx)" >{{val}}</label>
          <template>
        </div>
  
        <!-- type file -->
        <div class="file-field input-field" v-if="obj.schema.type === 'file'" >
          <div class="btn button">
            <span>{{obj.schema.label}}</span>
            <input :id="makeKeyUnique(obj)"  type="file" 
              :readonly="obj.schema.readonly" :required="obj.schema.required" :disabled="obj.schema.disabled" :accept="obj.schema.accept"  
              :title="obj.schema.title" :multiple="obj.schema.multiple || false" :pattern="obj.schema.pattern" @change="setValue($event, obj)"  />
          </div>
          <div class="file-path-wrapper" >
            <input class="file-path path" type="text" :value="getValue(obj)" :placeholder="placeholder(obj)" 
            :readonly="obj.schema.readonly" :disabled="obj.schema.disabled">
          </div>
        </div>
        

        <!-- all input types except radio, select or file -->
        <div v-if="obj.schema.type !== 'file' && obj.schema.type !== 'radio' && obj.schema.type !== 'select' && obj.schema.type !== 'multiselect'" >
          
          <input :id="makeKeyUnique(obj)" :list="makeKeyUnique(obj,index)" :type="obj.schema.type" 
          :readonly="obj.schema.readonly" :required="obj.schema.required" :disabled="obj.schema.disabled" :placeholder="placeholder(obj)"
          :title="obj.schema.title" :maxlength="obj.schema.maxlength" :min="obj.schema.min" :max="obj.schema.max" :step="obj.schema.step" :pattern="obj.schema.pattern" 
          :value="getValue(obj)" :checked="setCheckbox(obj)" @change="setValue($event, obj)" @invalid="setValue($event, obj)"  @input="setValue($event, obj)" />
           
          <!-- if type checkbox then set label -->
          <label v-if="obj.schema.type === 'checkbox'" :for="makeKeyUnique(obj)" >{{obj.value}}</label>
          
          <!-- if options has array && optional type is list -->
          <datalist :id="makeKeyUnique(obj,index)" v-if="Array.isArray(obj.schema.options)" >
            <option v-for="val in obj.schema.options" :value="val"></option>
          </datalist>
        
        </div>

        <transition name="fade">
          <div class="error" v-if="obj.schema.error"><span>{{obj.schema.error}}<span></div>
        </transition>
        
      </li>

    </ul>    

  </form> 

</template>

<!--Script-->
<script>
  
  import { isString, isPlainObject, isFunction, isUndefined, clone, cloneDeep, orderBy } from 'lodash'     

  const sortDirection = 'ASC'         // sort formular item 'asc' or 'desc'
  const pathDelimiter = '.'               
  const makeKeyUniqueDelimiter ='-'
  const typeClassAppendix = '-type'
  const keyClassAppendix = '-key'
  const keyIndividualizer = Math.random().toString(36).substr(2, 3)

  export default {
    
    name:'vue-form-base',

    props: {
      data:{
        type: Object,
        required: true
      },    
      schema:{
        type: Object,
        required: true
      },      
      dataStateName:{
        type: String,
        required: true
      },
      schemaStateName:{
        type: String,
        required: false
      },
    },

    data(){      
      return {
        keyIndividualizer,
        flatCombinedArray: [], 
        noSchemaStateName: {}  
      }
    },
       
    computed:{
      
      flatCombinedArraySorted(){ return orderBy(this.flatCombinedArray, ['schema.order'], [sortDirection])  },
      
      dataState: { 
        get: function(){  
          this.updateArrayFromState(this.flatCombinedArray, this.$store.state[this.dataStateName]); 
          return this.$store.state[this.dataStateName] || {}         
        }, 
        set: function(val){ 
          this.$store.state[this.dataStateName] = val 
        }      
      },
     
      schemaState: { 
        get: function(){ 
          return this.schemaStateName ? this.$store.state[this.schemaStateName] || {} : this.noSchemaStateName
        }, 
        set: function(val){ 
          this.schemaStateName ? this.$store.state[this.schemaStateName] = val : this.noSchemaStateName = val
        }      
      }      


    },
    
    methods:{ 
     
    
      makeKeyUnique(obj, idx=''){
        // needed to avoid conflict with same attr[id] when displaying more than one editor-base component 
        return obj.key + makeKeyUniqueDelimiter + this.keyIndividualizer + idx
      },

      redoMakeKeyUnique(key){
        // needed to avoid conflict with same attr[id] when displaying more than one editor-base component 
        return key.split(makeKeyUniqueDelimiter)[0] 
      },

      placeholder(obj){ 
        // set placeholder definition
        // if placeholder is null display nothing, 
        // if placeholder is undefined then take label definition as placeholder        
        return obj.schema.placeholder === null ? null : obj.schema.placeholder || obj.schema.label 
      },

      setCheckbox(obj){
        if (obj.schema.type !== 'checkbox') return 
        return obj.schema.true ? obj.schema.true === obj.value : obj.value
      },
      
      getKeyClassName(obj){
        // get key specific class name by replacing '.' with '-' and appending '-key' 
        return this.redoMakeKeyUnique(obj.key).replace(/\./g,'-') + keyClassAppendix
      },

      getTypeClassName(obj){        
        // get type specific class name by appending '-type' 
        return obj.schema.type + typeClassAppendix
      },

      getItemClassName(obj){
        // each item get a class 'item' , a class type-item like 'select-item' and a class key-item like 'adress.city-item'       
        return `item ${this.getTypeClassName(obj)} ${this.getKeyClassName(obj)}`
      },

      getValidationMessage(target){
        // if title has value use title as validation message
        return target.title ? target.title : target.validationMessage    
      },

      noValidate(value, obj, data, schema){
         isFunction(obj.schema.noValidate) ? obj.schema.noValidate(value, obj, data, schema) : obj.schema.error = null          
      },

      validate(msg, obj, data, schema, validity){
        isFunction(obj.schema.validate) ? obj.schema.validate(msg, obj, data, schema, validity) : obj.schema.error = msg          
      },

      mapGet(value, obj, data, schema){
        // Map Value before being displayed
        // handle incoming values with mapGet()    
        return isFunction(obj.schema.mapGet) ? obj.schema.mapGet(value, obj, data, schema) : value
      },  

      getValue(obj){            
        return this.mapGet(obj.value, obj, this.dataState, this.schemaState)
      },

      mapSet(value, obj, data, schema){
        // Map Value before is stored in VUEX state
        // handle outgoing values with mapSet()    
        return isFunction(obj.schema.mapSet) ? obj.schema.mapSet(value, obj, data, schema) : value
      },
      
      setValue( {target}, obj){
        
        // execute validate(validationMessage, obj, data, schema, validity) if 'validate' defined and validationMessage is available  
        if ( target.validationMessage ) { 
          if (obj.schema.validate) this.validate( this.getValidationMessage(target) , obj, this.dataState, this.schemaState, target.validity)
        } else {
          this.noValidate(value, obj, this.dataState, this.schemaState)
        } 

        // get key from event.target, handles 
        let key = target ? (target.list ? target.list.id : (target.type === 'radio' ? target.parentElement.id :target.id)) : null
        
        // get original key == path in nested object
        key = this.redoMakeKeyUnique(key)

        // get value from event.target
        let value =  target ? target.value : null
        
        // prepare value from <input type checkbox>
        value =  target.type === 'checkbox' ? (target.checked ? obj.schema.true || true: obj.schema.false || false): value
        
        // prepare value from <select>
        value = target.selectedOptions ? Array.from(target.selectedOptions).map( o => o.value ) : value 

        // prepare value from <input type file>
        value = obj.schema.type === 'file' ? Array.from(target.files).map( f =>f.name ) : value
        
        // call mapper for setting value
        value = this.mapSet(value, obj, this.dataState, this.schemaState )
   
        // update State with value        
        this.setObjectByPath(this.dataState, obj.key, value)

        // update Array for Display with value        
        this.updateArrayFromState(this.flatCombinedArray, this.$store.state[this.dataStateName])

      },

      updateArrayFromState(flatArray, dataState) {       
        // update for each key the value and schema 
        this.flatCombinedArray.forEach( obj => {
          obj.value = this.getObjectValueByPath(dataState, obj.key)
          obj.schema = this.getObjectValueByPath(this.schemaState, obj.key)
        })

      },

      getObjectValueByPath(object, path){
        // resolves chained keys (like 'user.adress.street') on an object and returns the value 
        let pathArray=path.split(pathDelimiter)
        let value
        pathArray.forEach((p, ix) => {
          if(ix === pathArray.length -1 ) value = object[p]  
          if ( isUndefined(object[p]) ) return  
          object = object[p]
        })
        return value
      },

      setObjectByPath(object, path, value) {
        // resolves chained keys (like 'user.adress.street') on an object and set the value 
        let pathArray=path.split(pathDelimiter)
        pathArray.forEach((p, ix) => {
          if(ix === pathArray.length -1 ) object[p] = value
          object = object[p]
        })
      },

      getSanitizedSchema(sch, i){
        let sanitizedSchema = (typeof sch[i] === 'string') ? { type: sch[i] } : sch[i] // shorthand definition of type ->  schema:{ pw:'password' }
        if (!sanitizedSchema.type) sanitizedSchema.type = 'text'  // no type defined, then take default type:'text'    
        return sanitizedSchema;
    },

      flattenObjects(obj,sch) {
        let object = {}
        let schema = {}
      
        Object.keys(obj).forEach( i => {
          if ( !Array.isArray(obj[i]) && typeof obj[i] === 'object' && obj[i]){
            let {object: flatObject, schema: flatSchema } = this.flattenObjects(obj[i], sch[i])
            Object.keys(flatObject).forEach(ii => {
              object[i + pathDelimiter + ii] = flatObject[ii]
              schema[i + pathDelimiter + ii] = flatSchema[ii]
            })
          } else { 
            object[i] = obj[i]
            schema[i] = this.getSanitizedSchema(sch, i)        
          }
        })
   
        return {object, schema}
      },

      combineObjectsToArray( {object, schema} ){

        let arr = [];
        
        Object.keys(object).forEach(key => {  
          // if no schema for object-key then skip           
          if (!schema[key]) return  
          arr.push( {key:key, value:object[key], schema:schema[key]} )
        })
          
        return arr
      },

      flattenAndCombineToArray (object,schema) {
        
        // flatten nested structure of two objects 'data' & 'schema'  
        let flattenedObjects = this.flattenObjects(object, schema)
        
        // ... and combine them to an array
        return this.combineObjectsToArray(flattenedObjects)
        
      }

    },
    created(){
      
      console.log('data', this.data, )
      console.log('schema', this.schema, )
      console.log('dataStateName', this.dataStateName)
      console.log('schemaStateName', this.schemaStateName)

    },

    mounted(){        

      // check necessary props 
      if (!this.data || !isPlainObject(this.data) )  throw `Check '<form-base :data="..." >'! Property 'data' seem to be not an object or undefined!`
      if (!this.schema || !isPlainObject(this.schema) ) throw `Check '<form-base :schema="..." >'! Property 'schema' seem to be not an object or undefined!`
      if (!this.dataStateName || !isString(this.dataStateName) ) throw `Check '<form-base :dataStateName="..." >'! Property 'dataStateName' seem to be not a string or undefined!`
      if ( this.schemaStateName && !isString(this.schemaStateName) ) throw `Check '<form-base :schemaStateName="..." >'! Property 'schemaStateName' seem to be not a string!`
      
      // decouple state dataState/schemaState from prop data/schema
      this.dataState = cloneDeep(this.data) 
      this.schemaState = cloneDeep(this.schema) 

      // make flat array which combines deep nested data & schema object
      // flatCombinedArray is array used by v-for for displaying data
      this.flatCombinedArray = this.flattenAndCombineToArray(this.dataState, this.schemaState)
        
    } 

  }
</script>


