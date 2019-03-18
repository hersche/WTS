<template>
  <div>
    <h1>Home</h1>
    <p>This project is about upload and seed files.</p>
    <p>Below is a list with all uploaded files. Checkout <router-link to="/about">About</router-link> for more infos.</p>
    
    <v-data-table
  :headers="seedTableHeaders"
  :items="seeds"
  class="elevation-1"
>
  <template v-slot:items="props">
    <td class="text-xs-center">{{ props.item.id }}</td>
    <td class="text-xs-center">{{ props.item.title }}</td>
    <td class="text-xs-center"><a :href="props.item.magnetURL" >{{ props.item.magnetURL }}</a></td>
    <td class="text-xs-center"><a target="_blank" :href="props.item.filePath" >{{ props.item.filePath }}</a></td>
    <td class="text-xs-center" v-if="user!=undefined"><v-btn @click="prepareDeleteSeed(props.item.id)" icon="true"><v-icon>delete</v-icon></v-btn></td>
  </template>
</v-data-table>

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
            { text: 'ID', value: 'id' },
            { text: 'Title', value: 'title' },
            { text: 'Magnet URL', value: 'magnetURL' },
            { text: 'Direct URL', value: 'filePath' },
            { text: 'Delete', value: 'delete' }
          ]
        }
        return headers
      }
    },
    data () {
      return {
        deleteDialog:false,
        deleteId:0
      }
    },
  }
</script>
