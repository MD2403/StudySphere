import { asyncHandler } from '../utils/asyncHandler.js';
import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import { ApiError } from '../utils/apiError.js';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';

// Create or fetch a one-on-one chat
// export const createChat = asyncHandler(async (req, res, next) => {
//     const { userId } = req.body;

//     if (!userId) {
//         throw new ApiError(400, 'User ID is required');
//     }

//     let chat = await Chat.findOne({
//         isGroupChat: false,
//         users: { $all: [req.user._id, userId] },
//     }).populate('users', '-password').populate('latestMessage');

//     if (chat) {
//         return res.status(200).json(chat);
//     }

//     const chatData = {
//         chatName: 'One-on-One Chat',
//         isGroupChat: false,
//         users: [req.user._id, userId],
//     };

//     try {
//         const newChat = await Chat.create(chatData);
//         const fullChat = await Chat.findById(newChat._id).populate('users', '-password');
//         return res.status(201).json(fullChat);
//     } catch (error) {
//         next(error);
//     }
// });

// Create or fetch a chat between two users
export const createChat = async (req, res) => {
  const { userId } = req.body; // The user you're starting a chat with

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    // Check if the chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    if (chat) {
      res.json(chat);
    } else {
      // If chat doesn't exist, create a new one
      const newChat = new Chat({
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      const createdChat = await newChat.save();
      res.status(200).json(createdChat);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all chats for the logged-in user
export const getMyChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({ users: req.user._id })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

  console.log('Chats:', chats); // Log the chats to verify the output
  return res.status(200).json(chats);
});

// Create a new group chat
export const createGroupChat = asyncHandler(async (req, res, next) => {
    const { users, chatName } = req.body;

    if (!users || users.length < 2) {
        throw new ApiError(400, 'A group chat requires at least 3 users');
    }

    users.push(req.user._id);  // Add the current user to the group

    const groupChatData = {
        chatName: chatName || 'Group Chat',
        isGroupChat: true,
        users,
        groupAdmin: req.user._id,
    };

    try {
        const groupChat = await Chat.create(groupChatData);
        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        return res.status(201).json(fullGroupChat);
    } catch (error) {
        next(error);
    }
});

// Fetch specific chat messages with pagination
export const getChatMessages = asyncHandler(async (req, res, next) => {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'username fullName')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
});



// Join an existing group chat
export const joinGroupChat = asyncHandler(async (req, res, next) => {
  const { chatId } = req.body;

  // Validate if chatId is a valid MongoDB ObjectId
  if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
    throw new ApiError(400, 'Invalid Chat ID');
  }

  // Find the group chat by ID
  const groupChat = await Chat.findById(chatId);

  if (!groupChat) {
    throw new ApiError(404, 'Group chat not found');
  }

  // Check if it's a group chat
  if (!groupChat.isGroupChat) {
    throw new ApiError(400, 'This is not a group chat');
  }

  // Check if the user is already in the group
  const isUserInGroup = groupChat.users.some(user => user.toString() === req.user._id.toString());

  if (isUserInGroup) {
    return res.status(400).json({ message: 'You are already a member of this group chat' });
  }

  // Add the user to the group
  groupChat.users.push(req.user._id);

  try {
    await groupChat.save();

    const fullGroupChat = await Chat.findById(chatId).populate('users', '-password').populate('groupAdmin', '-password');

    return res.status(200).json(fullGroupChat);
  } catch (error) {
    next(error);
  }
});



// Leave an existing group chat
export const leaveGroupChat = asyncHandler(async (req, res, next) => {
  const { chatId } = req.body;

  if (!chatId) {
    throw new ApiError(400, 'Chat ID is required to leave the group');
  }

  // Find the group chat by ID
  const groupChat = await Chat.findById(chatId);

  if (!groupChat) {
    throw new ApiError(404, 'Group chat not found');
  }

  // Check if it's a group chat
  if (!groupChat.isGroupChat) {
    throw new ApiError(400, 'This is not a group chat');
  }

  // Check if the user is part of the group
  const isUserInGroup = groupChat.users.some(user => user.toString() === req.user._id.toString());

  if (!isUserInGroup) {
    return res.status(400).json({ message: 'You are not a member of this group chat' });
  }

  // Remove the user from the group
  groupChat.users = groupChat.users.filter(user => user.toString() !== req.user._id.toString());

  // If the user leaving is the group admin and the last member, delete the group
  if (groupChat.users.length === 0) {
    await groupChat.remove();
    return res.status(200).json({ message: 'Group chat deleted as the last member left' });
  }

  // If the user is the group admin, reassign admin role
  if (groupChat.groupAdmin.toString() === req.user._id.toString()) {
    groupChat.groupAdmin = groupChat.users[0]; // Reassign admin to the first user in the group
  }

  try {
    await groupChat.save();
    return res.status(200).json({ message: 'You have left the group chat' });
  } catch (error) {
    next(error);
  }
});