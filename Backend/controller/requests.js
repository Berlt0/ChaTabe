import User from "../model/userModel.js";

export const acceptFriendRequest = async (req, res) => {
  const { senderId } = req.body; 
  const receiverId = req.user.id;

  const user = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  if (!user || !sender) 
    return res.status(404).json({ message: "User not found" });

  // Add each other to contacts
  if (!user.contacts.includes(sender._id)) user.contacts.push(sender._id);
  if (!sender.contacts.includes(user._id)) sender.contacts.push(user._id);

  // Remove the friend request
  user.friendRequests = user.friendRequests.filter(
    req => req.from.toString() !== sender._id.toString()
  );

  await user.save();
  await sender.save();

  // Function to get a valid image src
  const formatProfilePic = (user) => {
    if (user.profilePicURL) return user.profilePicURL; // Use URL if exists
    if (user.profilePic?.data && user.profilePic?.contentType) {
      const base64 = Buffer.from(user.profilePic.data).toString('base64');
      return `data:${user.profilePic.contentType};base64,${base64}`;
    }
    return "/default-avatar.png"; // fallback
  };

  const newContact = {
    _id: sender._id,
    username: sender.username,
    profilePic: formatProfilePic(sender), // Always a renderable string
    moodStatus: sender.moodStatus || null
  };

  return res.status(200).json({
    message: "Friend request accepted",
    newContact
  });
};

export const rejectFriendRequest = async (req, res) => {
 const { senderId } = req.body; 
  const receiverId = req.user.id;

  const user = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  if (!user || !sender)
    return res.status(404).json({ message: "User not found" });

  // Remove the friend request
  user.friendRequests = user.friendRequests.filter(
    req => req.from.toString() !== senderId.toString()
  );

  await user.save();

  // Same function as acceptFriendRequest
  const formatProfilePic = (user) => {
    if (user.profilePicURL) return user.profilePicURL;

    if (user.profilePic?.data && user.profilePic?.contentType) {
      const base64 = Buffer.from(user.profilePic.data).toString("base64");
      return `data:${user.profilePic.contentType};base64,${base64}`;
    }

    return "/default-avatar.png";
  };

  const rejectedUser = {
    _id: sender._id,
    username: sender.username,
    profilePic: formatProfilePic(sender),
    moodStatus: sender.moodStatus || null,
  };

  return res.status(200).json({
    message: "Friend request rejected",
    rejectedUser
  });
};
