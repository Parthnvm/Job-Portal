import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { extractResumeText } from "../utils/resumeExtractor.js";
import { groqResumeAnalyzer } from "../services/groqService.js";
import { ResumeAnalysis } from "../models/resumeAnalysis.model.js";
import { isValidEmail, isValidPassword, isValidRole } from "../utils/validator.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields (fullname, email, phoneNumber, password, role) are required.",
        success: false,
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
        success: false,
      });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({
        message: "Role must be either 'student' or 'recruiter'.",
        success: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname: fullname.trim(),
      email: cleanEmail,
      phoneNumber: String(phoneNumber).trim(),
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("[register error]:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required.",
        success: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check if role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const secretKey = process.env.SECRET_KEY || process.env.JWT_SECRET || "fallback_dev_secret_key";
    const token = jwt.sign(tokenData, secretKey, {
      expiresIn: "1d",
    });

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userResponse,
        token,
        success: true,
      });
  } catch (error) {
    console.error("[login error]:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    // if (!fullname || !email || !phonenumber || !bio || !skills) {
    //   return res.status(400).json({
    //     message: "Something is missing",
    //     success: false,
    //   });
    // }

    // Cloudinary will come here
    let skillsArray;
    if (skills) {
      skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    }
    // Ensure the request contains an authenticated user ID
    if (!req.id) {
      return res.status(401).json({
        message: "Unauthorized: missing user ID.",
        success: false,
      });
    }
    const userId = req.id; // Middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // Updating data
    if (fullname) user.fullname = fullname;
    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({
          message: "Email is already in use by another account.",
          success: false,
        });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if(bio) user.profile.bio = bio
    if(skills) user.profile.skills = skillsArray
    

    // Resume will come here later

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a PDF or text resume.",
        success: false,
      });
    }

    const userId = req.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: Missing user authentication.",
        success: false,
      });
    }

    // Extract, clean, and validate resume text
    let extracted;
    try {
      extracted = await extractResumeText(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    } catch (extractErr) {
      return res.status(400).json({
        message: extractErr.message || "Failed to extract readable text from resume.",
        success: false,
      });
    }

    const { text, hash } = extracted;

    // Check if an analysis already exists for this exact resume content by this user
    const existing = await ResumeAnalysis.findOne({
      userId,
      resumeHash: hash,
    }).sort({ createdAt: -1 });

    if (existing) {
      return res.status(200).json({
        success: true,
        cached: true,
        analysis: existing.analysis,
        fileName: existing.fileName || req.file.originalname,
        createdAt: existing.createdAt,
        message: "Loaded existing analysis for this resume.",
      });
    }

    // Perform AI analysis via Groq with structured outputs (or resilient local heuristic engine if unconfigured)
    const result = await groqResumeAnalyzer.analyze(text, hash);

    // Save persistent analysis in database
    const saved = await ResumeAnalysis.create({
      userId,
      resumeHash: hash,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      analysis: result.analysis,
      modelUsed: result.modelUsed,
      usage: result.usage,
    });

    // Optionally update user's profile metadata if present
    try {
      await User.findByIdAndUpdate(userId, {
        "profile.resumeOriginalName": req.file.originalname,
      });
    } catch (userUpdateErr) {
      console.warn("Failed to update user resumeOriginalName:", userUpdateErr.message);
    }

    return res.status(200).json({
      success: true,
      cached: false,
      analysis: saved.analysis,
      fileName: saved.fileName,
      createdAt: saved.createdAt,
      message: "Resume analyzed successfully with Groq AI.",
    });
  } catch (error) {
    console.error("[analyzeResume error]:", error.message);
    const isRateLimit = error.message && error.message.includes("rate limit");
    return res.status(isRateLimit ? 429 : 500).json({
      message: error.message || "Internal server error while analyzing resume.",
      success: false,
    });
  }
};

export const getLatestResumeAnalysis = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: Missing user authentication.",
        success: false,
      });
    }

    const latest = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });
    if (!latest) {
      return res.status(200).json({
        success: true,
        analysis: null,
        message: "No prior resume analysis found for this candidate.",
      });
    }

    return res.status(200).json({
      success: true,
      analysis: latest.analysis,
      fileName: latest.fileName,
      createdAt: latest.createdAt,
      message: "Latest analysis retrieved successfully.",
    });
  } catch (error) {
    console.error("[getLatestResumeAnalysis error]:", error.message);
    return res.status(500).json({
      message: "Internal server error while fetching latest resume analysis.",
      success: false,
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token, role, action } = req.body;
    if (!token) {
      return res.status(400).json({
        message: "Google token is missing",
        success: false,
      });
    }

    // Fetch user info using Google Access Token
    const googleUserRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { email, name, picture } = googleUserRes.data;
    if (!email) {
      return res.status(400).json({
        message: "Google profile has no email address configured.",
        success: false
      });
    }

    // Check for linking flow
    const existingToken = req.cookies.token;
    let loggedInUserId = null;
    if (existingToken && action === 'link') {
      try {
        const decoded = jwt.verify(existingToken, process.env.SECRET_KEY);
        loggedInUserId = decoded.userId;
      } catch (err) {
        // ignore
      }
    }

    if (loggedInUserId) {
      const existingLinkedUser = await User.findOne({
        $or: [
          { email: email },
          { "profile.googleEmail": email }
        ],
        _id: { $ne: loggedInUserId }
      });
      if (existingLinkedUser) {
        return res.status(400).json({
          message: "This Google account is already linked to another user profile.",
          success: false
        });
      }

      const user = await User.findById(loggedInUserId);
      if (!user) {
        return res.status(400).json({ message: "User not found.", success: false });
      }
      user.profile.googleEmail = email;
      await user.save();
      return res.status(200).json({
        message: "Google account linked successfully!",
        user,
        success: true
      });
    }

    // Find user by email or profile.googleEmail
    let user = await User.findOne({
      $or: [
        { email: email },
        { "profile.googleEmail": email }
      ]
    });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        fullname: name || "Google User",
        email,
        phoneNumber: "0000000000",
        password: hashedPassword,
        role: role || "student",
        profile: {
          bio: "",
          skills: [],
          profilePhoto: picture || "",
          googleEmail: email,
        }
      });
    } else {
      if (!user.profile.googleEmail) {
        user.profile.googleEmail = email;
        await user.save();
      }
    }

    const tokenData = {
      userId: user._id,
    };
    const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", jwtToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        token: jwtToken,
        success: true,
      });
  } catch (error) {
    console.error("[googleLogin error]:", error);
    return res.status(500).json({
      message: "Google authentication failed",
      success: false,
    });
  }
};

export const githubCallback = async (req, res) => {
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  try {
    const { code, state } = req.query; // 'state' contains selected role (student or recruiter)
    if (!code) {
      return res.redirect(`${clientOrigin}/auth?error=missing_code`);
    }

    // Exchange auth code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI || "http://localhost:8000/api/v1/user/auth/github/callback",
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.redirect(`${clientOrigin}/auth?error=token_failed`);
    }

    // Fetch user profile info from GitHub
    const userProfileRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { login, name, avatar_url } = userProfileRes.data;
    let email = userProfileRes.data.email;

    // Fetch user primary email if not visible in profile payload
    if (!email) {
      try {
        const emailsRes = await axios.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const primaryEmailObj = emailsRes.data.find((e) => e.primary);
        email = primaryEmailObj ? primaryEmailObj.email : (emailsRes.data[0] ? emailsRes.data[0].email : null);
      } catch (err) {
        console.error("Failed to fetch email from GitHub list", err);
      }
    }

    if (!email) {
      email = `${login}@github.users.noreply.com`;
    }

    // Check for linking flow
    const existingToken = req.cookies?.token;
    let loggedInUserId = null;
    if (existingToken && state === 'link') {
      try {
        const decoded = jwt.verify(existingToken, process.env.SECRET_KEY);
        loggedInUserId = decoded.userId;
      } catch (err) {
        // ignore
      }
    }

    if (loggedInUserId) {
      // Check if email is already on THIS user's profile (idempotent re-link after disconnect)
      const currentUser = await User.findById(loggedInUserId);
      if (currentUser && currentUser.profile.githubEmail === email) {
        // Already linked to this user — treat as success
        return res.redirect(`${clientOrigin}/?link=github_success`);
      }

      // Check if email is linked to a DIFFERENT user
      const existingLinkedUser = await User.findOne({
        $or: [
          { email: email },
          { "profile.githubEmail": email }
        ],
        _id: { $ne: loggedInUserId }
      });
      if (existingLinkedUser) {
        return res.redirect(`${clientOrigin}/?error=github_already_linked`);
      }

      if (!currentUser) {
        return res.redirect(`${clientOrigin}/?error=user_not_found`);
      }
      currentUser.profile.githubEmail = email;
      await currentUser.save();
      return res.redirect(`${clientOrigin}/?link=github_success`);
    }

    // Find user by email or profile.githubEmail
    let user = await User.findOne({
      $or: [
        { email: email },
        { "profile.githubEmail": email }
      ]
    });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        fullname: name || login || "GitHub User",
        email,
        phoneNumber: "0000000000",
        password: hashedPassword,
        role: state === "recruiter" ? "recruiter" : "student",
        profile: {
          bio: "",
          skills: [],
          profilePhoto: avatar_url || "",
          githubEmail: email,
        }
      });
    } else {
      if (!user.profile.githubEmail) {
        user.profile.githubEmail = email;
        await user.save();
      }
    }

    const tokenData = {
      userId: user._id,
    };
    const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", jwtToken, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    });

    return res.redirect(`${clientOrigin}/`);
  } catch (error) {
    console.error("[githubCallback error]:", error);
    return res.redirect(`${clientOrigin}/auth?error=github_failed`);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const unlinkSocialAccount = async (req, res) => {
  try {
    const userId = req.id;
    const { provider } = req.body;

    if (!provider || (provider !== "google" && provider !== "github")) {
      return res.status(400).json({
        message: "Invalid provider specified",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (provider === "google") {
      if (!user.password && !user.profile.githubEmail) {
        return res.status(400).json({
          message: "You cannot disconnect Google as it is your only way to log in. Set up GitHub or a password first.",
          success: false,
        });
      }
      user.profile.googleEmail = undefined;
    } else if (provider === "github") {
      if (!user.password && !user.profile.googleEmail) {
        return res.status(400).json({
          message: "You cannot disconnect GitHub as it is your only way to log in. Set up Google or a password first.",
          success: false,
        });
      }
      user.profile.githubEmail = undefined;
    }

    await user.save();

    const responseUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account unlinked successfully!`,
      user: responseUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

