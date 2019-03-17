
<template lang="html">
<div>
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css" rel="stylesheet">
  <v-toolbar fixed dark color="primary" style="z-index:99999">
    <v-toolbar-side-icon @click="active=true"></v-toolbar-side-icon>
    <router-link class="" to="/"><v-toolbar-title class="white--text" to="/">LaraTube</v-toolbar-title></router-link>

    <v-spacer></v-spacer>
    <v-flex xs5 sm4 md3 lg3 align-right>
      <v-text-field
      hide-details
      append-icon="search"
      single-line
      id="theLiveSearch"
      placeholder="Search..."
      @keyup="searching()" @focus="searching()"
      ></v-text-field>
    </v-flex>
  </v-toolbar>
    
    
    <v-navigation-drawer
  v-model="active"
  fixed
  style="z-index:99999; height: 100%;overflow-x:auto; max-width:90%;"
  dark
  temporary
>
  <v-list-tile>
    <v-list-tile-action>
      <v-btn @click="active=false" small fab color="orange" style="cursor:pointer;"><v-icon>close</v-icon></v-btn>
    </v-list-tile-action>  
  </v-list-tile>
  <v-list-tile>
    <v-list-tile-action>
      <v-icon>call_merge</v-icon>
    </v-list-tile-action>
    <v-select
  v-model="dataTypes"
  :items="[{value:'audio',text:'Audio'},{value:'video',text:'Video'}]"
  deletable-chips
  attach
  label="Mediatypes"
  multiple
></v-select>
  <!--  <treeselect class="" instanceId="dataTypeTree" v-if="treeTypes!=undefined" :multiple="true" :append-to-body="false" :always-open="false" v-model="dataTypes"  :options="treeTypes" /> -->
  </v-list-tile>

  <v-list class="pa-1">

    <v-list-tile  avatar tag="div" v-if="currentuser!=undefined" :style="'background-image:url('+currentuser.background+');'">
      <v-badge left color="orange" overlap>
        <router-link class="small" slot="badge" to="/notifications">{{ n }}</router-link>

        <v-list-tile-avatar >
          <img :src="currentuser.avatar">
        </v-list-tile-avatar>
      </v-badge>

      <v-list-tile-content>
        <v-list-tile-title>{{ currentuser.name }}</v-list-tile-title>
      </v-list-tile-content>

    </v-list-tile>
  </v-list>

  <v-list class="pt-0" dense>

    <v-list-tile to="/">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Home</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  
  </v-list>
</v-navigation-drawer>

<v-speed-dial
  v-model="speedDeal"
  bottom
  v-if="currentuser!=undefined"
  right
  fixed
>
  <v-btn
    slot="activator"
    v-model="speedDeal"
    color="blue darken-2"
    dark
    fab
  >
    <v-icon>account_circle</v-icon>
    <v-icon>close</v-icon>
  </v-btn>
  <v-btn
    fab
    dark
    small
    color="green"
  >
    <v-icon>edit</v-icon>
  </v-btn>
  <v-btn
    fab
    dark
    small
    color="indigo"
    to="/upload"
  >
    <v-icon>add</v-icon>
  </v-btn>
  <v-btn
    fab
    dark
    small
    color="red"
  >
    <v-icon>delete</v-icon>
  </v-btn>
</v-speed-dial>


</v-toolbar>

<v-snackbar
v-model="alarmEnabledInternal"
:bottom="true"
:color="alertcolor"
:multi-line="true"
:timeout="9000"
>
{{ alerttext }}
<v-btn

flat
@click="closeAlarm()"
>
Close
</v-btn>
</v-snackbar>
    </div>

</template>

<script>
export default {
  mounted(){
    console.log("mounted")
    let that = this;
    if(localStorage.getItem("mediaTypes")!=''&&localStorage.getItem("mediaTypes")!=null){
      this.dataTypes = localStorage.getItem("mediaTypes").split(",")
    } else {
      this.dataTypes = ["audio","video"]
    }

    if(localStorage.getItem("language")!=''&&localStorage.getItem("language")!=undefined){
      this.lang = localStorage.getItem("language");
    }

},
  methods:{
    closeAlarm(){
    },
    searching(){
    },
    emitGetNewMedias() {
    },
    emitRefreshMedias: function() {
    },
    emitLogout: function() {
      $.ajax({
          url: '/logout',
          type: 'POST',
          data: new FormData($("#logoutForm")[0]),
          cache: false,
          contentType: false,
          processData: false,
          complete : function(res) {
            if(res.status==200){
              //eventBus.$emit('login',res.responseJSON.data);
            }
          }

      });

    },
    emitLoadAllMedias: function() {
    },
  },
  props:['alertshown','alerttext','alertcolor'],
  computed:{
    currentuser(){
      return this.user
    },
  },
  watch:{
    alarmEnabledInternal: function(val){
      if(val==false){
      }
    },
    alertshown: function(val){
      console.log("react to alertshown",val)
      this.alarmEnabledInternal = val
    },  
    lang:function(val){
      localStorage.setItem("language",val);
    },
    dataTypes:function(val){
      localStorage.setItem("mediaTypes",val.join())
    },
    notifications:function(val){

    }
  },
  data: function () {
    return {
      active:false,
      activeItem:0,
      lang:'en',
      dataTypes: ["audio","video"],
      n:0,
      mini:false,
      alarmEnabledInternal:false,
      speedDeal:false,
      treeTypes: [{id:'audio',label:'Audio'},{id:'video',label:'Video'}]
    }
},
}
</script>
