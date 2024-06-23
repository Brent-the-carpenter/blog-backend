# Blog Backend REST API

## About

This is my Odin Project submission for the blog API project. The goal of this project is to practice separating the backend from the frontend using a **RESTful API** to gather data from the database to supply the frontend. The project is composed of three parts:

1. [RESTful API back-end](https://github.com/Brent-the-carpenter/blog-backend)
2. [User front-end](https://github.com/Brent-the-carpenter/blog-frontend-user)
3. [Admin front-end](https://github.com/Brent-the-carpenter/blog-frontend-admin)

## Backend Routes

### Post Routes

- **GET /api/v1/posts**
  - Retrieves a list of all posts.
  - **Response**: `200 OK`
  - **Response Body**: List of posts in JSON format.
- **GET /api/v1/posts/:id**
  - Retrieves a single post by its ID.
  - **Response**: `200 OK`
  - **Response Body**: Post object in JSON format.
- **POST /api/v1/posts**
  - Creates a new post (authentication/admin required).
  - **Response**: `201 Created`
  - **Response Body**: Created post object in JSON format.
- **PUT /api/v1/posts/:id**
  - Updates an existing post by its ID (authentication/admin required).
  - **Response**: `200 OK`
  - **Response Body**: Updated post object in JSON format.
- **DELETE /api/v1/posts/:id**
  - Deletes a post by its ID (authentication/admin required).
  - **Response**: `204 No Content`

### Comments on Post Routes

- **GET /api/v1/posts/:id/comments**
  - Retrieves a list of comments for a specific post.
  - **Response**: `200 OK`
  - **Response Body**: List of comments in JSON format.
- **GET /api/v1/posts/:postId/comments/:commentId**
  - Retrieves a specific comment by its ID for a specific post.
  - **Response**: `200 OK`
  - **Response Body**: Comment object in JSON format.
- **POST /api/v1/posts/:id/comments**
  - Adds a new comment to a specific post (authentication required).
  - **Response**: `201 Created`
  - **Response Body**: Created comment object in JSON format.
- **PUT /api/v1/posts/:postId/comments/:commentId**
  - Updates a specific comment by its ID for a specific post (authentication required).
  - **Response**: `200 OK`
  - **Response Body**: Updated comment object in JSON format.
- **DELETE /api/v1/posts/:postId/comments/:commentId**
  - Deletes a specific comment by its ID for a specific post (authentication required).
  - **Response**: `204 No Content`

### Authentication Routes

- **POST /api/v1/auth/login**
  - Authenticates a user and returns a JWT token.
  - **Response**: `200 OK`
  - **Response Body**: JWT token and user information in JSON format.
- **POST /api/v1/auth/logout**
  - Logs out the authenticated user.
  - **Response**: `200 OK`
  - **Response Body**: Success message.
- **POST /api/v1/auth/signup**
  - Registers a new user and returns a JWT token.
  - **Response**: `201 Created`
  - **Response Body**: JWT token and user information in JSON format.

### Error Responses

The API uses standard HTTP status codes to indicate the success or failure of an API request. Errors can occur for various reasons, such as invalid input data, unauthorized access, or server issues. Here are some common error responses:

- **400 Bad Request**

  - **Description**: The server could not understand the request due to invalid syntax.
  - **Example Response**:
    ```json
    {
      "error": "Bad Request",
      "message": "Invalid input data"
    }
    ```

- **401 Unauthorized**

  - **Description**: The request requires user authentication.
  - **Example Response**:
    ```json
    {
      "error": "Unauthorized",
      "message": "Authentication required"
    }
    ```

- **403 Forbidden**

  - **Description**: The server understood the request, but it refuses to authorize it.
  - **Example Response**:
    ```json
    {
      "error": "Forbidden",
      "message": "You do not have permission to access this resource"
    }
    ```

- **404 Not Found**

  - **Description**: The server cannot find the requested resource.
  - **Example Response**:
    ```json
    {
      "error": "Not Found",
      "message": "Resource not found"
    }
    ```

- **500 Internal Server Error**
  - **Description**: The server encountered an internal error and was unable to complete the request.
  - **Example Response**:
    ```json
    {
      "error": "Internal Server Error",
      "message": "An unexpected error occurred"
    }
    ```
