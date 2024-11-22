export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender._id !== m.sender._id && // Check if the next message has a different sender
    m.sender._id !== userId // Check if the current message is not from the logged-in user
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 && // Ensure it's the last message
    messages[messages.length - 1].sender._id !== userId // Ensure the last message was not sent by the user
  );
};
