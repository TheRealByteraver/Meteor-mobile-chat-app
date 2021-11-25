import { Template } from 'meteor/templating';
// import { MessagesCollection } from '../db/MessagesCollection';

import './Message.html';

Template.message.events({
  'click .delete-message-button'() {
    Meteor.call('messages.remove', this._id);
  }
});