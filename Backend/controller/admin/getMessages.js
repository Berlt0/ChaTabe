// controller/admin/getMessages.js
import Messages from "../../model/messageModel.js";

export const getAllMessages = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Always exclude deleted messages
    let query = { isDeleted: { $ne: true } };

    // Search only message text or content
    if (search && search.trim() !== "") {
      query.$or = [
        { text: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const messages = await Messages.find(query)
      .populate("sender", "username profilePic moodStatus")
      .populate("receiver", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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
