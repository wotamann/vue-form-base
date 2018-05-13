<style>

  /*
    Customize your VUE-FORM-BASE component using the following CSS-Classnames
    -------------------------------------------------------------------------
    
    SCOPED - INFORMATION: don't use '<style scoped>' for this definitions, because a 'scoped' definition is inside the component not accessable 
      
    // FORM-ID  
    #form-base  // Is the default name. If you need different CSS for two forms then change default value 'form-base'  
                   by setting a different 'id' <form-base id="custom-id" ... /> for each component    

    // GENERAL classes ----------------------------------------------------------------------------------          
    #form-base .collection,   // 
    #form-base .item,         // for example, give all items the same backgroundcolor
    #form-base .error,        // style here your error messages 

    // VALIDATE CSS Pseudoselectors
    #form-base .item input:invalid{ background-color: #fdd; }
    #form-base .item input:valid{ background-color: #dfd; }
    #form-base .item input:focus{ background-color: #ffd; }          
    

    // TYPE specific classes ----------------------------------------------------------------------------
    // most typenames are the same types of HTML5 <input> tag, like for example <input type="password" /> 
    // all type implementation are browser dependent and in some browsers different.
    // Use [text],  password, email, select, multiselect, list, file, radio, checkbox, number, range, url, date, time, week, month
    #form-base .item.text-type,
    #form-base .item.select-type,
    #form-base .item.multiselect-type,
    #form-base .item.checkbox-type,
    
    // make invalid css for multiselect type
    #form-base .item.multiselect-item input:invalid{ background-color: #fc5; }
    #form-base .item.multiselect-item select { height:6rem }


    // KEY specific classes -----------------------------------------------------------------------------
    // here you have direct access to each key in your data-object
    #form-base .item.lastname-key,
    #form-base .item.user-address-city-key, // deep nested key

    // make invalid css for individual key
    #form-base .item.address-city-key input:invalid{ background-color: #fda; }
    #form-base .item.lastname-key input:focus{ background-color: #ff9; }          
    
    
  */

  /* ---- General CSS ---- */
  #form-base .collection { padding: 8px;  }
  #form-base .collection .item{ background-color: #efe; border-bottom: 1px solid #0c0}
  #right-form-base .collection .item{ background-color: #eeeeff; border-bottom: 1px solid #55f}

  /* ---- set INPUT Pseudoselectors valid, invalid, focus css for all items ---- */
  #form-base .item input:invalid{ background-color: #fdd; }
  #form-base .item input:valid{ background-color: #dfd; }
  #form-base .item input:focus{ background-color: #ffd; }    

  /* ---- set TYPE CSS ---- */
 
  /* set css for all items with type text */
  #right-form-base .text-type { color: #00d }
  

  /* ---- set KEY CSS ---- */

  /* set individual invalid-css only for password key */
  #form-base .item.password-key input:invalid{ background-color: darkorange; color: white }
  #right-form-base .item.password-key input:invalid{ background-color: purple; color: white } 
  
  /* set individual css for key mselect */
  #form-base .item.nested-selections-mselect-key select{ height:8rem; background-color: yellowgreen; color:white}
  #form-base .item.select-type select{ height:3rem; background-color: yellowgreen; color:white}
  
  /* set individual css for key fileselector */
  #form-base .item.fileselector-key .button { background-color: yellowgreen; color:white}
  #form-base .item.fileselector-key .path{ background-color: yellowgreen; color:white}
  
  .small {font-size: 0.85rem; color: #555; padding: 1rem}

</style>

<template>

  <div id="app" >
    
    <div class="small">
      <p>Unmutated Data:</p>
      <p>{{ data }}</p>
      
      <p>Reactive State:</p>    
      <p>{{ $store.state.data }}</p>
    
      <p>Reactive Schema:</p>    
      <p>{{ $store.state.schema }}</p>
      
      <button class="btn" @click="reset()">Reset</button> 
    </div>
   
       
      <div class="row">
      
        <!--use vue-form-base component LEFT-->
        <div class="col m6 s12">          
          <p>Left Formbase</p>
          
          <form-base :data="data" :schema="schema" data-state-name="data" schema-state-name="schema">
                           
          </form-base>
        
        </div>
        
        <!--use vue-form-base component RIGHT-->
        <div class="col m6 s12">          
          <p>Right Formbase (different CSS)</p>

          <form-base id="right-form-base" :data="data" :schema="schema" data-state-name="data" schema-state-name="schema" >
            <!--demo use of key named slots like: key-top-slot, key-bottom-slot -->
            <div slot="email-pre-slot" class="card blue white-text">key-pre-slot Item </div>       
            <div slot="email-top-slot" class="card amber white-text">key-top-slot Position</div>       
            <div slot="email-label-slot" class="card blue white-text">key-label-slot {{$store.state.schema &&  $store.state.schema.email.label}}</div>       
            <div slot="email-mid-slot" class="card amber white-text">key-mid-slot Position</div>       
            <div slot="email-input-slot" class="card blue white-text">key-input-slot replacing 
              <p class="white blue-text">{{ $store.state.data && $store.state.data.email}}</p>
            </div>       
            <div slot="email-bottom-slot" class="card amber white-text">key-bottom-slot Position</div>       
            <div slot="email-post-slot" class="card blue white-text">key-post-slot Item</div>       
            <div slot="email-error-slot" class="card white red-text">Slot@Error:{{$store.state.schema && $store.state.schema.email.error}}</div>     
           
            <!--use nested key named slots like: mykey-top-slot, mykey-bottom-slot -->                     
            <div slot="nested-selections-mselect-top-slot" class="card blue white-text">Named Slot at Top Position</div>       
            <div slot="nested-selections-mselect-bottom-slot" class="card blue white-text">Named Slot at Bottom Position</div>       
            
          </form-base>
        
        </div>             
        
      </div>
  </div>
</template>


<script>
  import FormBase from './components/FormBase.vue' // use local copy  
  // import FormBase from 'vue-form-base'  // use node_modules
  import { cloneDeep, isString, isArray } from 'lodash'

  export default {

    data() {
      return {  
    
        data:{

          title: 'MD',
          prename:'Dahlia',          
          lastname: "Wynestone",
          
          user: "smith",
          password: '12345',
          email:'smith@online.com',          
          
          nested:{
            checkbox: 'untouched',
            radio: 'Yoga', 
            color: '#bcdf2f',
          
            selections: {
              select: 'Resilience',             // preselected
              mselect: ['Yoga', 'Resilience'],  // preselected 
            },
          
          },

          fileselector:'green-tea.jpg',

        },

        schema:{    
          /*  Schema Definition and available Properties
              recommended info https://www.wufoo.com/html5/

              schema:{ 
                order: number,          // controls order of displaying items 
                
                type: string,           // ['text', 'list', 'password', 'email', 'url', 'select', 'multiselect', 'file', 'radio', 'checkbox', 'number', 'range', 'date', 'time', 'week', 'month'] 
                label: string,          // title of item    
                placeholder: string,    // placeholder text if value is empty 
                true: string,           // text if checkbox is checked  
                false: string,          // text if checkbox is unchecked 
                accept: string,         // only in type:'file' limit to accepted files -  audio/*, video/*, image/*, image/gif, .pdf, .doc  
                
                title: string,          // optional define your own validation message
                error: string,          // preset/set inline error msg
                
                css: string,            // inject one or more classnames at item level, 
                // Use GRID 12 column system from materializecss.com/grid.html for displaying items
                // for example a 12 column grid with responsive display would look like:
                // schema:{ item1:{ css:'col l4 m6 s12'}, item2:{ css:'col l4 m6 s12'}, item3:{ css:'next-row col l4 m6 s12'} }
    
                min: number,            // limit number or range
                max: number,            // limit number or range
                step: number,        
                maxlength: number,      // max length of type text/email 
                
                pattern: regexString,   // control allowed text input via regex

                multiple: bool,         // use with type:'file' select one or more files   
                required: bool, 
                disabled: bool, 
                readonly: bool, 
                hidden: bool,           // do not display item - could be dynamically set from another item

                options: array,         // used with type: radio, list, text, select, mselect 
                
                // this Function MUST return a value
                mapGet: function,       function( value, obj, state, schema ) { value, obj.key, obj.value, obj.schema ->  IMPORTANT! Always return incoming mapped value }
                
                // this Function MUST return a value or a promise
                mapSet: function,       function( value, obj, state, schema ) { value, obj.key, obj.value, obj.schema ->  IMPORTANT! Always return outgoing mapped value }
                
                // Validation 
                validate: undefined     // no validation
                validate: true          // use inline error message or 
                validate: function,     function( validationMessage, obj, state, schema, validity ) { use validationMessage state to log or display validation message  } 
                // No Validation               
                noValidate: function,   function( value, obj, state, schema ) { use value, obj.key, obj.value, obj.schema to handle novalidation }
              }  

          */ 
        
          // Responsive 12 Column Grid - http://materializecss.com/grid.html 
          // finish columns with class 'next-row' -{... css:'next-row col s4' ...}  
          title:{
            type:'text', label:'Title', css:'col l2 m2 s2'
          },
          prename:{
            type:'text', label:'Firstname', required:true, css:'col l4 m4 s10'
          },
          lastname:{
            type:'text', label:'Lastname', required:true, css:'next-row col l4 m6 s12'
          },
          
          user: { 
            type:'text', label:`Type 'hide', value required`, validate:true, required:true,
            // mapGet: v => v.toUpperCase(),
            mapSet: (val, obj, data, schema) => { schema.email.hidden = val.toUpperCase() === 'HIDE'; return val}, 
            css:'col l3 m6 s12',            
          },
          password:{ 
            type:'password', label:'Password [0-9], custom invalidate', required:true, pattern:'[0-9]*', css:'col l3 m6 s12',          
            validate:(msg, obj, data, schema, validity) => { console.warn(msg); obj.schema.error = `Customized Error: ${msg}`; schema.user.error ="Invalid Password for this User" }, 
            noValidate:(val, obj, data, schema) => { schema.user.error = null; obj.schema.error = null  }, 
            // validate undefined   // no validation 
            // validate:true,       // show inline error message          
            // validate:(msg) => console.warn(msg), 
          },        
          email: {
            type:'email',label:'Email, custom css', validate:true, css: 'yellow lighten-4 next-row col l6 m12 s12' 
          }, 
        
          nested:{
            
            checkbox: { type:'checkbox', true:'Yes!', false:'Oh No!', css: 'col s4' },
            radio: { type:'radio', hidden:false, options:['Resilience','Green Tea','Yoga','Curry'], css: 'col s4' }, 
            color:{ type:'color', css: 'next-row col s4' }, 
          
            selections: {
              select: { type:'select', label:'Select One', options:['Resilience','Green Tea','Yoga','Curry']},
              mselect: { type:'multiselect', label:'Select Some', required:true,  validate:true, options:['Resilience','Green Tea','Yoga','Curry']},
            }, 
          
          },

          fileselector:{ 
            type:'file', multiple:true, label:'Drag/Select Files!' 
          },
        
        },
      }
    },

    methods:{

      reset(){
        this.$store.state.data = cloneDeep(this.data); 
        this.$store.state.schema = cloneDeep(this.schema)
      }  

    },

    components: { 
      FormBase 
    },

  }
</script>

