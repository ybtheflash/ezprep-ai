// models/RedemptionCode.ts
import mongoose, { Schema } from 'mongoose';

export interface IRedemptionCode extends mongoose.Document {
  code: string;
  coins: number;
  expiresAt: Date;
  maxUses: number;
  uses: number;
  createdAt: Date;
}

const redemptionCodeSchema = new Schema<IRedemptionCode>({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  coins: { 
    type: Number, 
    required: true,
    min: 1
  },
  expiresAt: Date,
  maxUses: { 
    type: Number, 
    default: 1,
    min: 1
  },
  uses: { 
    type: Number, 
    default: 0,
    min: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

// Index for code searching
redemptionCodeSchema.index({ code: 1 }, { unique: true });

// Pre-save hook to uppercase code
redemptionCodeSchema.pre<IRedemptionCode>('save', function(next) {
  this.code = this.code.toUpperCase().trim();
  next();
});

export const RedemptionCode = mongoose.models.RedemptionCode || 
  mongoose.model<IRedemptionCode>('RedemptionCode', redemptionCodeSchema);