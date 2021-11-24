import { Template } from 'meteor/templating';
import { MessagesCollection } from '../api/MessagesCollection';

import './Message.html';

Template.message.events({
  'click .delete-message-button'() {
    Meteor.call('messages.remove', this._id);
  }
});