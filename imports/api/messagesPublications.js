import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../db/MessagesCollection';

// don't user arrow function here, we need access to 'this.userId' here
Meteor.publish('messages', function publishMessages() {
  // we only have one chatroom right now so we need to publish
  // ALL the messages to EVERY user:
  return MessagesCollection.find({});
});