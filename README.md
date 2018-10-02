## Description
The task of this assignment is to build a chat system with users,groups,channels using Angular,Node.js and Sockets.
## Instructions
To run this program:
1. ensure that mongo is downloaded and running.
2. Navigate to server directory
3. Run, node app
4. Open browser at localhost:3000

## Git Usage
Git is used in this assignment for version control and saving. Github is used to store the repository of this project.
The github repository can be found at https://github.com/TaylorRadke/2811ict_assignment.git.

## Data Storage
Data is stored by serialising JavaScript objects into JSON strings and stored in the file system.

### Users
Users are stored in the database in the users collection, with the user's username, password and avatar being stored.

#### Permissions
--- Super 
A super user also has the same abilities of a group user, it also has the ability to create a new user or currect user with group or super permissions. The super user also has the ability to delete users from the site.

--- Group
A group user has the ability to create or delete groups and a users to those groups.
 They also can create or delete channels within a group and add or remove users from those channels.

### Groups
The groups are stored in the database's groups collection. A user with group or super permissions is allowed to create a new group.
Groups are stored in the form:
```json
    [{
        "group_name":"the group's name",
        "users":["array of users"]
    }]
```

### Channels
Within a group there exist channels. Channels are stored in the database's channels collection
The channels in the group take the form:
```json
    {   
        "group_name":"the parent group of the channel",
        "channel name":"name of the channel the user entered",
        "users":["array of users"],
        "messages":[{"array of json object which store messages"}]
    }
```
## Sockets
The main feature of the site is it's chat system. The chat uses sockets to broadcast messages to users within the same room.

### Join Room
The user joins the room by emitting a "join" message with the user requesting to join as well as the channel and channel's parent gorup.
The user will be added to the room and a message will be emitted to the room that the user has joined.

### Leave Room
The user leaves the room by emitting a "leave" message and the socket will disconnect from the room after emitting a message to the room
that the user is leaving the room.

### Send Message
When the user sends a message, the socket will emit the message to the server with the message being in the form:
```json
{
    "text":"the message",
    "type":"message",
    "user":"the username of the user sending the message",
    "avatar":"the user's avatar, to display it in chat"
}
```
Once the server has recieved the message it will push it to the channels messages to store for retrieval when a user joins the channel
to display all previously sent message.

### Send Image
A user can upload an image to the chat, when they confirm that they want to upload the image, the image is stored on the server.
Once the client is notified that the image has successfuly been uploaded the user emits a message of the form:
```json
    {
        "user":"users username",
        "type":"image",
        "avatar":"user's avatar",
        "image":"the image's name"
    }
```

## API
The server provides a REST api which allows requests from the frontend to add, remove or get resources from the server. The routes
for the server are defined in ./routes from the server directory. User, group and channel routes have been split into their own
file for modularity with users.js, groups.js, channels.js.

### POST /api/users/permissions
--- Description
Creates a new user with the username provided if it is not already created. Stores the new user in the /resources/users.json file

--- Response
Responds with a JSON string depending on whether the user was already created or not

**On Fail**
```json
    {
        "username":"",
        "success":false
    }
```

**On Success**
```json
    {
        "username":"The username the user entered at login",
        "success":true
    }
```

### GET /api/users
--- Description
Returns an array of users stored in the /resources/users.json file.

--- Response
Responds with JSON string containing an array of all users

```json
    {
        "users":[]
    }
```

### GET /api/:username/permissions
--- Description
Returns the permission level of the username provided.

--- Response
Responds with a JSON string containng the username and the users permissions.
```json
    {
        "username":"username provided",
        "permissions":"permissions of the user"
    }
```
--- Example
User to get permissions from:
```json
    {
        "username":"super",
        "permissions":"super"
    }
```

**GET /api/super/permissions**

Responds with:
```json
    {
        "username":"super",
        "permissions":"super"
    }
```

### POST /api/users/permissions
--- Description 
Allows a user with appropriate permissions to escalate another users permission level

--- Data
```json
    {
        "username":"The user to change permissions for",
        "permissions":"The users new permissions"
    }
```
--- Response
**On successful change of user permission**
```json
    {
        "username":"the username of the user",
        "permissions":"the new permissions of the user",
        "changed":true
    }
```

**On Failure to change user permission**

```json
    {
        "username":"the username of the user",
        "permissions":"the permissions of the user",
        "changed":false
    }
```

### POST /api/users/login
--- Description
Used to login in a user, checks if the user exists then responds accordingly.

--- Data
The login route only requires that the username of the user wanting to login be provided.

--- Responds

**On success**
```json
    {
        "username":"username of the user",
        "authLogin":true
    }
```

**On Fail**
```json
    {
        "username":"username of the user",
        "authLogin":false
    }
```
### Post /api/user/image/upload
This route uploads an image to the server in the server's userImages dir.

### Post /api/user/image/name
This route sets the provided user's avatar to the name of the requests image.

### DELETE /api/users/:username
--- Description
Requests that a user be deleted from the site. The user will be deleted as a user from the site and all groups and all channels.

--- Response
**On Success**
```json
    {
        "user":"user to be deleted",
        "request":"logout",
        "success":true
    }
```

**On Fail**
**On Success**
```json
    {
        "user":"user to be deleted",
        "request":"logout",
        "success":false
    }
```

### POST /api/groups
--- Description
Creates a new group.

--- Data
```json
    {
        "group":"name of new group"
    }
```
--- Response
**On Success**
```json
    {
        "group":"new group name",
        "group-exists":false,
        "success":true
    }
```

**On Duplicate**
```json
    {
        "group":"new group name",
        "group-exists":true,
        "success":false
    }
```

### GET /api/groups
--- Description
Get a list of all existing groups

--- Response
```json
    {
        "groups":["an array of all the groups"]
    }
```

### GET /api/:group/users
--- Description
Get a list of all the users in the group specified in the request parameter group.

--- Response
**On success**
```json
    {
        "group":"name of the groupe",
        "success":true,
        "users":["list of all users in group"]
    }
```
**On Fail**
```json
    {
        "group":"name of the groupe",
        "success":false,
        "users":[]
    }
```

### POST /api/groups/users
--- Description
Request to add a user to a group. Checks if the groupExists and if the user is already in the group.

--- Data
```json
    {
        "username":"username of user to add to group",
        "group":"group name of group to add user to"
    }
```
--- Response
```json
    {
        "group":"group name",
        "group-exists":"if the group exists(boolean)",
        "user":"user to add to group",
        "user-already-in-group":"bool of if user is already in group",
        "success":"true if the group exists and the user wasn't in group, else false"
    }
```

### DELETE /api/groups/:group
--- Description
Delete an existing group specified by the group param.

--- Response
**On Success**
```json
    {
        "group":"name of group to delete",
        "success":true
    }
```

**On Fail**
```json
    {
        "group":"name of group to delete",
        "success":false
    }
```

### DELETE /api/groups/:group/:user
--- Description
Delete the specified user in the requested group

--- Data
group and user are in the params for the url in group and user

--- Response
**On Success**
```json
    {
        "user":"user to remove from group",
        "request":"remove",
        "success":true
    }
```

**On Fail**
```json
    {
        "user":"user to remove from group",
        "request":"remove",
        "success":false
    }
```

### GET /api/:group/channels
--- Description
Returns a list of channels in the group

--- Response
```json
    {
        "group":"name of group",
        "group-exists":"bool of if group exists",
        "channels":["list of channels"]
    }
```

### GET /api/:group/:channel/users
--- Description
Get a list of users in a channel

--- Data
The group and channel to check is specified in the group and channel params of the request url.

--- Response
```json
    {
        "group":"name of group",
        "group-exists":"bool of if group exists",
        "channel":"name of channel to get users from",
        "users":["list of users in  the channel"]
    }
```

### POST /api/groups/channels
--- Description
Creates a new channel in a group

--- Data
From the request body
```json
    {
        "group":"name of group",
        "channel":"name of channel"
    }
```
--- Response

```json
    {
        "group":"name of group",
        "group-exists":"bool of if group already exists",
        "channel":"name of channel to create",
        "channel-exists":"bool of if channel already exists",
        "channel-created":"bool of if successfuly created new channel"
    }
```

### POST /api/groups/channels/users
--- Description
Add a user to a channel

--- Data
From request body
```json
    {
        "username":"user to add",
        "group":"group to add user to",
        "channel":"channel to add user to"
    }
```
--- Response
```json
    {
        "group":"name of group",
        "channel":"name of channel",
        "user":"user to add to channel",
        "user-added-to-channel":"bool of if user added to channel"
    }
```

### DELETE /api/:group/:channel/:user
--- Description
Deletes a user from a channel

--- Data

Group, channel and user to delete are in the delete request url.

--- Response
```json
    {
        "user-deleted":"bool of if user was deleted"
    }
```

### DELETE /api/:group/:channel
--- Description
Delete a channel in a group

--- Data
Group and channel to delete are contained in request url params.

--- Response
**On Success**
```json
    {
        "channel":"name of channel"
        "channel-removed":true
    }
```
**On Fail**
**On Success**
```json
    {
        "channel":"name of channel",
        "channel-removed":false
    }
``` 
## Angular Architecture
### Components
#### Chat Dashboard
The Chat dashboard is the main component of the site which contains all the other components.
##### Group List
The dashboard shows a list of all the groups that the user is in and allows them to select a channel to join.
Clicking on the channel will tell the client to join the channel. The dashboard also contains

##### User List
When a channel is joined the list is populated with all the users in the channel with their images and usernames.

##### Text Chat
When a channel is joined the text chat is populated with all the messages sent in the channel with the user who sent it as well
as the avatar of that user.

#### User Settings
##### Modify User Permissions
This allows a user with appropriate permissions(super,group) to upgrade-only a user with same or lower permissions.

##### Create User
This allows a super/group user to create a new user by providing a username and password. This new user is then added to the database.
#### Group Settings
##### Create Group
This allows a group user to create a new group by providing the group's name
##### Delete Group
This allows a group user to delete a group by providing the group's name
##### Add user to group
This allows a group user to add a user to the group by providing the username and the group
##### Delete user from group
This allows a group user to delete a user from the group by providing the username and the group
#### Channel Settings
##### Create Channel
This allows a group user to create a new channel by providing the group and channel names.
##### Delete Channel
This allows a group user to delete a channel by providing the group and channel names.
##### Add user to Channel
This allows a group user to add a user to the channel by providing the group,channel and user names.
##### Delete user from Channel
This allows a group user to delete a user from a channel by providing the group,channel and user names.

### Services
#### User Manager
The user manager service allows the frontend to interact with users on the backend via requests. The user manager hooks into the user
routes allowing the frontend to make requests to create a user or modify a users permissions.
#### Group Manager
The group manager service allows the frontend to interact with groups on the backend via requests.
#### Channel Manager
The channel manager service allows the frontend to interact with channels on the backend via requests.