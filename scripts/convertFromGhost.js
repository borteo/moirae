const fs = require('fs');
const console = require('console');
const moment = require('moment');

const formatContent = (data, entryTags) =>
  `---
created: ${data.published_at}
modified: ${data.updated_at}
tags: ${entryTags.join(', ')}
---
# ${data.title}

${data.plaintext}

${data.feature_image ? '![](' + data.feature_image + ')' : ''}
  `;

const getTags = (id, tags, postsTags) => {
  const tagID = postsTags
    .filter((postTags) => postTags.post_id === id)
    .map((postTags) => {
      return postTags.tag_id;
      // {
      //  id: '5e3f63d39c3de40f8d19cee8',
      //  post_id: '5e3f63d39c3de40f8d19cee4',
      //  tag_id: '5e3f63d39c3de40f8d19cee2',
      //  sort_order: 0
      // }
    });

  const tagName = tags
    .filter((tag) => tag.id === tagID[0])
    .map((tag) => {
      return tag.name;
    });

  return tagName;
};

const generateFilesFromPosts = ({ posts, tags, postsTags }) => {
  posts
    .filter((entry) => entry.type === 'post') // and 'page'
    .map((entry) => {
      const { published_at } = entry;

      // format 2020-03-07 10:54:59
      const dirName = published_at.split('-')[0];
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
      }

      const entryTags = getTags(entry.id, tags, postsTags);
      const content = formatContent(entry, entryTags);

      const fileName = moment(published_at)
        .utc()
        .format('YYYY-MM-DD[T]HH:mm:ss[Z]');

      fs.writeFile(`${__dirname}/${dirName}/${fileName}.md`, content, (err) => {
        if (err) {
          throw err;
        }
        console.log(`${fileName}.md created ✅`);
      });

      return entry;
    });
};

const generateFilesFromPages = ({ posts, tags, postsTags }) => {
  posts
    .filter((entry) => entry.type === 'page') // and 'page'
    .map((entry) => {
      const { slug } = entry;

      const dirName = 'pages';
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
      }

      const entryTags = getTags(entry.id, tags, postsTags);
      const content = formatContent(entry, entryTags);

      const fileName = slug;

      fs.writeFile(`${__dirname}/${dirName}/${fileName}.md`, content, (err) => {
        if (err) {
          throw err;
        }
        console.log(`${fileName}.md created ✅`);
      });

      return entry;
    });
};

const parseFile = (err, data) => {
  if (err) {
    throw err;
  }
  const array = JSON.parse(data);

  if (!array || !array.db) {
    throw new Error('db prop not available');
  }

  generateFilesFromPosts({
    posts: array.db[0].data.posts,
    tags: array.db[0].data.tags,
    postsTags: array.db[0].data.posts_tags,
  });

  generateFilesFromPages({
    posts: array.db[0].data.posts,
    tags: array.db[0].data.tags,
    postsTags: array.db[0].data.posts_tags,
  });
};

fs.readFile(`${__dirname}/ghost.json`, 'utf8', parseFile);

// json Structure
// ---------------------
// level 0: { db: [ { meta: [Object], data: [Object] } ] }
// ---------------------
// level 1:
// { meta: { exported_on: 1589898543725, version: '3.5.0' },
// data: {
//   migrations_lock: [Array],
//   migrations: [Array],
//   posts: [Array],
//   posts_meta: [],
//   users: [Array],
//   posts_authors: [Array],
//   roles: [Array],
//   roles_users: [Array],
//   permissions: [Array],
//   permissions_users: [],
//   permissions_roles: [Array],
//   permissions_apps: [],
//   settings: [Array],
//   tags: [Array],
//   posts_tags: [Array],
//   apps: [],
//   app_settings: [],
//   app_fields: [],
//   invites: [],
//   brute: [Array],
//   webhooks: [],
//   integrations: [Array],
//   api_keys: [Array],
//   members: [],
//   members_stripe_customers: [],
//   members_stripe_customers_subscriptions: [],
//   actions: [Array],
//   emails: []
// }
//------------
// level 2:
// posts: [{
//   id: '5e3f63ed9c3de40f8d19cf5a',
//   uuid: 'daa97992-048f-469e-8274-1be8e508b314',
//   title: 'String',
//   slug: 'String',
//   mobiledoc: '',
//   html: '',
//   comment_id: '1270',
//   plaintext: ''
//   feature_image: null,
//   featured: 0,
//   type: 'post',
//   status: 'published',
//   locale: null,
//   visibility: 'public',
//   send_email_when_published: 0,
//   author_id: '1',
//   created_at: '2010-08-16 19:00:27',
//   updated_at: '2010-08-17 17:18:56',
//   published_at: '2010-08-16 19:00:27',
//   custom_excerpt: null,
//   codeinjection_head: null,
//   codeinjection_foot: null,
//   custom_template: null,
//   canonical_url: null
// }]
