const mongoose = require('mongoose');
const { Schema } = mongoose;

const LoginLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: false },
  attemptedName: { type: String },
  ip: { type: String },
  agent: { type: String },
  success: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

const LoginLog = mongoose.model('user_logs', LoginLogSchema);
module.exports = LoginLog;
