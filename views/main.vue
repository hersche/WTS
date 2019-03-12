<template>
    <div>
        <h2>Start</h2>
        <p v-if="user!=undefined">
          Logged in as {{ user.name }}
          <a href="/logout">Logout</a>
        </p>
        <p v-if="user==undefined">
          <a href="/login">Login</a>
        </p>
        <p><a v-if="user!=undefined" href="/upload" >Go to upload</a></p>
        <p>All the seeds - if you don't see your entry, try reload the page</p>
        <table>
        <tr v-for="item in seeds">
          <td>{{ item.title }}</td>
          <td>{{ item.filePath }}</td>
          <td><a :href="item.magnetURL">{{ item.magnetURL }}</a></td>
          <td><a v-if="user!=undefined" :href="'/delete/'+item.id">Delete</a></td>
        </tr>
      </table>
    </div>
</template>
<script>

module.exports = {
    data() {
        return {
          seeds:[]
        };
    },
}
</script>
<style>
</style>