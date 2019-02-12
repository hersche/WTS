<template>
    <div>
        <h2>Start</h2>
        <p><a href="/upload" >Go to upload</a></p>
        <p>All the seeds</p>
        <table>
        <tr v-for="item in seeds">
          <td>{{ item.title }}</td>
          <td>{{ item.filePath }}</td>
          <td><a :href="item.magnetURL">{{ item.magnetURL }}</a></td>
          <td><a :href="'/delete/'+item.id">Delete</a></td>
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