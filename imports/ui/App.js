/*
  Colors for CSS
  darkcyan:     #0B5269
  darkblue:     #03051E
  lightkhaki:   #978D58
  lightsalmon:  #EAE1E1

Your new mongo URL is
mongodb://erlando:XuoZP9uTvrth4vtca@SG-galaxycluster-38726.servers.mongodirector.com:27017,SG-galaxycluster-38727.servers.mongodirector.com:27017/ca2-meteorapp-com?replicaSet=RS-galaxycluster-0&ssl=true.
It is a good idea to add this new URL to your app settings: 
({ "galaxy.meteor.com": { env: { MONGO_URL: "YOUR MONGO URL" } } }).
******************************************************************************
For details, visit https://galaxy.meteor.com/app/erland-ca2.meteorapp.com

Deployment: meteor deploy ca2.meteorapp.com --free --mongo

*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { MessagesCollection } from '../db/MessagesCollection';

import './App.html';
import './Message.js';
import './Login.js';

// small utility function
// function scrollToBottom() {
//   const messageList = document.querySelector('.chat-message-list');
//   if (messageList) {
//     messageList.scrollTo(0, messageList.scrollHeight);
//   }
// }

const IS_LOADING_STRING = 'isLoading';

const getUser = () => Meteor.user();

const isUserLoggedIn = () => !!getUser(); // force boolean

Template.mainContainer.onCreated(function mainContainerOnCreated() {
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
  isUserLoggedIn() {
    return isUserLoggedIn();
  },
});

// Template.messageList.onRendered(function messageListOnRendered() {
//   scrollToBottom();
// });

Template.messageList.events({
  // should use observer here instead:
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  // Oh well.
  'DOMSubtreeModified .chat-message-list'(event) {
    //scrollToBottom();
  }
});

Template.messageList.helpers({
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
});

Template.form.events({
  'submit .message-form'(event) {
    event.preventDefault();

    const { target } = event;
    const messageText = target.messageText.value;

    // no empty messages
    if (messageText.trim().length === 0) return;

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

    const audio = new Audio('./sounds/intuition-561.ogg');
    // const audio = new Audio('./sounds/Message.wav');

    audio.play();
  }
});

