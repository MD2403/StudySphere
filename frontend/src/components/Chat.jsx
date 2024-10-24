// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(''); // Track search input
//   const [searchResults, setSearchResults] = useState([]); // Store search results

//   // Fetch all chats for the logged-in user
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };

//     fetchChats();
//   }, []);

//   // Handle chat selection
  // const handleChatSelect = async (chat) => {
  //   setSelectedChat(chat);

  //   try {
  //     const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //     });
  //     setMessages(response.data);
  //     socket.emit('joinChat', chat._id); // Join the selected chat room
  //   } catch (error) {
  //     console.error('Failed to load messages', error);
  //   }
  // };

//   // Send a message
//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = {
//         content: message,
//         chatId: selectedChat._id,
//       };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]);
//           setMessage('');
//           socket.emit('newMessage', response.data); // Emit new message event
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   // Listen for new messages in real-time
//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });

//     return () => {
//       socket.off('messageReceived');
//     };
//   }, [selectedChat]);

  // // Handle search input and call search API
  // const handleSearch = async (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);

  //   if (term.trim() === '') {
  //     setSearchResults([]); // Clear results if the search term is empty
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/api/users/search?q=${term}`,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, // Use correct token name
  //       }
  //     );
  //     setSearchResults(response.data); // Store search results
  //   } catch (error) {
  //     console.error('Failed to search users', error);
  //     alert('Failed to search users. Please try again.'); // User feedback on error
  //   }
  // };

//   return (
//     <Box p={3} display="flex" height="80vh">
//       {/* Chat/User List */}
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'scroll' }}>
//         {/* Search Bar */}
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </Box>

//         {/* User/Chat List */}
//         <List>
//           {searchTerm ? (
//             // Show search results if there is a search term
//             searchResults.map((user, index) => (
//               <React.Fragment key={index}>
//                 <ListItem button onClick={() => console.log('Start chat with user', user)}>
//                   <ListItemAvatar>
//                     <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//                   </ListItemAvatar>
//                   <ListItemText primary={user.username} />
//                 </ListItem>
//                 <Divider />
//               </React.Fragment>
//             ))
//           ) : (
//             // Show chats if no search term
//             chats.map((chat, index) => (
//               <React.Fragment key={index}>
//                 <ListItem button onClick={() => handleChatSelect(chat)}>
//                   <ListItemAvatar>
//                     <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={chat.chatName}
//                     secondary={chat.latestMessage?.content || ''}
//                   />
//                   <Typography variant="caption" color="textSecondary">
//                     {chat.updatedAt}
//                   </Typography>
//                 </ListItem>
//                 <Divider />
//               </React.Fragment>
//             ))
//           )}
//         </List>
//       </Paper>

//       {/* Chat Window */}
//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc">
//               <Typography variant="h6">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box p={2} flexGrow={1} overflowY="scroll">
//               {messages.map((msg, idx) => (
//                 <Typography key={idx} variant="body2" color="textPrimary">
//                   {msg.sender.username}: {msg.content}
//                 </Typography>
//               ))}
//             </Box>
//             <Box p={2} display="flex">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//               <IconButton color="primary" onClick={handleSendMessage}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(''); // Track search input
//   const [searchResults, setSearchResults] = useState([]); // Store search results

//   // Fetch all chats for the logged-in user
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };

//     fetchChats();
//   }, []);

//   // Handle chat selection
//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);

//     try {
//       // Fetch the messages for the selected chat
//       const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(response.data); // Update the messages state with fetched messages
      
//       // Join the selected chat room
//       socket.emit('joinChat', chat._id); 
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   // Send a message
//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = {
//         content: message,
//         chatId: selectedChat._id,
//       };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]); // Add the sent message to the current list
//           setMessage(''); // Clear the input field
//           socket.emit('newMessage', response.data); // Emit new message event to the server
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   // Listen for new messages in real-time
//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       // Only update messages for the currently selected chat
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });

//     return () => {
//       socket.off('messageReceived'); // Cleanup listener on component unmount
//     };
//   }, [selectedChat]);

//   const handleUserSelect = async (user) => {
//     try {
//       // Make API call to create or fetch a chat with the selected user
//       const response = await axios.post(
//         'http://localhost:4000/api/chats/one-on-one', 
//         { userId: user._id }, // Pass the user ID to create/fetch the chat
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         }
//       );
//       const chat = response.data;
  
//       setSelectedChat(chat); // Set the chat as the selected chat
  
//       // Fetch the messages for the newly created or fetched chat
//       const messagesResponse = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(messagesResponse.data); // Display the messages
  
//       // Join the selected chat room via socket
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to start or fetch chat', error);
//     }
//   };
  

//   // // Handle search input and call search API
//   // const handleSearch = async (e) => {
//   //   const term = e.target.value.toLowerCase();
//   //   setSearchTerm(term);

//   //   if (term.trim() === '') {
//   //     setSearchResults([]); // Clear results if the search term is empty
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.get(
//   //       `http://localhost:4000/api/users/search?q=${term}`,
//   //       {
//   //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Ensure correct token
//   //       }
//   //     );
//   //     setSearchResults(response.data); // Store search results
//   //   } catch (error) {
//   //     console.error('Failed to search users', error);
//   //     alert('Failed to search users. Please try again.'); // User feedback on error
//   //   }
//   // };
//     // Handle search input and call search API
//     const handleSearch = async (e) => {
//       const term = e.target.value.toLowerCase();
//       setSearchTerm(term);
  
//       if (term.trim() === '') {
//         setSearchResults([]); // Clear results if the search term is empty
//         return;
//       }
  
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/api/users/search?q=${term}`,
//           {
//             headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, // Use correct token name
//           }
//         );
//         setSearchResults(response.data); // Store search results
//       } catch (error) {
//         console.error('Failed to search users', error);
//         alert('Failed to search users. Please try again.'); // User feedback on error
//       }
//     };

//   return (
//     <Box p={3} display="flex" height="80vh">
//       {/* Chat/User List */}
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'scroll' }}>
//         {/* Search Bar */}
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </Box>

//         {/* User/Chat List */}
//         <List>
//   {searchTerm ? (
//     searchResults.map((user, index) => (
//       <React.Fragment key={index}>
//         <ListItem button onClick={() => handleUserSelect(user)}>
//           <ListItemAvatar>
//             <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//           </ListItemAvatar>
//           <ListItemText primary={user.username} />
//         </ListItem>
//         <Divider />
//       </React.Fragment>
//     ))
//   ) : (
//     chats.map((chat, index) => (
//       <React.Fragment key={index}>
//         <ListItem button onClick={() => handleChatSelect(chat)}>
//           <ListItemAvatar>
//             <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//           </ListItemAvatar>
//           <ListItemText
//             primary={chat.chatName}
//             secondary={chat.latestMessage?.content || ''}
//           />
//         </ListItem>
//         <Divider />
//       </React.Fragment>
//     ))
//   )}
// </List>

//       </Paper>

//       {/* Chat Window */}
//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc">
//               <Typography variant="h6">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box p={2} flexGrow={1} overflowY="scroll">
//               {messages.map((msg, idx) => (
//                 <Typography key={idx} variant="body2" color="textPrimary">
//                   {msg.sender.username}: {msg.content}
//                 </Typography>
//               ))}
//             </Box>
//             <Box p={2} display="flex">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//               <IconButton color="primary" onClick={handleSendMessage}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;


// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(''); // Track search input
//   const [searchResults, setSearchResults] = useState([]); // Store search results

//   // Fetch current user from local storage
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//   // Fetch all chats for the logged-in user
//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };

//     fetchChats();
//   }, []);

//   // Handle chat selection
//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);

//     try {
//       // Fetch the messages for the selected chat
//       const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(response.data); // Update the messages state with fetched messages

//       // Join the selected chat room
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   // Send a message
//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = {
//         content: message,
//         chatId: selectedChat._id,
//       };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]); // Add the sent message to the current list
//           setMessage(''); // Clear the input field
//           socket.emit('newMessage', response.data); // Emit new message event to the server
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   // Listen for new messages in real-time
//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       // Only update messages for the currently selected chat
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });

//     return () => {
//       socket.off('messageReceived'); // Cleanup listener on component unmount
//     };
//   }, [selectedChat]);

//   const handleUserSelect = async (user) => {
//     try {
//       // Make API call to create or fetch a chat with the selected user
//       const response = await axios.post(
//         'http://localhost:4000/api/chats/one-on-one',
//         { userId: user._id }, // Pass the user ID to create/fetch the chat
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         }
//       );
//       const chat = response.data;

//       setSelectedChat(chat); // Set the chat as the selected chat

//       // Fetch the messages for the newly created or fetched chat
//       const messagesResponse = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(messagesResponse.data); // Display the messages

//       // Join the selected chat room via socket
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to start or fetch chat', error);
//     }
//   };

//   // Handle search input and call search API
//   const handleSearch = async (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (term.trim() === '') {
//       setSearchResults([]); // Clear results if the search term is empty
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `http://localhost:4000/api/users/search?q=${term}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, // Use correct token name
//         }
//       );
//       setSearchResults(response.data); // Store search results
//     } catch (error) {
//       console.error('Failed to search users', error);
//       alert('Failed to search users. Please try again.'); // User feedback on error
//     }
//   };

//   return (
//     <Box p={3} display="flex" height="80vh">
//       {/* Chat/User List */}
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'scroll' }}>
//         {/* Search Bar */}
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </Box>

//         {/* User/Chat List */}
//         <List>
//           {searchTerm ? (
//             searchResults.map((user, index) => (
//               <React.Fragment key={index}>
//                 <ListItem button onClick={() => handleUserSelect(user)}>
//                   <ListItemAvatar>
//                     <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//                   </ListItemAvatar>
//                   <ListItemText primary={user.username} />
//                 </ListItem>
//                 <Divider />
//               </React.Fragment>
//             ))
//           ) : (
//             chats.map((chat, index) => (
//               <React.Fragment key={index}>
//                 <ListItem button onClick={() => handleChatSelect(chat)}>
//                   <ListItemAvatar>
//                     <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={chat.chatName}
//                     secondary={chat.latestMessage?.content || ''}
//                   />
//                 </ListItem>
//                 <Divider />
//               </React.Fragment>
//             ))
//           )}
//         </List>
//       </Paper>

//       {/* Chat Window */}
//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc">
//               <Typography variant="h6">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box p={2} flexGrow={1} overflowY="scroll">
//               {messages.map((msg, idx) => {
//                 const isCurrentUser = msg.sender._id === currentUser._id;

//                 return (
//                   <Box
//                     key={idx}
//                     display="flex"
//                     justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
//                     mb={1}
//                   >
//                     <Box
//                       bgcolor={isCurrentUser ? 'primary.main' : 'grey.300'}
//                       color={isCurrentUser ? 'white' : 'black'}
//                       p={1}
//                       borderRadius={1}
//                       maxWidth="60%"
//                     >
//                       <Typography variant="body2" color="inherit">
//                         {isCurrentUser ? 'You' : msg.sender.username}: {msg.content}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}
//             </Box>
//             <Box p={2} display="flex">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//               <IconButton color="primary" onClick={handleSendMessage}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//   const messagesEndRef = useRef(null); // Ref to scroll to the latest message

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };
//     fetchChats();
//   }, []);

//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);

//     try {
//       const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(response.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = { content: message, chatId: selectedChat._id };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]);
//           setMessage('');
//           socket.emit('newMessage', response.data);
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });
//     return () => socket.off('messageReceived');
//   }, [selectedChat]);

//   const handleUserSelect = async (user) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:4000/api/chats/one-on-one',
//         { userId: user._id },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
//       );
//       const chat = response.data;
//       setSelectedChat(chat);

//       const messagesResponse = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(messagesResponse.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to start or fetch chat', error);
//     }
//   };

//   const handleSearch = async (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (!term.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:4000/api/users/search?q=${term}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Failed to search users', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   return (
//     <Box p={3} display="flex" height="80vh">
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'scroll' }}>
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </Box>
//         <List>
//           {searchTerm
//             ? searchResults.map((user, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleUserSelect(user)}>
//                     <ListItemAvatar>
//                       <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText primary={user.username} />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))
//             : chats.map((chat, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleChatSelect(chat)}>
//                     <ListItemAvatar>
//                       <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={chat.chatName}
//                       secondary={chat.latestMessage?.content || ''}
//                     />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))}
//         </List>
//       </Paper>

//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc">
//               <Typography variant="h6">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box p={2} flexGrow={1} overflowY="auto" sx={{ maxHeight: 'calc(80vh - 140px)'}}>
//               {messages.map((msg, idx) => {
//                 const isCurrentUser = msg.sender._id === currentUser._id;
//                 return (
//                   <Box
//                     key={idx}
//                     display="flex"
//                     justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
//                     mb={1}
//                   >
//                     <Box
//                       bgcolor={isCurrentUser ? 'primary.main' : 'grey.300'}
//                       color={isCurrentUser ? 'white' : 'black'}
//                       p={1}
//                       borderRadius={1}
//                       maxWidth="60%"
//                     >
//                       <Typography variant="body2" color="inherit">
//                         {isCurrentUser ? 'You' : msg.sender.username}: {msg.content}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </Box>
//             <Box p={2} display="flex">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//               <IconButton color="primary" onClick={handleSendMessage}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };
//     fetchChats();
//   }, []);

//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);
//     try {
//       const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(response.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = { content: message, chatId: selectedChat._id };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]);
//           setMessage('');
//           socket.emit('newMessage', response.data);
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });
//     return () => socket.off('messageReceived');
//   }, [selectedChat]);

//   const handleUserSelect = async (user) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:4000/api/chats/one-on-one',
//         { userId: user._id },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
//       );
//       const chat = response.data;
//       setSelectedChat(chat);

//       const messagesResponse = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(messagesResponse.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to start or fetch chat', error);
//     }
//   };

//   const handleSearch = async (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (!term.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:4000/api/users/search?q=${term}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Failed to search users', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   return (
//     <Box p={3} display="flex" height="80vh">
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'scroll', borderRadius: '10px' }}>
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//             sx={{ borderRadius: '10px' }}
//           />
//         </Box>
//         <List>
//           {searchTerm
//             ? searchResults.map((user, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleUserSelect(user)}>
//                     <ListItemAvatar>
//                       <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText primary={user.username} />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))
//             : chats.map((chat, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleChatSelect(chat)}>
//                     <ListItemAvatar>
//                       <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={chat.chatName}
//                       secondary={chat.latestMessage?.content || ''}
//                     />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))}
//         </List>
//       </Paper>

//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc" bgcolor="primary.light" borderRadius="10px 10px 0 0">
//               <Typography variant="h6" color="primary.contrastText">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box p={2} flexGrow={1} overflowY="auto" sx={{ maxHeight: 'calc(80vh - 140px)', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '0 0 10px 10px' }}>
//               {messages.map((msg, idx) => {
//                 const isCurrentUser = msg.sender._id === currentUser._id;
//                 return (
//                   <Box
//                     key={idx}
//                     display="flex"
//                     justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
//                     mb={1}
//                   >
//                     <Box
//                       sx={{
//                         bgcolor: isCurrentUser ? 'primary.main' : 'grey.300',
//                         color: isCurrentUser ? 'white' : 'black',
//                         p: 1,
//                         borderRadius: 1,
//                         maxWidth: '60%',
//                         boxShadow: 2
//                       }}
//                     >
//                       <Typography variant="body2" color="inherit">
//                         {isCurrentUser ? 'You' : msg.sender.username}: {msg.content}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </Box>
//             <Box p={2} display="flex" alignItems="center" bgcolor="#f9f9f9" borderRadius="0 0 10px 10px">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 sx={{ mr: 1, borderRadius: '10px' }}
//               />
//               <IconButton color="primary" onClick={handleSendMessage}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };
//     fetchChats();
//   }, []);

//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);
//     try {
//       const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(response.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = { content: message, chatId: selectedChat._id };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]);
//           setMessage('');
//           socket.emit('newMessage', response.data);
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });
//     return () => socket.off('messageReceived');
//   }, [selectedChat]);

//   const handleUserSelect = async (user) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:4000/api/chats/one-on-one',
//         { userId: user._id },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
//       );
//       const chat = response.data;
//       setSelectedChat(chat);

//       const messagesResponse = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(messagesResponse.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to start or fetch chat', error);
//     }
//   };

//   const handleSearch = async (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (!term.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:4000/api/users/search?q=${term}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Failed to search users', error);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   return (
//     <Box p={3} display="flex" height="80vh">
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'auto', borderRadius: '10px' }}>
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//             sx={{ borderRadius: '10px' }}
//           />
//         </Box>
//         <List sx={{ maxHeight: 'calc(80vh - 100px)', overflowY: 'auto' }}>
//           {searchTerm
//             ? searchResults.map((user, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleUserSelect(user)}>
//                     <ListItemAvatar>
//                       <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText primary={user.username} />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))
//             : chats.map((chat, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleChatSelect(chat)}>
//                     <ListItemAvatar>
//                       <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={chat.chatName}
//                       secondary={chat.latestMessage?.content || ''}
//                     />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))}
//         </List>
//       </Paper>

//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc" bgcolor="primary.light" borderRadius="10px 10px 0 0">
//               <Typography variant="h6" color="primary.contrastText">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box
//               p={2}
//               flexGrow={1}
//               sx={{ overflowY: 'auto', backgroundColor: '#f0f0f0', padding: '10px', maxHeight: 'calc(80vh - 150px)', borderRadius: '0 0 10px 10px' }}
//             >
//               {messages.map((msg, idx) => {
//                 const isCurrentUser = msg.sender._id === currentUser._id;
//                 return (
//                   <Box
//                     key={idx}
//                     display="flex"
//                     justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
//                     mb={1}
//                   >
//                     <Box
//                       sx={{
//                         bgcolor: isCurrentUser ? 'primary.main' : 'grey.300',
//                         color: isCurrentUser ? 'white' : 'black',
//                         p: 1,
//                         borderRadius: 1,
//                         maxWidth: '60%',
//                         boxShadow: 2,
//                       }}
//                     >
//                       <Typography variant="body2" color="inherit">
//                         {isCurrentUser ? 'You' : msg.sender.username}: {msg.content}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </Box>
//             <Box p={2} display="flex" alignItems="center" bgcolor="#f9f9f9" borderRadius="0 0 10px 10px">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 sx={{ mr: 1, borderRadius: '10px' }}
//               />
//               <IconButton color="primary" onClick={handleSendMessage}>
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;


// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Divider,
//   TextField,
//   IconButton,
//   Paper,
//   Button,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Connect to the backend server
// const socket = io('http://localhost:4000'); // Change to your backend URL

// function Chats() {
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [file, setFile] = useState(null); // State to hold the file
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         });
//         setChats(response.data);
//       } catch (error) {
//         console.error('Failed to load chats', error);
//       }
//     };
//     fetchChats();
//   }, []);

//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);
//     try {
//       const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setMessages(response.data);
//       socket.emit('joinChat', chat._id);
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const newMessage = { content: message, chatId: selectedChat._id };

//       axios
//         .post('http://localhost:4000/api/messages', newMessage, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         })
//         .then((response) => {
//           setMessages([...messages, response.data]);
//           setMessage('');
//           socket.emit('newMessage', response.data);
//         })
//         .catch((error) => {
//           console.error('Failed to send message', error);
//         });
//     }
//   };

//   useEffect(() => {
//     socket.on('messageReceived', (newMessage) => {
//       if (selectedChat && newMessage.chat._id === selectedChat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     });
//     return () => socket.off('messageReceived');
//   }, [selectedChat]);

//   const handleFileSelect = (event) => {
//     setFile(event.target.files[0]); // Capture the selected file
//   };

//   const handleFileUpload = async () => {
//     if (!file || !selectedChat) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post(
//         `http://localhost:8081/resource/group/${selectedChat.chatName}`, // Assuming chatName is the receiver
//         formData
//       );
//       setFile(null); // Clear the file after upload
//       alert('File uploaded successfully');
//     } catch (error) {
//       console.error('Failed to upload file', error);
//     }
//   };

//   const handleSearch = async (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (!term.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:4000/api/users/search?q=${term}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('Failed to search users', error);
//     }
//   };


//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   return (
//     <Box p={3} display="flex" height="80vh">
//       <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'auto', borderRadius: '10px' }}>
//         <Box p={2}>
//           <TextField
//             variant="outlined"
//             placeholder="Search Chats or Users"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//             sx={{ borderRadius: '10px' }}
//           />
//         </Box>
//         <List sx={{ maxHeight: 'calc(80vh - 100px)', overflowY: 'auto' }}>
//           {searchTerm
//             ? searchResults.map((user, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleUserSelect(user)}>
//                     <ListItemAvatar>
//                       <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText primary={user.username} />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))
//             : chats.map((chat, index) => (
//                 <React.Fragment key={index}>
//                   <ListItem button onClick={() => handleChatSelect(chat)}>
//                     <ListItemAvatar>
//                       <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={chat.chatName}
//                       secondary={chat.latestMessage?.content || ''}
//                     />
//                   </ListItem>
//                   <Divider />
//                 </React.Fragment>
//               ))}
//         </List>
//       </Paper>

//       <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
//         {selectedChat ? (
//           <>
//             <Box p={2} borderBottom="1px solid #ccc" bgcolor="primary.light" borderRadius="10px 10px 0 0">
//               <Typography variant="h6" color="primary.contrastText">{selectedChat.chatName}</Typography>
//             </Box>
//             <Box
//               p={2}
//               flexGrow={1}
//               sx={{ overflowY: 'auto', backgroundColor: '#f0f0f0', padding: '10px', maxHeight: 'calc(80vh - 150px)', borderRadius: '0 0 10px 10px' }}
//             >
//               {messages.map((msg, idx) => {
//                 const isCurrentUser = msg.sender._id === currentUser._id;
//                 return (
//                   <Box
//                     key={idx}
//                     display="flex"
//                     justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
//                     mb={1}
//                   >
//                     <Box
//                       sx={{
//                         bgcolor: isCurrentUser ? 'primary.main' : 'grey.300',
//                         color: isCurrentUser ? 'white' : 'black',
//                         p: 1,
//                         borderRadius: 1,
//                         maxWidth: '60%',
//                         boxShadow: 2,
//                       }}
//                     >
//                       <Typography variant="body2" color="inherit">
//                         {isCurrentUser ? 'You' : msg.sender.username}: {msg.content}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </Box>
//             <Box p={2} display="flex" alignItems="center" bgcolor="#f9f9f9" borderRadius="0 0 10px 10px">
//               <TextField
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 fullWidth
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 sx={{ mr: 1, borderRadius: '10px' }}
//               />
//               <input
//                 type="file"
//                 onChange={handleFileSelect}
//                 style={{ display: 'none' }}
//                 id="file-upload"
//               />
//               <label htmlFor="file-upload">
//                 <IconButton component="span">
//                   <AttachFileIcon />
//                 </IconButton>
//               </label>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={file ? handleFileUpload : handleSendMessage}
//                 sx={{ borderRadius: '10px' }}
//               >
//                 {file ? 'Upload' : <SendIcon />}
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100%">
//             <Typography variant="h6" color="textSecondary">
//               Select a chat to start messaging
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// export default Chats;


import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import io from 'socket.io-client';
import axios from 'axios';

// Connect to the backend server
const socket = io('http://localhost:4000'); // Change to your backend URL

function Chats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [file, setFile] = useState(null); // State to hold the file
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/chats/my-chats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setChats(response.data);
      } catch (error) {
        console.error('Failed to load chats', error);
      }
    };
    fetchChats();
  }, []);

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await axios.get(`http://localhost:4000/api/chats/${chat._id}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setMessages(response.data);
      socket.emit('joinChat', chat._id);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { content: message, chatId: selectedChat._id };

      axios
        .post('http://localhost:4000/api/messages', newMessage, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        })
        .then((response) => {
          setMessages([...messages, response.data]);
          setMessage('');
          socket.emit('newMessage', response.data);
        })
        .catch((error) => {
          console.error('Failed to send message', error);
        });
    }
  };

  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    return () => socket.off('messageReceived');
  }, [selectedChat]);

  const handleFileSelect = (event) => {
    setFile(event.target.files[0]); // Capture the selected file
  };

  const handleFileUpload = async () => {
    if (!file || !selectedChat) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `http://localhost:8081/resource/group/${selectedChat.chatName}`, 
        formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      
      const fileMessage = {
        content: `File: ${response.data.fileName}`, // Adjust based on the backend response
        chatId: selectedChat._id,
        fileUrl: response.data.fileUrl // Assuming backend returns a URL for the uploaded file
      };
      
      // Add the file message to the chat like a regular message
      const messageResponse = await axios.post('http://localhost:4000/api/messages', fileMessage, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      
      setMessages([...messages, messageResponse.data]);
      setFile(null); // Clear the file after upload
      socket.emit('newMessage', messageResponse.data); // Notify other users about the file upload
      
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Failed to upload file', error);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/users/search?q=${term}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Box p={3} display="flex" height="80vh">
      <Paper elevation={3} sx={{ width: '30%', mr: 2, overflowY: 'auto', borderRadius: '10px' }}>
        <Box p={2}>
          <TextField
            variant="outlined"
            placeholder="Search Chats or Users"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            sx={{ borderRadius: '10px' }}
          />
        </Box>
        <List sx={{ maxHeight: 'calc(80vh - 100px)', overflowY: 'auto' }}>
          {searchTerm
            ? searchResults.map((user, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleUserSelect(user)}>
                    <ListItemAvatar>
                      <Avatar src={user.avatar || 'https://via.placeholder.com/150'} />
                    </ListItemAvatar>
                    <ListItemText primary={user.username} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            : chats.map((chat, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleChatSelect(chat)}>
                    <ListItemAvatar>
                      <Avatar src={chat.avatar || 'https://via.placeholder.com/150'} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.chatName}
                      secondary={chat.latestMessage?.content || ''}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
        {selectedChat ? (
          <>
            <Box p={2} borderBottom="1px solid #ccc" bgcolor="primary.light" borderRadius="10px 10px 0 0">
              <Typography variant="h6" color="primary.contrastText">{selectedChat.chatName}</Typography>
            </Box>
            <Box
              p={2}
              flexGrow={1}
              sx={{ overflowY: 'auto', backgroundColor: '#f0f0f0', padding: '10px', maxHeight: 'calc(80vh - 150px)', borderRadius: '0 0 10px 10px' }}
            >
              {messages.map((msg, idx) => {
                const isCurrentUser = msg.sender._id === currentUser._id;
                const isFileMessage = msg.content.startsWith('File:'); // Check if the message is a file message

                return (
                  <Box
                    key={idx}
                    display="flex"
                    justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
                    mb={1}
                  >
                    <Box
                      sx={{
                        bgcolor: isCurrentUser ? 'primary.main' : 'grey.300',
                        color: isCurrentUser ? 'white' : 'black',
                        p: 1,
                        borderRadius: 1,
                        maxWidth: '60%',
                        boxShadow: 2,
                      }}
                    >
                      {isFileMessage ? (
                        <Typography variant="body2" color="inherit">
                          {isCurrentUser ? 'You' : msg.sender.username}: 
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                            {msg.content.replace('File: ', '')}
                          </a>
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="inherit">
                          {isCurrentUser ? 'You' : msg.sender.username}: {msg.content}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>
            <Box p={2} display="flex" alignItems="center" bgcolor="#f9f9f9" borderRadius="0 0 10px 10px">
              <TextField
                variant="outlined"
                placeholder="Type your message..."
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mr: 2, borderRadius: '10px' }}
              />
              <IconButton color="primary" component="label">
                <AttachFileIcon />
                <input type="file" hidden onChange={handleFileSelect} />
              </IconButton>
              {file && (
                <Button variant="contained" color="primary" onClick={handleFileUpload}>
                  Upload
                </Button>
              )}
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ p: 3, textAlign: 'center' }}>Select a chat to start messaging</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Chats;
