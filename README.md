
Vue-Form-Base
===

`vue-form-base` is a Vue-component and Form-Generator for editing plain or nested Javascript objects. 

You have to code a lot of forms for different objects, `vue-form-base` can simplify your job by creating new forms for each different kind of object. 

Select from different input-types like Text, Password, Checkboxes, Radios, Select, Multiselect, Color, Files or a lot of other fields. In most cases the browser specific implemention of input-types is used. 

Simply provide a Schema containing same properties as your Data Model and define the fields you need.


    data:{ 
      name: 'smith',
      email:'smith@online.com', 
      password: '12345',
      adress:{ 
        city:'NY', 
      } 
    }
    
    schema:{ 
      name: 'text',
      email: {type:'email', validate:true, placeholder:'Email...' }, 
      password: {type:'password', label:'Numbers only', pattern:'[0-9]*', validate: msg => console.log(msg) },
      adress:{ 
        city:{ type:'text', mapSet: v => v && v.toUpperCase() }
      } 
    }


We use the [Materialize CSS](http://materializecss.com/) framework for styling. Input Fields have a clear design, but don't worry you can change your layout with CSS in a lot of ways. For more details see *Style with CSS*

Add global validation to the form or validate only a single field. Use inline validation or write a new function for individuell validation. 

Make complex data editable and map your incoming and outgoing data:  i.e. change dateformats, trim strings or join/split arrays for editing in a textfield. 

Features
===

* vue-component
* edit plain or deep nested objects
* support most of input types
* full reactive result
* configurable via Schema Defintion
* configurable Style based on Materialize CSS 


Reactive Result (Vuex)
===

Model `Data` und describing `Schema` flow as prop into the `Vue-Form-Base`. On the concept of *one-way data flow* you get reactive access to your modified data via Vuex Store `$store.state.datastate` . Installed Vuex is mandatory, details about Vuex you can find here [Vuex-Introduction](https://vuex.vuejs.org/en/intro.html)

    <form-base :data="data" :schema="schema" data-state-name="datastate" />

If you need to dynamically modify the internal Schema (for example if you want to change dynamically `schema.hidden` to show/hide one item depending from the input of another item) you can have reactive access to the modified Schema via Vuex Store `$store.state.schemastate`.

Inside a vue file you can declare your component.
		
    <template>
	   <form-base 
		    :data="data" 
		    :schema="schema" 
		    data-state-name="datastate" 
		    schema-state-name="schemastate" 
	    />
    </template>
    
**Access** the edited result via Vuex State

    this.$store.state.datastate


**Reset**  modified Data and modified Schema use following code inside the parent vue.file
	
	...
	methods:{
	    reset(){
	      this.$store.state.datastate= cloneDeep(this.data); 
	      this.$store.state.schemastate= cloneDeep(this.schema)
	    },
	    ...  
	  },
	  ...

In common use cases without modified Schema **Reset** looks inside a **Vue-File** shortened  like this 

	<template>
      
      {{$store.state.datastate}}

      <form-base :data="data" :schema="schema" data-state-name="datastate" />
	
    </template>
	
	<script>
		import { cloneDeep } from 'lodash'

		export default {
		...
		methods:{
		    reset(){
		      this.$store.state.datastate= cloneDeep(this.data); 
		    },
		    ...  
		},
		...
	</script>


	
Declare a simple **Data- and Schema Object** in your vue-file   

    ...
    data() {
	    return {  
		   data:{ 
			    name: 'Smith',
			    password: '12345',
			    email:'smith@online.com', 
			    adress:{ 
				    city:'NY', 
				    street:'4th Av' // ignored no schema definition
				    code:'12345', 
			    } 
		    },
		    schema:{ 
			    name: 'text', 
			    password: 'password',
			    email:'email',
			    adress:{ 
				    city:'text',
				    code:'text'
			    } 
		    }
		}
	},
	...

>INFO: Properties, which are in Schema-Object not defined, are in Data-Object ignored.

Vue-Form-Base use the Materialize - CSS Framework. Input Fields have a simple design, but don't worry you can change the CSS-Layout in lot of ways. Change each type or each item separately.   

Schema
===

	 <form-base :schema="schema" ... />

Schema is an object, which defines and controls the behavior of your form. Each Key in your data-object must reflect a key in the schema-object. 

The  key could hold oly a string which represents the kind of type:
	
	schema:{
		name1: 'text',
		// is the same as
		name2: { type:'text'},
	}
	
In common use cases the the value will be an object with several properties, to get different control over the behaviour of your input-field. 	

**Properties of Schema**

  
	schema:{ 
		order: number,          // controls order of displaying 
		
		type: string,           // 'text', 'password', 'email', ...
		label: string,          // title of item    
		placeholder: string,    // placeholder set null to hide 
		true: string,           // text if checkbox is checked  
		false: string,          // text if checkbox is unchecked 
		accept: string,         // type:'file' - limit files audio/*, image/*, .pdf
		title: string,          // define your own validation message
		error: string,          // preset/set inline error msg
		
		pattern: string         // regex to control input  
		
		min: number,            // limit number or range
		max: number,            // limit number or range
		step: number,        
		maxlength: number,      // max length of type text, password, email 
		
		multiple: bool,         // type:'file' select one or more files   
		required: bool,         // need an input value
		disabled: bool,         // disable input field
		readonly: bool,          
		hidden: bool,           // hide item - set from another item
		
		options: array,         // used with type: radio, list, text, select, mselect 
		
		mapGet: function,       function( val, obj, state, schema ) {... return val}	
		mapSet: function,       function( val, obj, state, schema ) {... return val} }
		
		validate: true          // use inline error message
		validate: function,     function( msg, obj, state, schema, validity ) {...}         noValidate: function,   function( value, obj, state, schema ) {...}
	}          
          

**Real-Life Example** 

    ...
    schema:{ 
	    
	    user: { type:'text', label:'Fullname:', placeholder:'Name...'}, 
	    
 	    email: {type:'email', validate:true, mapSet: v => v && v.toUpperCase() },
 	    
 	    singleRole:{ type:'select', options:['Admin','Guest','User'] }, 
 	   
      }
      ...
	

**Schema-Property Order:**:

The properties order in objects is not guaranteed in JavaScript, therefore you can define the order by seting property order with a number.
	 
    ...
    schema:{ 
      Second: { type:'text', order: 2 }
      First: { type:'text', order: 1 }
    }
    ...

**Schema-Property Type**:

You can use most of HTML5 `<input>` type attributes like 

    text, list, password, email, file, radio, checkbox,
    number, range, date, time, week, month, url, select, multiselect 


A description of HTML5 input types you can find here on [HTML5 Input Types](https://www.wufoo.com/html5)

    schema:{ 
	    
	    name: 'text',   // same as  { type:'text' }
 	    user: { type:'text', ... }, 
 	    password: {type:'password', ... }
 	    email: {type:'email', ... }
 	    singleRole:{ type:'select', ... }, 
 	    multiRole:{ type:'multiselect', ... } 
      
      }

**Schema-Property all others TODO**:

...





----------
Style with CSS 
---

Customize your **vue-form-base** component using the following CSS-Classnames

 

>  INFORMATION:  Don't use `<style scoped>` because scoped definitions
> are inside the child component not accessable

   
**Form-ID**

	#form-base is the default form-id. If you need different CSS for two or more forms then change default value by setting a different id for each component and use this new id  
	
	<form-base id="custom-id" ... />  
  
  and use
	  
	#custom-id .collection {...} 

**General - Classnames**


	  #form-base .collection {...}   
	   
	  #form-base .item {...}        

	  // style inline-error messages 
	  #form-base .error {...}       
	  
  **Validate with Pseudoselectors**
	  
	  #form-base .item input:invalid { background-color: #fdd; }
	  #form-base .item input:valid { background-color: #dfd; }
	  #form-base .item input:focus { background-color: #ffd; }          
  

**Type - Classnames** 

  You can use most of HTML5 input-types  `<input type="password" />` 
	  
	  [Some Informations to HTML5 input-types](https://www.wufoo.com/html5/)
	 
	  text,  password, email, select, multiselect, list, file, radio, checkbox,
	  number, range, url, date, time, week, month

Available are 'text', 'password', 'email', 'select', 'multiselect', 'list', 'file', 'radio', 'checkbox', 'number', 'range', 'url', 'date', 'time', 'week', 'month'
 
	  #form-base .item.text-type {...}
	  #form-base .item.select-type {...}
	  #form-base .item.multiselect-type {...}
	  #form-base .item.checkbox-type {...}
	  
**Make validate CSS for multiselect type**
 
	 #form-base .item.multiselect-item input:invalid {...}
	 #form-base .item.multiselect-item select { height:6rem }


  **Key - Classnames** 
  Here you get direct access to each key in your data-object
 
	  #form-base .item.lastname-key {...}
	  // deep nested key
	  #form-base .item.user-adress-city-key {...}    

  **Validate CSS for individual key**
  
	  #form-base .item.adress-city-key input:invalid{...}
	  #form-base .item.lastname-key input:focus{...}          
    
    
Dependencies
===

* Vue 2.0

* Vuex

* lodash

* Materialize CSSs


Installation
===

... TODO

Example
===

a)
I created an example with vue-webapp template, checkout example directory in this repo and follow the readme.

b) 
Here is a working vue-file, integrate this in your vue-project. lodash and vuex must be installed
	
	
    <style>
      #form-base .error { color:red}
      #form-base .item input:invalid{ background-color: #fdd; }
    </style>
    
	<template>

      {{$store.state.datastate}}

      <hr>

      <form-base :data="data" :schema="schema" data-state-name="datastate" />   
          
    </template>

    import FormBase from './FormBase.vue';  

    export default {
  
      data () {
        return {  
      
          data:{
            user: 'smith',
            pw: 'secret'   
          },       
              
          schema:{
            user: { 
              type:'text', 
              label:'User:' 
            },
            pw: { 
              type:'password',
              pattern:'^.{6,}', 
              lable:'Password:',
                title: 'Password must have minimal 6 Chars',
              required:true,
              validate:true
            }
          }  
        } 
      },
    
      components:{     
          FormBase
      }
    }  
      






Similar Projects
===

[vue-form-generator](https://github.com/icebob/vue-form-generator)

[vue-formular](https://github.com/matfish2/vue-formular)





------




