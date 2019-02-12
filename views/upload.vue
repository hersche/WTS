<template>
    <div>
        <h1>Upload file</h1>
        <form method="post" action="/upload" enctype="multipart/form-data">
          <input type="text" name="title" />
          <input type="file" name="theFile" id="theFile">
          <button type="submit" >Send</button>
        </form>
    </div>
</template>
<script>
</script>
<style>
</style>