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

### Bookings API Endpoints List
This is a list of all the API endpoint we've used during the development of the app:

<!-- Mark as Paid  is not in public docs - will it work? -->

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

<!--  QUESTION - this linked to https://github.com/wix-incubator/sample-wix-rest-app  -->
<!-- I changed it to link to the documentation tutorials which are more updated and relevant to TPA.  -->

1. Follow the instructions of creating a Wix application [here](https://devforum.wix.com/kb/en/article/about-the-app-launch-process).   
1. Clone this repository.
1. Rename the `.env.example` files inside the client & the server folders to `.env`. 
1. Update the settings in the `.env` files to your configuration.
1. Run the migration SQL query in order to set up your DB structure - [migration.sql](migration.sql).
### Run the project
1. Run the app:
  * **cd client && yarn start**
  * **cd server && yarn start** 
