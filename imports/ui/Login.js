import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './Login.html';

Template.login.onCreated(function loginOnCreated() {
  this.loginModeActive = new ReactiveVar(true);
});

Template.login.helpers({
  loginModeActive(){
    return Template.instance().loginModeActive.get();
  },
});

Template.login.events({
  'submit .login-form'(event, instance) {
    event.preventDefault();
    const user = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    if (instance.loginModeActive.get()) {      
      // user wants to login
      Meteor.loginWithPassword(user.username, user.password);
    } else {
      // user wants to sign up

      // check if both passwords are equal
      if (user.password !== event.target['repeat-password'].value) {
        // error: both passwords are not the same
      } else {
        // create user
        Accounts.createUser(user);
        // and now log in:
        Meteor.loginWithPassword(user.username, user.password);
      }

      // check if username is free
      // https://stackoverflow.com/questions/37214761/meteor-how-do-you-use-accounts-finduserbyusername
      //const existingUser = Accounts.findUserByUsername(user.username);
      // if (!existingUser) {
      //   // create user
      //   Accounts.createUser(user);
      //   // and now log in:
      //   Meteor.loginWithPassword(user.username, user.password);
      // } else {
      //   // error: username is taken
      // }
    }
  },
  'click .mode-select-button'(event, instance) {
    const currentMode = instance.loginModeActive.get(); 
    instance.loginModeActive.set(!currentMode);    
  },
});
