import prisma from "../prisma/client.js";

// GET LOGGED IN USER (IMPORTANT FOR DASHBOARD)
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true, // 🔥 THIS FIXES YOUR PROBLEM
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};