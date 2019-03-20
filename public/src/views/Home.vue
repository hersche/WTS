<template>
  <div>
    <h1 class="text-xs-center">Home</h1>
    <p class="text-xs-center">This project is about upload and seed files.</p>
    <p class="text-xs-center">Below is a list with all uploaded files. Checkout <router-link to="/about">About</router-link> for more infos.</p>
    <v-card>
    <v-card-title>
    Seeds
    <v-spacer></v-spacer>
    <v-text-field
  v-model="search"
  append-icon="search"
  label="Search"
  single-line
  hide-details
></v-text-field>
</v-card-title>
    <v-data-table
  :headers="seedTableHeaders"
  :items="seeds"
  :search="searchInput"
>
  <template v-slot:items="props">
    <td class="text-xs-center">{{ props.item.id }}</td>
    <td class="text-xs-center">{{ props.item.title }}</td>
    <td class="text-xs-center"><a v-if="props.item.magnetURL!=''" :href="props.item.magnetURL" >{{ props.item.magnetURL }}</a> <span v-if="props.item.magnetURL==''">Never seeding yet, take a sec - try refresh</span></td>
    <td class="text-xs-center"><a target="_blank" :href="props.item.filePath" >{{ props.item.filePath }}</a></td>
    <td class="text-xs-center" v-if="user!=undefined"><v-btn v-if="((user.id==props.item.userid)||(user.admin))" @click="prepareDeleteSeed(props.item.id)" icon="true"><v-icon>delete</v-icon></v-btn></td>
  </template>
</v-data-table>
</v-card>
    <v-dialog
      v-model="deleteDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Do you really want to delete this webseed?</v-card-title>

        <v-card-text>
          Deleting the seed is irreversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="deleteSeed(deleteId)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {store} from '../store'
  const axios = require('axios');
  export default {
    props: [],
    methods: {
      prepareDeleteSeed(id){
        this.deleteDialog = true
        this.deleteId = id
      },
      deleteSeed(id){
        let that=this
        axios.get('/api/delete/'+id)
          .then(function (response) {
            // handle success
            axios.get('/api/seedList')
              .then(function (response) {
                // handle success
                store.commit("setSeeds",response.data)
                console.log(response.data);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
            that.deleteDialog = false
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
      }
    },
    computed:{
      searchInput:function(){
        if(this.search==''){
          return undefined
        }
        return this.search
      },
      user:function(){
        return store.state.user
      },
      seeds:function(){
        return store.state.seeds
      },
      seedTableHeaders:function(){
        var headers = [
          { text: 'ID', value: 'id' },
          { text: 'Title', value: 'title' },
          { text: 'Magnet URL', value: 'magnetURL' },
          { text: 'Direct URL', value: 'filePath' },
        ]
        if(this.user!=undefined){
          headers = [
            { text: 'ID', value: 'id', class:'text-xs-center' },
            { text: 'Title', value: 'title', class:'text-xs-center' },
            { text: 'Magnet URL', value: 'magnetURL', class:'text-xs-center' },
            { text: 'Direct URL', value: 'filePath' , class:'text-xs-center'},
            { text: 'Delete', value: 'delete' , class:'text-xs-center'}
          ]
        }
        return headers
      }
    },
    data () {
      return {
        deleteDialog:false,
        deleteId:0,
        search:undefined
      }
    },
  }
</script>
