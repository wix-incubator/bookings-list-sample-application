# Wix Bookings List - Sample Application
![Bookings List GIF](readme-images/wix-bookings-list-low.gif)

### Introduction
This is a sample app that we have created for the Wix Bookings REST API. 
It enables you to view your all of your bookings, filter the view by date and/or status, and attendance and payments directly from this list.
Use this repository as a code example to further build an app of your own, or install it on your store and use it out of the box.

### Technology Stack

We used React, mobX & Express in this sample application.

### Install
#### Prerequisites
1. MySQL / Postgres
1. Node
1. Yarn

#### Installation Steps
1. Follow the instructions for creating an Wix application [here](https://github.com/wix-incubator/sample-wix-rest-app)
1. Clone the repository
1. Rename the `.env.example` files inside the client & the server folders to `.env`
1. Update the settings in the `.env` files to your configuration
1. Run the SQL migration script to setup the DB structure - [migration.sql](migration.sql)

### Running the project
1. cd client && yarn start
1. cd server && yarn start 
