# Wix Bookings List - Sample Application
![Bookings List GIF](readme-images/wix-bookings-list-low.gif)

### Introduction
This is a sample app that we have created for the Wix Bookings REST API. 

It enables you to:
* View all bookings in a list format (instead of calendar)
* Filter the view by date and/or status
* Update attendance and payments directly from this list.

Use this repository as a code example to further build an app of your own, or install it on your store and use it out of the box. See [here](https://dev.wix.com/api/rest/wix-bookings) for the Bookings API documentation.

### Technology Stack

We used React, mobX & Express in this sample application.

### Install
#### Prerequisites
1. MySQL / Postgres
1. Node
1. Yarn

#### Installation Steps
1. Follow the instructions of creating a Wix application [here](https://dev.wix.com/api/rest/tutorials/create-your-wix-app).   
// QUESTION - this linked to https://github.com/wix-incubator/sample-wix-rest-app  I changed it to the public docs. .

1. Clone the repository.
1. Rename the `.env.example` files inside the client & the server folders to `.env`. 

// QUESTION - when I did this, I didn't find any of these files.

1. Update the settings in the `.env` files to your configuration.

// QUESTION - does the user understand this or do we need to give more details to what "your configuration" is?

1. Run the SQL migration script to setup the DB structure - [migration.sql](migration.sql).

// QUESTION - Again, does our user understand this?

### Run the project
QUESTION - does the user understand what this is?

1. cd client && yarn start
1. cd server && yarn start 
