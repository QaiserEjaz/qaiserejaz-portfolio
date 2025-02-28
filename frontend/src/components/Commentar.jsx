// import { useState, useEffect, useRef, useCallback, memo } from "react";
// import { ref, push, onValue } from "firebase/database";
// import {
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";
// import { database, storage } from "../firebase"; //  (Realtime Database)
// import {
//   MessageCircle,
//   UserCircle2,
//   Loader2,
//   AlertCircle,
//   Send,
//   ImagePlus,
//   X,
//   Star,
// } from "lucide-react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import PropTypes from "prop-types";

// const Comment = memo(({ comment, formatDate }) => (
//   <div className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5">
//     <div className="flex items-start gap-3">
//       {comment.profileImage ? (
//         <img
//           src={comment.profileImage}
//           alt={`${comment.userName}'s profile`}
//           className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
//           loading="lazy"
//         />
//       ) : (
//         <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
//           <UserCircle2 className="w-5 h-5" />
//         </div>
//       )}
//       <div className="flex-grow min-w-0">
//         <div className="flex items-center justify-between gap-4 mb-2">
//           <div className="flex items-center gap-2">
//             <h4 className="font-medium text-white truncate">{comment.userName}</h4>
//             {comment.rating && (
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: 5 }, (_, i) => (
//                   <Star
//                     key={i}
//                     className={`w-3 h-3 ${i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//           <span className="text-xs text-gray-400 whitespace-nowrap">
//             {formatDate(comment.createdAt)}
//           </span>
//         </div>
//         <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
//           {comment.content}
//         </p>
//       </div>
//     </div>
//   </div>
// ));
// Comment.displayName = "Comment";

// Comment.propTypes = {
//   comment: PropTypes.shape({
//     profileImage: PropTypes.string,
//     userName: PropTypes.string.isRequired,
//     createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//     content: PropTypes.string.isRequired,
//     rating: PropTypes.number,
//   }).isRequired,
//   formatDate: PropTypes.func.isRequired,
// };

// // Comment Form Component with Star Rating and Abusive Checker
// const CommentForm = memo(function CommentForm({ onSubmit, isSubmitting }) {
//   const [newComment, setNewComment] = useState("");
//   const [userName, setUserName] = useState("");
//   const [rating, setRating] = useState(0);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [abuseError, setAbuseError] = useState(""); // State for abusive content error
//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // List of abusive words (expandable)
//   const abusiveWords = [
//     // English Abusive Words
//     "fuck",
//     "shit",
//     "bitch",
//     "asshole",
//     "damn",
//     "bastard",
//     "cunt",
//     "dick",
//     "pussy",
//     "whore",
//     "slut",
//     "bimbo",
//     "slutty",
//     "shitty",
//     "fucker",
//     "motherfucker",
//     "prick",
//     "twat",
//     "wanker",
//     "arse",
//     "bullshit",
//     "crap",
//     "douche",
//     "faggot",
//     "jerk",
//     "piss",
//     "screw",
//     "suck",
  
//     // Urdu Abusive Words
//     "harami", // حرامی (bastard)
//     "kutta", // کتا (dog)
//     "kutiya", // کتیا (female dog, bitch)
//     "suar", // سور (pig)
//     "gandu", // گانڈو (asshole)
//     "chutiya", "chutiye", // چوتیا (idiot/fool, vulgar)
//     "bhenchod", // بہن چود (sister fucker)
//     "madarchod", // ماں چود (mother fucker)
//     "randi", // رنڈی (whore)
//     "haraam", // حرام (forbidden, often used as an insult)
//     "bewaqoof", // بیوقوف (fool, milder but offensive in context)
//     "lanati", // لعنتی (cursed)
//     "kameena", // کمینہ (mean/lowly person)
//     "zaleel", // ذلیل (humiliated/disgraceful)
//     "badzaat", // بدذات (bad character),
  
//     // Hinglish (Mix of Hindi/Urdu and English)
//     "chutiyapa", // چوتیاپا (foolishness, vulgar)
//     "gandupana", // گانڈوپن (assholery)
//     "bhosdike", "bsdk", // بھوسڑیکے (extremely vulgar insult)
//     "saala", // سالا (brother-in-law, used as an insult)
//     "saali", // سالی (sister-in-law, used as an insult)
//     "fucktard", // English + slang hybrid
//     "shitkar", // Shit + Hindi suffix
//     "bakchod", // بک چود (nonsense talker)
//     "randibaaz", "randi",// رنڈی باز (womanizer/whore-monger)
//     "haramipana", // حرامی پن (bastard-like behavior)
//     "kuttapan", // کتپن (dog-like behavior)
//     "behenji", // بہن جی (sister, used sarcastically)
//     "chodu", // چودو (fucker, slang)
//     "lund", // لنڈ (penis, vulgar)
//     "bhadwa", // بھڑوا (pimp),
  
//   ];

//   // Check for abusive content
//   const checkAbusiveContent = useCallback((text) => {
//     const lowerText = text.toLowerCase();
//     return abusiveWords.some((word) => lowerText.includes(word));
//   }, []);

//   const handleImageChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) return;
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const handleTextareaChange = useCallback((e) => {
//     setNewComment(e.target.value);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, []);

//   const handleStarClick = useCallback((starValue) => {
//     setRating(starValue);
//   }, []);

//   const handleSubmit = useCallback(
//     (e) => {
//       e.preventDefault();
//       if (!newComment.trim() || !userName.trim()) return;

//       // Check for abusive content
//       if (checkAbusiveContent(newComment)) {
//         setAbuseError("Your comment contains inappropriate language. Please revise it.");
//         return;
//       }

//       onSubmit({ newComment, userName, imageFile, rating });
//       setNewComment("");
//       setUserName("");
//       setRating(0);
//       setImagePreview(null);
//       setImageFile(null);
//       setAbuseError(""); // Clear abuse error on successful submission
//       if (fileInputRef.current) fileInputRef.current.value = "";
//       if (textareaRef.current) textareaRef.current.style.height = "auto";
//     },
//     [newComment, userName, imageFile, rating, onSubmit, checkAbusiveContent]
//   );

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Name Field */}
//       <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
//         <label className="block text-sm font-medium text-white">
//           Name <span className="text-red-400">*</span>
//         </label>
//         <input
//           type="text"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           placeholder="Enter your name"
//           className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//           required
//         />
//       </div>

//       {/* Star Rating Field */}
//       <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
//         <label className="block text-sm font-medium text-white">
//           Rating <span className="text-gray-400">(optional)</span>
//         </label>
//         <div className="flex items-center gap-2">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
//                 star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
//               }`}
//               onClick={() => handleStarClick(star)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Message Field */}
//       <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
//         <label className="block text-sm font-medium text-white">
//           Message <span className="text-red-400">*</span>
//         </label>
//         <textarea
//           ref={textareaRef}
//           value={newComment}
//           onChange={handleTextareaChange}
//           placeholder="Write your message here..."
//           className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
//           required
//         />
//       </div>

//     {/* <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
//       <label className="block text-sm font-medium text-white">
//         Profile Photo <span className="text-gray-400">(optional)</span>
//       </label>
//       <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
//         {imagePreview ? (
//           <div className="flex items-center gap-4">
//             <img
//               src={imagePreview}
//               alt="Profile preview"
//               className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
//             />
//             <button id="imageBtn"
//               type="button"
//               onClick={() => {
//                 setImagePreview(null);
//                 setImageFile(null);
//                 if (fileInputRef.current) fileInputRef.current.value = "";
//               }}
//               className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
//             >
//               <X className="w-4 h-4" />
//               <span>Remove Photo</span>
//             </button>
//           </div>
//         ) : (
//           <div className="w-full">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               className="hidden"
//             />
//             <button id="imageBtn"
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
//             >
//               <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
//               <span>Choose Profile Photo</span>
//             </button>
//             <p className="text-center text-gray-400 text-sm mt-2">
//               Max file size: 5MB
//             </p>
//           </div>
//         )}
//       </div>
//     </div> */}


//       {/* Abuse Error Message */}
//       {abuseError && (
//         <div
//           className="flex items-center gap-2 p-4 text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-xl"
//           data-aos="fade-in"
//         >
//           <AlertCircle className="w-5 h-5 flex-shrink-0" />
//           <p className="text-sm">{abuseError}</p>
//         </div>
//       )}

//       {/* Submit Button */}
//       <button
//         id="submitBtn"
//         type="submit"
//         disabled={isSubmitting}
//         data-aos="fade-up"
//         data-aos-duration="1000"
//         className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
//       >
//         <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
//         <div className="relative flex items-center justify-center gap-2">
//           {isSubmitting ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               <span>Posting...</span>
//             </>
//           ) : (
//             <>
//               <Send className="w-4 h-4" />
//               <span>Post Comment</span>
//             </>
//           )}
//         </div>
//       </button>
//     </form>
//   );
// });

// CommentForm.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   isSubmitting: PropTypes.bool.isRequired,
// };

// const Komentar = () => {
//   const [comments, setComments] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     AOS.init({ once: false, duration: 1000 });
//   }, []);

//   // Fetch comments from Realtime Database
//   useEffect(() => {
//     const commentsRef = ref(database, "portfolio-comments");

//     return onValue(commentsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const commentsArray = Object.keys(data)
//           .map((key) => ({ id: key, ...data[key] }))
//           .sort((a, b) => b.createdAt - a.createdAt); // Sort by timestamp (newest first)
//         setComments(commentsArray);
//       } else {
//         setComments([]);
//       }
//     });
//   }, []);

//   // Upload image and return URL
//   const uploadImage = useCallback(async (imageFile) => {
//     if (!imageFile) return null;
//     const imgRef = storageRef(
//       storage,
//       `profile-images/${Date.now()}_${imageFile.name}`
//     );
//     await uploadBytes(imgRef, imageFile);
//     return getDownloadURL(imgRef);
//   }, []);

//   // Handle comment submission with rating
//   const handleCommentSubmit = useCallback(
//     async ({ newComment, userName, imageFile, rating }) => {
//       setError("");
//       setIsSubmitting(true);

//       try {
//         const profileImageUrl = await uploadImage(imageFile);
//         const newCommentData = {
//           content: newComment,
//           userName,
//           profileImage: profileImageUrl || null,
//           rating: rating || null, // Include rating, default to 0 if not provided
//           createdAt: Date.now(),
//           createdAtDay: new Date().toString(),
//           createdTime: new Date().toLocaleTimeString(),
//           createdDate: new Date().toLocaleDateString(),
//         };

//         await push(ref(database, "portfolio-comments"), newCommentData);
//       } catch (error) {
//         setError("Failed to post comment. Please try again.");
//         console.error("Error adding comment:", error);
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [uploadImage]
//   );

//   // Format timestamps
//   const formatDate = useCallback((timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMinutes = Math.floor((now - date) / (1000 * 60));
//     const diffHours = Math.floor(diffMinutes / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMinutes < 1) return "Just now";
//     if (diffMinutes < 60) return `${diffMinutes}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;

//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }).format(date);
//   }, []);

//   return (
//     <div
//       className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl"
//       data-aos="fade-up"
//       data-aos-duration="1000"
//     >
//       <div
//         className="p-6 border-b border-white/10"
//         data-aos="fade-down"
//         data-aos-duration="800"
//       >
//         <div className="flex items-center gap-3">
//           <div className="p-2 rounded-xl bg-indigo-500/20">
//             <MessageCircle className="w-6 h-6 text-indigo-400" />
//           </div>
//           <h3 className="text-xl font-semibold text-white">
//             Comments <span className="text-indigo-400">({comments.length})</span>
//           </h3>
//         </div>
//       </div>
//       <div className="p-6 space-y-6">
//         {error && (
//           <div
//             className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
//             data-aos="fade-in"
//           >
//             <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             <p className="text-sm">{error}</p>
//           </div>
//         )}

//         <div>
//           <CommentForm
//             onSubmit={handleCommentSubmit}
//             isSubmitting={isSubmitting}
//           />
//         </div>

//         <div
//           className="space-y-4 h-[300px] overflow-y-auto custom-scrollbar"
//           data-aos="fade-up"
//           data-aos-delay="200"
//         >
//           {comments.length === 0 ? (
//             <div className="text-center py-8" data-aos="fade-in">
//               <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
//               <p className="text-gray-400">
//                 No comments yet. Start the conversation!
//               </p>
//             </div>
//           ) : (
//             comments.map((comment) => (
//               <Comment
//                 key={comment.id}
//                 comment={comment}
//                 formatDate={formatDate}
//               />
//             ))
//           )}
//         </div>
//       </div>
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(99, 102, 241, 0.5);
//           border-radius: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(99, 102, 241, 0.7);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Komentar;





import { useState, useEffect, useRef, useCallback, memo } from "react";
import { ref, push, onValue } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase"; // Realtime Database and Storage
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

const Comment = memo(({ comment, formatDate }) => (
  <div className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5">
    <div className="flex items-start gap-3">
      {comment.profileImage ? (
        <img
          src={comment.profileImage}
          alt={`${comment.userName}'s profile`}
          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
          loading="lazy"
        />
      ) : (
        <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
          <UserCircle2 className="w-5 h-5" />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-white truncate">{comment.userName}</h4>
              {comment.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {comment.email && (
              <span className="text-xs text-gray-400 truncate">{comment.email}</span>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
          {comment.content}
        </p>
      </div>
    </div>
  </div>
));
Comment.displayName = "Comment";

Comment.propTypes = {
  comment: PropTypes.shape({
    profileImage: PropTypes.string,
    userName: PropTypes.string.isRequired,
    email: PropTypes.string, // Added email to prop types
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number,
  }).isRequired,
  formatDate: PropTypes.func.isRequired,
};

// Comment Form Component with Email, Star Rating, and Abusive Checker
const CommentForm = memo(function CommentForm({ onSubmit, isSubmitting }) {
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [abuseError, setAbuseError] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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

      onSubmit({ newComment, userName, email, imageFile, rating });
      setNewComment("");
      setUserName("");
      setEmail("");
      setRating(0);
      setImagePreview(null);
      setImageFile(null);
      setAbuseError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    [newComment, userName, email, imageFile, rating, onSubmit, checkAbusiveContent]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
        <label className="block text-sm font-medium text-white">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          required
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1100">
        <label className="block text-sm font-medium text-white">
          Email <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Star Rating Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
        <label className="block text-sm font-medium text-white">
          Rating <span className="text-gray-400">(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
        <label className="block text-sm font-medium text-white">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write your message here..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
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
          className="flex items-center gap-2 p-4 text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-xl"
          data-aos="fade-in"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{abuseError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        id="submitBtn"
        type="submit"
        disabled={isSubmitting}
        data-aos="fade-up"
        data-aos-duration="1000"
        className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
        <div className="relative flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
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
};

const Komentar = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  // Upload image and return URL
  const uploadImage = useCallback(async (imageFile) => {
    if (!imageFile) return null;
    const imgRef = storageRef(
      storage,
      `profile-images/${Date.now()}_${imageFile.name}`
    );
    await uploadBytes(imgRef, imageFile);
    return getDownloadURL(imgRef);
  }, []);

  // Handle comment submission with email
  const handleCommentSubmit = useCallback(
    async ({ newComment, userName, email, imageFile, rating }) => {
      setError("");
      setIsSubmitting(true);

      try {
        const profileImageUrl = await uploadImage(imageFile);
        const newCommentData = {
          content: newComment,
          userName,
          email: email || null, // Include email in the data structure
          profileImage: profileImageUrl || null,
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
    [uploadImage]
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
          <h3 className="text-xl font-semibold text-white">
            Comments <span className="text-indigo-400">({comments.length})</span>
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {error && (
          <div
            className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
            data-aos="fade-in"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="border-t border-white/10 flex justify-center space-x-6"></div>
        <div
          className=" space-y-4 h-[300px] overflow-y-auto custom-scrollbar"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {comments.length === 0 ? (
            <div className="text-center py-8" data-aos="fade-in">
              <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-400">
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Komentar;