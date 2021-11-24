import { check } from 'meteor/check';
import { MessagesCollection } from './MessagesCollection';

Meteor.methods({
  'messages.insert'(message) {
    check(message.messageText, String);

    // check if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    // find username of the current user
    const user = Meteor.users.findOne(this.userId);

    // insert message
    MessagesCollection.insert({
      messageText: message.messageText,
      userId: this.userId,
      username: user.username,
      createdAt: new Date(),
    });
  },
  'messages.remove'(messageId) {
    // check if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    // Check if this user is allowed to delete this message
    // (i.e. if he is the author of the message)
    const message = MessagesCollection.findOne({ _id: messageId });
    if (!message) {
      throw new Meteor.Error('Message not found.');
    }
    // find username of the current user
    const user = Meteor.users.findOne(this.userId);
    if ((message.userId !== this.userId) && (user.username !== 'Administrator')) {
      throw new Meteor.Error('Not authorized.');
    }
    // delete message
    MessagesCollection.remove({ _id: messageId });
  }
});