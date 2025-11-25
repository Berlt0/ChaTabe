
import User from '../model/userModel.js';

export const searchUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username required" });
    }

    
    const users = await User.find({
      username: { $regex: username, $options: 'i' }, // making it a case-insensitive 
      _id: { $ne: req.userId } // current logged-in user is not included on search
    }).select('username email profilePic moodStatus'); // select only necessary fields

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const addContact = async (req, res) => {
  try {
    const { contactId } = req.body; 
    const userId = req.user.id; 

    // console.log(userId)

    if (!contactId) {
      return res.status(400).json({ success: false, message: "Contact ID required" });
    }

    if (userId === contactId) {
      return res.status(400).json({ success: false, message: "You cannot add yourself" });
    }

    const user = await User.findById(userId);
    const contact = await User.findById(contactId);

    if (!user || !contact) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

 
    if (user.contacts.includes(contactId)) {
      return res.status(400).json({ success: false, message: "Already added" });
    }

    user.contacts.push(contactId);
    contact.contacts.push(userId);

    await user.save();
    await contact.save();

    res.status(200).json({ success: true, message: "Contact added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
