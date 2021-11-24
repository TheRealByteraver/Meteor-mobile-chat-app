import { Template } from 'meteor/templating';
import { MessagesCollection } from '../api/MessagesCollection';

import './Message.html';

Template.message.events({
  'click .delete-message-button'(event) {
    // console.log('clicked on ', event.target);
    // console.log('this.id = ', this._id);
    MessagesCollection.remove({ _id: this._id });
  }
});