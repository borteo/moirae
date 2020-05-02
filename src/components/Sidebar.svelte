<script>
  const fs = window.require('fs')
  const dirName = `./entries`

  // filter only Markdown files
  // todo: possibly use the date?
  const allFiles = fs.readdirSync(dirName)
  const entries = allFiles
    .map(file => {
      const [date, extension] = file.split('.')
      return {date: date, extension: extension}
    })
    .filter(file => {
      return file.extension === 'md'
    })
</script>

<div class="sidebar">
  <ul>
  {#each entries as { date, extension } }
    <li>{date}</li>
  {/each}
  </ul>
</div>

<style>
.sidebar {
  width: 250px;
  border: 1px solid #CCC;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul {
  padding: 10px 0;
}
</style>
