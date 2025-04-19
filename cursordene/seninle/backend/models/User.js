const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'İsim alanı zorunludur'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Soyisim alanı zorunludur'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta alanı zorunludur'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Lütfen geçerli bir e-posta adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre alanı zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false // Şifreyi varsayılan olarak sorgularda gösterme
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: 'default-profile.png'
  },
  dailyCheckins: [{
    mood: {
      type: Number, // 1-10 arasında duygu durumu
      required: true
    },
    notes: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  goals: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    completed: {
      type: Boolean,
      default: false
    },
    targetDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  journalEntries: [{
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    tags: [String]
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      reminderTime: {
        type: String,
        default: '20:00' // 24 saat formatında
      }
    },
    language: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr'
    }
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium', 'trial'],
    default: 'free'
  },
  subscriptionEndDate: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: Date
}, {
  timestamps: true
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to get user profile data (without sensitive info)
userSchema.methods.getProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    fullName: this.fullName,
    role: this.role,
    profilePicture: this.profilePicture,
    preferences: this.preferences,
    subscriptionStatus: this.subscriptionStatus,
    createdAt: this.createdAt,
    lastActive: this.lastActive
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User; 