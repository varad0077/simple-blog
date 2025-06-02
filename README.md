<<<<<<< HEAD
# simple-blog
=======
# Blog Space

This is a simple blog website built with Node.js, Express, and vanilla JavaScript for the frontend. It allows users to register, login, view blog posts, create new posts, and add comments.

## Features

- User authentication (Register and Login)
- Create new blog posts
- View all blog posts
- View individual blog post details
- Add comments to blog posts
- Responsive design
- Data stored in JSON files (`users.json`, `posts.json`)

## Setup

To set up and run this project locally, follow these steps:

1.  **Clone the repository (if applicable):**
    ```bash
    # If your project is in a git repository
    # git clone <repository_url>
    # cd <repository_folder>
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm installed. Then, run the following command in the project root directory:
    ```bash
    npm install
    ```

## Running the Application

After installing dependencies, you can start the server by running:

```bash
node server.js
```

The server will start on `http://localhost:3000`. Open your web browser and navigate to this address to access the blog website.

## Project Structure

-   `server.js`: The main server file handling routes and data operations.
-   `public/`: Contains static files (HTML, CSS, client-side JavaScript).
    -   `index.html`: The main blog page.
    -   `style.css`: Stylesheet for the website.
    -   Other static assets (like images if added).
-   `auth/`: Contains authentication-related HTML files.
    -   `login.html`: Login page.
    -   `register.html`: Registration page.
-   `users.json`: Stores user data.
-   `posts.json`: Stores blog post data.
-   `package.json`: Project dependencies and scripts.
-   `Dockerfile`: For building a Docker image of the application.
-   `Jenkinsfile`: (If used for CI/CD)
-   `.gitignore`: Specifies intentionally untracked files that Git should ignore.

## Technologies Used

-   Node.js
-   Express.js
-   Vanilla JavaScript
-   HTML5
-   CSS3

## Possible Future Enhancements

- Implement image uploads for blog posts.
- Add user profiles.
- Implement post editing and deletion.
- Add pagination or infinite scrolling for posts.
- Improve security (e.g., password hashing).
- Migrate to a database instead of JSON files.
- Add search functionality. 
>>>>>>> 3de4c0b (added the readme.md fille)
