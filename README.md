# TSPhaser

## Server

Rooms extend off of [Room](src/server/room/room.ts) to create a custom room.
Rooms should reassign type unique to that room and baseClient to change created client.
Clients extend off of [RoomClient](src/server/room/roomClient.ts) to save custom data.

Events listened to before the room is created, export a function that returns all events as an object. Call `client.multiOn( ***function*** );` on client connect. 
Events listened to after the room is created, override roomEvents that returns all events as an object.

## Client

Rooms extend off of [Room](src/client/connect/room.ts) to create a custom room.

Events listened to before the room is created, export a function that returns all events as an object. Call `Socket.multiOn( ***function*** );` when creating the scene, or after [Load](src/client/load.ts) is finished. 
Events listened to after the room is created, override roomEvents that returns all events as an object.
