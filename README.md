# A News API Project

## Background

This is an news app that works in a way similar to Reddit. The app allows several articles where you can leave comment. You can access the app using the link below:

https://news-app-backend-heroku.herokuapp.com/api

The link above describes the various URLs (endpoints) which will provide relative information. 

**Please remember to start any URLs with '/api'
**

## Available URLs (Endpoints)

/api/topics - serves an array of all topics

/api/articles - serves an array of all topics

/api/articles/:articleId - serves an article object when provided a valid article ID

/api/articles/:articleId/comments - serves a comments object relating to an article when provided a valid article ID

### There also POST and DELETE Endpoints

POST /api/articles/:articleId/comments - posts a comments object relating to an article when provided a valid body and article ID

DELETE /api/articles/:articleId/comments - deletes a comments object relating to an article when provided a valid comment ID

## Cloning this project


Above the list of files, click  Code.
"Code" button

To clone the repository using HTTPS, under "Clone with HTTPS", click . To clone the repository using an SSH key, including a certificate issued by your organization's SSH certificate authority, click Use SSH, then click . To clone a repository using GitHub CLI, click Use GitHub CLI, then click .
The clipboard icon for copying the URL to clone a repository

The clipboard icon for copying the URL to clone a repository with GitHub CLI

Open Terminal.

Change the current working directory to the location where you want the cloned directory.

Type git clone, and then paste the URL you copied earlier.

- ```$ git clone {paste the URL of this repository}```. This will clone it.
- Navigate (using the ```cd``` command) into the new folder and type. ```$ npm install``` This installs the required dependencies.
- Finally, to run the React project type ```$ npm start```.
