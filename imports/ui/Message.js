import { Template } from 'meteor/templating';
// import { MessagesCollection } from '../db/MessagesCollection';

import './Message.html';

Template.message.events({
  'click .delete-message-button'() {
    Meteor.call('messages.remove', this._id);
  }
});

// Scroll to bottom after rendering of a new chat message
Template.message.onRendered(function messageOnRendered() {
  const messageList = document.querySelector('.chat-message-list');
  if (messageList) {
    messageList.scrollTo(0, messageList.scrollHeight);
  }
});