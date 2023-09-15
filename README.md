# Documentation
# Introduction

The CommunityAPI is built with node.js/express and TypeScript. This API is simple yet useful and a very much easy to use. With different route end points this API can handle all the CRUD operation related to a community mangement. 
This API returns a JSON object with all the details of courses like 'Course name','Price' and 'Url' as well.
## 😴 AS IT IS HOSTED IN A [FREE CLOUD PLATFORM](https://render.com/) , THE FIRST REQUEST CAN TAKE TIME UPTO 20s TO RESPONSE AS THE SERVER WENT TO SLEEP AFTER 5 MIN OF INACTIVITY 
## 📎 This is just an overview. Detailed Documentation can be found [Here](https://tuhins-organization.gitbook.io/api-docs/) 

## Use Cases

There are many use cases are possible, such as
- Community Creation.
- Member Management.
- Role based access.

## Endpoints

  - Main URL ---> https://community-api-p49y.onrender.com/
 - There are 4 main endpoints and various paths for each endpoints.

   ### User
     - There are 3 endpoints for user
     - Details about responses and parameters can be found 👉 [Here](https://tuhins-organization.gitbook.io/api-docs/reference/api-reference/users) 
   ```http
   POST https://community-api-p49y.onrender.com/v1/auth/sigunup
   ```
      ```http
      POST https://community-api-p49y.onrender.com/v1/auth/signin
     ```
      ```http
      GET https://community-api-p49y.onrender.com/v1/auth/me
     ```

   ### Role
   - There are 2 endpoints for role
   - Details about responses and parameters can be found 👉 [Here](https://tuhins-organization.gitbook.io/api-docs/reference/api-reference/role)
    
   ```http
   POST https://community-api-p49y.onrender.com/v1/role
   ```
   ```http
   GET https://community-api-p49y.onrender.com/v1/role?page=1&limit=10
   ```

   ### Member
      - There are 2 endpoints for role
      - Details about responses and parameters can be found 👉 [Here](https://tuhins-organization.gitbook.io/api-docs/reference/api-reference/member)
   
    
    ```http
    POST https://community-api-p49y.onrender.com/v1/member
    ```
   ```http
   DELETE https://community-api-p49y.onrender.com/v1/member/:id
   ```

     ### Community
      - There are 5 endpoints for role
      - Details about responses and parameters can be found 👉 [Here](https://tuhins-organization.gitbook.io/api-docs/reference/api-reference/community)
    
    ```http
    POST https://community-api-p49y.onrender.com/v1/community
    ```
   ```http
   GET https://community-api-p49y.onrender.com/v1/community?page=1&limit=10
   ```
   ```http
   GET https://community-api-p49y.onrender.com/v1/community/7108143066959123096/members?page=1&limit=10
   ```
   ```http
   POST https://community-api-p49y.onrender.com/v1/community/me/owner?page=1&limit=10
   ```
   ```http
   POST https://community-api-p49y.onrender.com/v1/community/me/member?page=1&limit=10
   ```
     
     
      

## Status Codes

FreecoursesAPI returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 401 | `UNAUTHORIZED` |



