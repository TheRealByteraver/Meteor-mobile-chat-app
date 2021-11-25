/*
  Colors for CSS
  darkcyan:     #0B5269
  darkblue:     #03051E
  lightkhaki:   #978D58
  lightsalmon:  #EAE1E1
*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { MessagesCollection } from '../db/MessagesCollection';

import './App.html';
import './Message.js';
import './Login.js';

const IS_LOADING_STRING = 'isLoading';

const getUser = () => Meteor.user();

const isUserLoggedIn = () => !!getUser(); // force boolean

Template.mainContainer.onCreated(function mainContainerOnCreated(){
  this.loadingState = new ReactiveDict();

  const handler = Meteor.subscribe('messages');
  Tracker.autorun(() => {
    this.loadingState.set(IS_LOADING_STRING, !handler.ready());
  });
});

Template.mainContainer.events({
  'click .app-logout-button'(event) {
    Meteor.logout();
  },
});

Template.mainContainer.helpers({
  isLoading(){
    const instance = Template.instance();
    return instance.loadingState.get(IS_LOADING_STRING);
  },
  getTitleUsername() {
    const user = getUser();
    return user
      ? ` ${user.username}`
      : '';
  },
  messages() {
    if (!isUserLoggedIn) {
      return [];
    }

    const messages = MessagesCollection.find({}, { sort: { createdAt: 1 } });
    const user = getUser();

    return messages.map(message => {
      const isOwnMessage = (message.userId === user._id);
      const isAdministrator = (user.username === 'Administrator');                
      const messageText = isOwnMessage 
        ? `${message.messageText}`
        : `${message.username}: ${message.messageText}`;
      return {
        ...message,
        messageText,
        ownMessageClass:  isOwnMessage
                          ? 'user-message' 
                          : undefined,
        deleteMessageEnabled: (isAdministrator || isOwnMessage),
      };
    })
  },
  isUserLoggedIn() {
    return isUserLoggedIn();
  },
});

Template.form.events({
  'submit .message-form'(event) {
    event.preventDefault();

    const { target } = event;
    const messageText = target.messageText.value;
    const user = getUser();

    const messageObject = {
      messageText,
      userId: user._id,
      username: user.username,
      createdAt: new Date(),
    };
    // MessagesCollection.insert(messageObject);
    Meteor.call('messages.insert', messageObject);

    // clear form input value
    target.messageText.value = '';
  }
});

