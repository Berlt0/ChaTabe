// controller/admin/getMessages.js
import Messages from "../../model/messageModel.js";

// ← INSERTED: Safe regex function (prevents crashes)
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getAllMessages = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isDeleted: false }; 

   
    if (search && search.trim() !== "") {
      const safeSearch = escapeRegExp(search.trim()); 

      query.$or = [
        { text: { $regex: safeSearch, $options: "i" } },    
        { content: { $regex: safeSearch, $options: "i" } }  
      ];
    }

    const messages = await Messages.find(query)
      .populate("sender", "username profilePic moodStatus isBanned")
      .populate("receiver", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(); 

    const total = await Messages.countDocuments(query);

    res.json({
      success: true,
      messages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};