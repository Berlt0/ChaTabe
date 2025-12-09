import mongoose from 'mongoose';
import User from '../model/userModel.js';


// const formatProfilePic = (user) => {

//   if (user.profilePic?.data) {
//     return `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString("base64")}`;
//   } else if (typeof user.profilePic === "string") {
//     return user.profilePic;
//   } else {
//     return user.profilePicURL;
//   }
// };

// const formatProfilePic = (user) => {
//   if (user.profilePicURL) return user.profilePicURL;
//   if (user.profilePic?.data && user.profilePic?.contentType) {
//     const base64 = Buffer.from(user.profilePic.data).toString("base64");
//     return `data:${user.profilePic.contentType};base64,${base64}`;
//   }
//   return "/default-avatar.png";
// };



const formatProfilePic = (user) => {
  try {
    if (!user) return '/default-avatar.png';

    // prefer explicit external/url first
    if (user.profilePicURL) return user.profilePicURL;

    const pic = user.profilePic;

    // already a usable string (data URI or URL)
    if (typeof pic === 'string' && pic.length > 0) return pic;

    // if pic itself is a Buffer
    if (Buffer.isBuffer(pic)) {
      const contentType = user.profilePicContentType || user.profilePic?.contentType || 'image/png';
      return `data:${contentType};base64,${pic.toString('base64')}`;
    }

    // handle objects that contain .data (common after .lean())
    if (pic && pic.data != null) {
      let raw = pic.data;

      // some shapes: pic.data -> { data: [...] }
      if (raw && raw.data != null) raw = raw.data;

      // { type: 'Buffer', data: [...] } -> raw is that object; handle above .data
      // If raw is an array of numbers
      if (Array.isArray(raw)) {
        raw = Buffer.from(raw);
      } else if (Buffer.isBuffer(raw)) {
        // ok
      } else if (raw instanceof Uint8Array) {
        raw = Buffer.from(raw);
      } else if (typeof raw === 'object' && raw.type === 'Buffer' && Array.isArray(raw.data)) {
        raw = Buffer.from(raw.data);
      } else {
        // last resort: try to convert typed arrays or similar
        try {
          raw = Buffer.from(raw);
        } catch (e) {
          console.error('formatProfilePic: cannot convert raw to Buffer', e);
          return user.profilePicURL || '/default-avatar.png';
        }
      }

      if (!Buffer.isBuffer(raw)) {
        // still not buffer: fallback
        return user.profilePicURL || '/default-avatar.png';
      }

      const contentType = pic.contentType || user.profilePic?.contentType || 'image/png';
      return `data:${contentType};base64,${raw.toString('base64')}`;
    }

    // fallback to URL or default
    return user.profilePicURL || '/default-avatar.png';
  } catch (err) {
    console.error('formatProfilePic error (ignored)', err);
    return user.profilePicURL || '/default-avatar.png';
  }
}


export const searchUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username required" });
    }

    const usersRaw = await User.find({
      username: { $regex: username, $options: 'i' }, // making it a case-insensitive 
      _id: { $ne: req.userId } // current logged-in user is not included on search
    }).select('username email profilePic profilePicURL moodStatus').lean(); // select only necessary fields

  
    const users = usersRaw.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      moodStatus: user.moodStatus,
      profilePic: formatProfilePic(user)
    }));

    
    res.status(200).json({ success: true, users });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addContact = async (req, res) => {
  try {
    const { contactId } = req.body;

    // accept userId from several possible places (depends on your auth middleware)
    const userId = req.userId ?? req.user?.id ?? req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized (missing user id)" });
    }

    if (!contactId) {
      return res.status(400).json({ success: false, message: "Contact ID required" });
    }

    // validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(String(userId)) || !mongoose.Types.ObjectId.isValid(String(contactId))) {
      return res.status(400).json({ success: false, message: "Invalid user or contact id" });
    }

    // prevent adding self
    if (String(userId) === String(contactId)) {
      return res.status(400).json({ success: false, message: "You cannot add yourself" });
    }

    const user = await User.findById(userId);
    const contact = await User.findById(contactId);

    if (!user || !contact) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // already friends?
    if (Array.isArray(user.contacts) && user.contacts.some(id => String(id) === String(contactId))) {
      return res.status(400).json({ success: false, message: "Already added" });
    }

    // friend request already sent?
    if (Array.isArray(contact.friendRequests) && contact.friendRequests.some(req => String(req.from) === String(userId))) {
      return res.status(400).json({ success: false, message: "Friend request already sent" });
    }

    // push request and save
    contact.friendRequests = contact.friendRequests || [];
    contact.friendRequests.push({ from: userId });
    await contact.save();

    // safe io retrieval and guarded emit
    const io = req.app?.get('io') ?? (typeof global !== 'undefined' ? global.io : null);
    if (io && typeof io.to === 'function') {
      try {
        io.to(contact._id.toString()).emit('friendRequestReceived', {
          sender: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: formatProfilePic(user),
            profilePicURL: user.profilePicURL,
            moodStatus: user.moodStatus
          }
        });
      } catch (emitErr) {
        // log but don't fail the request
        console.error('emit error (ignored):', emitErr);
      }
    }

    // build safe response (no Buffers)
    const newContact = {
      _id: contact._id,
      username: contact.username,
      profilePicURL: contact.profilePicURL || null,
      profilePic: formatProfilePic(contact),
      moodStatus: contact.moodStatus || null
    };

    return res.status(200).json({
      success: true,
      message: "Contact added successfully",
      newContact
    });

  } catch (error) {
    console.error('addContact error:', error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};