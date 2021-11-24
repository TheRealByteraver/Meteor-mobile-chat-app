import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../imports/api/MessagesCollection';
import '../imports/api/MessagesMethods';

const insertMessage = (messageText, user) => 
  MessagesCollection.insert( 
    { 
      messageText: messageText,
      userId: user._id,
      createdAt: new Date(),
    }
  );

// Small userlist to get started
// const userList = [
//   {
//     username: 'Glenn',
//     password: 'glenn123',
//   },
//   {
//     username: 'Yuri',
//     password: 'yuri123',
//   },
//   {
//     username: 'Maryna',
//     password: 'maryna123',
//   },
//   {
//     username: 'Erland',
//     password: 'erland123',
//   },
//   {
//     username: 'Elias',
//     password: 'elias123',
//   },
//   {
//     username: 'Liesbeth',
//     password: 'liesbeth123',
//   },
//   {
//     username: 'Gustavo',
//     password: 'gustavo123',
//   },
//   {
//     username: 'Fabrice',
//     password: 'fabrice123',
//   },
//   {
//     username: 'Dietbrand',
//     password: 'dietbrand123',
//   },
// ];

Meteor.startup(() => {
  if (!Accounts.findUserByUsername('Administrator')) {
    // userList.forEach(user => Accounts.createUser(user));
    Accounts.createUser({
      username: 'Administrator',
      password: 'Administrator',
    });
  }

  // const user = Accounts.findUserByUsername(SEED_USERNAME);
  // // console.log('found # messages: ', MessagesCollection.find().count());
  // if (MessagesCollection.find().count() === 0) {
  //   [
  //     'This is the first message',
  //     'This is the second message in the chat',
  //     'And this is the third message in this conversation',
  //   ].forEach(messageText => insertMessage(messageText, user));
  // }
});
