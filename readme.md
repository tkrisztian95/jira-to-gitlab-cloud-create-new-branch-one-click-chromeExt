# Jira & GitLab integration - Create new branch from Issue
The extension adds a new `Create branch` button to the Jira Issue overview control buttons under the issue title. If you wish to open new branches for your ticket easly without you have to navigate to you GitLab project this extension could help.

//TODO: Here comes the chromeStore link

## Description
The extension makes it easier to create new branches on GitLab directly from Jira. Adds a new button to the issue overview page. After clicking this button a modal appears. On this modal you can specifiy the desired name for the new branch and the refence where to crete it from. Perfoming the create branch action the extension uses the GitLab API endpoints.

![Screenshot1](screenshots/Capture9.PNG)

### How to configure
To reveal the extension settings simply click on the extension icon in the extensions toolbar. On the popup you have to set the access token and the project id from GitLab.

#### 1. Generate access token
In order to get access to the GitLab APIs you must create an access token first in your profile with allowing the api usage (only). Then you should copy the generated key.

![Screenshot4](screenshots/Capture11.png)

#### 2. Copy the project Id
The project id can be found on the project`s overview page on GitLab. 

![Screenshot5](screenshots/Capture10.PNG)

After you have saved the settings the extension is ready to use.

## Screenshots
### Create modal
![Screenshot7](screenshots/Capture2.PNG)

## In action

![Screenrecord9](screenshots/how-it-works.gif)
