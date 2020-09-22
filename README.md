# Wix Bookings List - Sample Application
![Bookings List GIF](readme-images/wix-bookings-list-low.gif)

### Introduction
We developed this sample application to give an example of Wix Bookings REST API usages and how you can use it to extend
the functionality of our platform. You can use this repository as a code example or you can install it on your store and use it out of the box.

### Technology Stack

We used React, mobX & Express in this sample application.

### Bookings API Endpoints List
This is a list of all the API endpoint we've used during the development of the app:

1. [List Services](https://dev.wix.com/api/rest/wix-bookings/services/service/list-services)
1. [List Resources](https://dev.wix.com/api/rest/wix-bookings/resources/list-resources)
1. [Bookings Reader List](https://dev.wix.com/api/rest/wix-bookings/bookings/bookings-reader/list)
1. [Calendar List Slots](https://dev.wix.com/api/rest/wix-bookings/calendar/list-slots)
1. Mark as Paid
1. [Reschedule Booking](https://dev.wix.com/api/rest/wix-bookings/bookings/bookings/reschedule-booking)
1. [Confirm Booking](https://dev.wix.com/api/rest/wix-bookings/bookings/bookings/confirm-booking)
1. [Decline Booking](https://dev.wix.com/api/rest/wix-bookings/bookings/bookings/decline-booking)
1. [Set Attendance](https://dev.wix.com/api/rest/wix-bookings/bookings/bookings/set-attendance)
1. [Update Session](https://dev.wix.com/api/rest/wix-bookings/schedules-and-sessions/session/update-session)

### Install
#### Prerequisites
1. MySQL / Postgres
1. Node
1. Yarn

#### Installation Steps
1. Follow the instructions of creating an Wix application [here](https://github.com/wix-incubator/sample-wix-rest-app)
1. Clone the repository
1. Rename the `.env.example` files inside the client & the server folders to `.env`
1. Update the settings in the `.env` files to your configuration
1. Run the SQL migration script to setup the DB structure - [migration.sql](migration.sql)

### Running the project
1. cd client && yarn start
1. cd server && yarn start 
