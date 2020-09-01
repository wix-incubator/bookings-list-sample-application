# Wix Bookings List - Sample Application
![Bookings List GIF](readme-images/wix-bookings-list-low.gif

### Introduction
We developed this sample application to give an example of Wix Bookings REST API usages and how you can use it to extend
the functionality of our platform. You can use this repository as an example for learning or you can clone and install the app on your store.

### Prerequisites
1. MySQL / Postgres
1. Node
1. Yarn

### Install
1. Follow the instructions of creating an Wix application [here](https://github.com/wix-incubator/sample-wix-rest-app)
1. Clone the repository
1. Rename the .env.example files inside the client & the server folders to .env
1. Update the settings in the .env files to your configuration
1. Run the SQL migration script to setup the DB structure - [migration.sql](migration.sql)

### Running the project
1. cd client && yarn start
1. cd server && yarn start 