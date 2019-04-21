<template>
  <div class="about">
    <h1>Upload file</h1>
    <form method="post" action="/api/upload" enctype="multipart/form-data">
      <v-text-field name="title" id="title" :label="$t('Title')"></v-text-field>
      <input type="file" name="theFile" id="theFile">
    </form>
    <v-btn @click="uploadSeed()">{{ $t('Upload') }}</v-btn>
    <v-snackbar
     v-model="showMsg"
     timeout="6000"
   >
     {{ msg }}
     <v-btn
       dark
       flat
       @click="showMsg = false"
     >
       Close
     </v-btn>
   </v-snackbar>
  </div>
</template>
<script>
  import {store} from '../store'
  const axios = require('axios');
  export default {
    props: [],
    methods: {
      uploadSeed(){
        let that = this
        var data = new FormData();
        console.log(document.getElementById('title').value)
        data.append('title', document.getElementById('title').value);
        data.append('theFile', document.getElementById('theFile').files[0]);
        var config = {
          onUploadProgress: function(progressEvent) {
            var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            console.log(percentCompleted)
          }
        };
        axios.post('/api/upload',data,config)
          .then(function (response) {
            // handle success
            //this.msg = response.msg
            console.log("upload-answer",response)
            that.showMsg=true
            axios.get('/api/seedList')
              .then(function (response) {
                // handle success
                
                store.commit("setSeeds",response.data)
                console.log(response.data);
                that.$router.push('/')
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
            
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
          { text: 'magnetURI', value: 'magnetURL' },
          { text: 'FilePath', value: 'filePath' }
        ]
        if(this.user!=undefined){
          headers = [
            { text: 'ID', value: 'id' },
            { text: 'Title', value: 'title' },
            { text: 'magnetURI', value: 'magnetURL' },
            { text: 'FilePath', value: 'filePath' },
            { text: 'Delete', value: 'delete' }
          ]
        }
        return headers
      }
    },
    data () {
  return {
    showMsg:false
  }
},
    components: {
    }
  }
</script>