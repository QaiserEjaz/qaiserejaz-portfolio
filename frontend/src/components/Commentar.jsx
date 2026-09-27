import { useState, useEffect, useRef, useCallback, memo } from "react";
import { ref, push, onValue } from "firebase/database";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, database } from "../firebase";
import {
  MessageCircle,
  UserCircle2,
  Loader2,
  AlertCircle,
  Send,
  ImagePlus,
  X,
  Star,
  Mail,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import PropTypes from "prop-types";

const GoogleIcon = () => (
  <svg
    viewBox="-3 0 262 262"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
    aria-hidden="true"
  >
    <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
    <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
    <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
    <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
  </svg>
);

const Comment = memo(({ comment, formatDate }) => (
  <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5 overflow-x-hidden">
    <div className="flex flex-col gap-1 sm:gap-2">
      <div className="flex items-center gap-2">
        {comment.profileImage ? (
          <img
            src={comment.profileImage}
            alt={`${comment.userName}'s profile`}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-indigo-500/30 shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="p-1 sm:p-1.5 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors shrink-0">
            <UserCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        )}
        <div className="flex items-center justify-between w-full gap-1 overflow-x-hidden">
          <h4 className="font-medium text-white truncate text-[10px] sm:text-xs">{comment.userName}</h4>
          <span className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">
            {formatDate(comment.createdAt)}
          </span>
        </div>
      </div>
      {comment.email && (
        <span className="text-[9px] sm:text-[10px] text-gray-400 truncate">{comment.email}</span>
      )}
      {comment.rating && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
            />
          ))}
        </div>
      )}
      <p className="text-gray-300 text-[10px] sm:text-[11px] break-words leading-tight overflow-x-hidden">
        {comment.content}
      </p>
    </div>
  </div>
));
Comment.displayName = "Comment";

Comment.propTypes = {
  comment: PropTypes.shape({
    profileImage: PropTypes.string,
    userName: PropTypes.string.isRequired,
    email: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number,
  }).isRequired,
  formatDate: PropTypes.func.isRequired,
};

// Comment Form Component with Email, Star Rating, and Abusive Checker
const CommentForm = memo(function CommentForm({
  onSubmit,
  isSubmitting,
  currentUser,
  onGoogleLogin,
  onGoogleLogout,
  isGoogleLoading,
}) {
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [abuseError, setAbuseError] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.displayName || "Google User");
      setEmail(currentUser.email || "");
      setProfileImage(currentUser.photoURL || null);
    } else {
      setProfileImage(null);
    }
  }, [currentUser]);

  // List of abusive words
  const abusiveWords = [
    // English
    "fuck", "shit", "bitch", "asshole", "damn", "bastard", "cunt", "dick", "pussy", "whore",
    "slut", "bimbo", "slutty", "shitty", "fucker", "motherfucker", "prick", "twat", "wanker",
    "arse", "bullshit", "crap", "douche", "faggot", "jerk", "piss", "screw", "suck",
    // Urdu
    "harami", "kutta", "kutiya", "suar", "gandu", "chutiya", "chutiye", "bhenchod", "madarchod",
    "randi", "haraam", "bewaqoof", "lanati", "kameena", "zaleel", "badzaat",
    // Hinglish
    "chutiyapa", "gandupana", "bhosdike", "bsdk", "saala", "saali", "fucktard", "shitkar",
    "bakchod", "randibaaz", "haramipana", "kuttapan", "behenji", "chodu", "lund", "bhadwa",
  ];

  // Check for abusive content
  const checkAbusiveContent = useCallback((text) => {
    const lowerText = text.toLowerCase();
    return abusiveWords.some((word) => lowerText.includes(word));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleTextareaChange = useCallback((e) => {
    setNewComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleStarClick = useCallback((starValue) => {
    setRating(starValue);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newComment.trim() || !userName.trim()) return;

      if (checkAbusiveContent(newComment)) {
        setAbuseError("Your comment contains inappropriate language. Please revise it.");
        return;
      }

      onSubmit({ newComment, userName, email, profileImage, imageFile, rating });
      setNewComment("");
      if (!currentUser) {
        setUserName("");
        setEmail("");
        setProfileImage(null);
      }
      setRating(0);
      setImagePreview(null);
      setImageFile(null);
      setAbuseError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    [newComment, userName, email, profileImage, imageFile, rating, onSubmit, checkAbusiveContent]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!currentUser ? (
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full max-w-[320px] mx-auto flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-base font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm transition hover:bg-white/10 hover:border-white/25 active:scale-[0.99] disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs sm:text-sm text-emerald-200">
          <div className="flex items-center gap-2 min-w-0">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || "Google user"}
                className="h-7 w-7 rounded-full object-cover border border-white/15"
              />
            ) : (
              <UserCircle2 className="h-7 w-7 text-emerald-300" />
            )}
            <div className="truncate">
              <p className="font-medium truncate">{currentUser.displayName || "Google User"}</p>
              <p className="text-[10px] text-emerald-100/80 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoogleLogout}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
        <label className="block text-xs sm:text-sm font-medium text-white">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs sm:text-sm"
          required
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1100">
        <label className="block text-xs sm:text-sm font-medium text-white">
          Email <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs sm:text-sm"
        />
      </div>

      {/* Star Rating Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
        <label className="block text-xs sm:text-sm font-medium text-white">
          Rating <span className="text-gray-400">(optional)</span>
        </label>
        <div className="flex items-center gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 sm:w-6 sm:h-6 cursor-pointer transition-colors duration-200 ${
                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
        <label className="block text-xs sm:text-sm font-medium text-white">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write your message here..."
          className="w-full p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[80px] sm:min-h-[120px] text-xs sm:text-sm"
          required
        />
      </div>

      {/* Profile Photo Field (still commented as in original) */}
      {/* <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
        <label className="block text-sm font-medium text-white">
          Profile Photo <span className="text-gray-400">(optional)</span>
        </label>
        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
          {imagePreview ? (
            <div className="flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
              />
              <button
                id="imageBtn"
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
              >
                <X className="w-4 h-4" />
                <span>Remove Photo</span>
              </button>
            </div>
          ) : (
            <div className="w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                id="imageBtn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
              >
                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Choose Profile Photo</span>
              </button>
              <p className="text-center text-gray-400 text-sm mt-2">
                Max file size: 5MB
              </p>
            </div>
          )}
        </div>
      </div> */}

      {/* Abuse Error Message */}
      {abuseError && (
        <div
          className="flex items-center gap-1 sm:gap-2 p-2 sm:p-4 text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-xl"
          data-aos="fade-in"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <p className="text-[10px] sm:text-sm">{abuseError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        id="submitBtn"
        type="submit"
        disabled={isSubmitting}
        data-aos="fade-up"
        data-aos-duration="1000"
        className="relative w-full h-10 sm:h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-xs sm:text-base"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
        <div className="relative flex items-center justify-center gap-1 sm:gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Post Comment</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
});

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  onGoogleLogin: PropTypes.func.isRequired,
  onGoogleLogout: PropTypes.func.isRequired,
  isGoogleLoading: PropTypes.bool.isRequired,
};

const Komentar = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    AOS.init({ once: false, duration: 1000 });
  }, []);

  // Fetch comments from Realtime Database
  useEffect(() => {
    const commentsRef = ref(database, "portfolio-comments");

    return onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const commentsArray = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a, b) => b.createdAt - a.createdAt); // Sort by timestamp (newest first)
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    });
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    setIsGoogleLoading(true);

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  }, []);

  const handleGoogleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setError("");
    } catch (error) {
      setError("Failed to sign out. Please try again.");
      console.error("Google sign-out failed:", error);
    }
  }, []);

  // Handle comment submission with email (without image upload dependency)
  const handleCommentSubmit = useCallback(
    async ({ newComment, userName, email, profileImage: formProfileImage, imageFile, rating }) => {
      setError("");

      if (!currentUser) {
        setError("Please sign in with Google before posting a comment.");
        return;
      }

      setIsSubmitting(true);

      try {
        const finalUserName = (currentUser.displayName || userName || "Google User").trim();
        const finalEmail = currentUser.email || email || null;
        const finalProfileImage = currentUser.photoURL || formProfileImage || null;

        const newCommentData = {
          content: newComment,
          userName: finalUserName,
          email: finalEmail,
          profileImage: finalProfileImage,
          rating: rating || null,
          createdAt: Date.now(),
          createdAtDay: new Date().toString(),
          createdTime: new Date().toLocaleTimeString(),
          createdDate: new Date().toLocaleDateString(),
        };

        await push(ref(database, "portfolio-comments"), newCommentData);
      } catch (error) {
        setError("Failed to post comment. Please try again.");
        console.error("Error adding comment:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentUser]
  );

  // Format timestamps
  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }, []);

  return (
    <div
      className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div
        className="p-6 border-b border-white/10"
        data-aos="fade-down"
        data-aos-duration="800"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <MessageCircle className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Comments <span className="text-indigo-400">({comments.length})</span>
          </h3>
        </div>
      </div>
      <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
        {error && (
          <div
            className="flex items-center gap-2 p-2 sm:p-4 text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-xl"
            data-aos="fade-in"
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <p className="text-[10px] sm:text-sm">{error}</p>
          </div>
        )}

        <div>
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={isSubmitting}
            currentUser={currentUser}
            onGoogleLogin={handleGoogleLogin}
            onGoogleLogout={handleGoogleLogout}
            isGoogleLoading={isGoogleLoading}
          />
        </div>
        <div className="border-t border-white/10 flex justify-center space-x-6"></div>
        <div
          className="space-y-3 sm:space-y-4 h-[250px] sm:h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {comments.length === 0 ? (
            <div className="text-center py-6 sm:py-8" data-aos="fade-in">
              <UserCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-400 text-xs sm:text-sm">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Komentar;