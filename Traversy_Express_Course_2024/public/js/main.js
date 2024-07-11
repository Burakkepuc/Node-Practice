const output = document.getElementById('output');
const button = document.getElementById('get-posts-btn');
const form = document.getElementById('add-post-form');

// Get and Show Posts
async function showPosts() {

  try {
    const res = await fetch('http://localhost:8000/api/posts');
    if (!res.ok) {
      throw new Error(`Failed to fetch posts`);
    }


    const posts = await res.json();
    output.innerHTML = '';

    posts.forEach(post => {
      const div = document.createElement('div');
      div.textContent = post.title;
      output.appendChild(div);
    });
  } catch (error) {
    console.log('Error fetching posts', error);
  }

}

// Submit post
async function addPost(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const title = formData.get('title');

  try {
    const res = await fetch('http://localhost:8000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    if (!res.ok) {
      throw new Error('Failed to create post');
    }
    const post = await res.json();
    const div = document.createElement('div');
    div.textContent = post.title;
    output.appendChild(div);
    showPosts();

  } catch (error) {
    console.log('Error creating posts', error);

  }

}

// Event listeners 
button.addEventListener('click', showPosts);
form.addEventListener('submit', addPost);
