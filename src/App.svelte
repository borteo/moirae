<script>
  import { format } from 'date-fns'
  import Sidebar from './components/Sidebar.svelte'
  
  const fs = window.require('fs');
  const dirName = `entries`

  let content = ''

  const formatContent = ({
    date, doesExist
  }) => {

    // if (doesExist) {
    //   const pattern = /(?<=^---)[\s\S]+?(?=---)/i

    //   fs.readFile(`${dirName}/${date}.md`, 'utf8', parseFile);

    //   str.match(patpatternt)
    // }
    return (`---
created: ${date}
modified: ${date}
---

${content}
  `)
}


  const handleSubmit = () => {
    const creationDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    const filePath = `${dirName}/${creationDate}.md`

    const doesExist = fs.existsSync(filePath) === true

    const formattedContent = formatContent({ date: creationDate, doesExist})

    fs.writeFile(filePath, formattedContent, (err) => {
      if (err) {
        throw err
      }
      console.log(`${creationDate}.md created ✅`)
    })
	}
  

</script>

<h1>Wilson</h1>
<div id="main">
  <form on:submit|preventDefault={handleSubmit}>
    <textarea id="content" rows="25" cols="50" bind:value={content} />

    <button disabled={!content} type=submit>
      Submit
    </button>
  </form>

  <Sidebar id="sidebar"/>
</div>

<style>
h1 {
  color: purple;
  font-size: 2em;
}

#main {
  display: flex;
}
</style>