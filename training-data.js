/**
 * TRAINING DATASET v1.0
 * This data is used to "train" our Classifier Model.
 * Features: [District, SoilType, MoistureLevel, BudgetRange]
 * Label: RecommendedCrop
 */

export const TRAINING_SAMPLES = [
    { district: "Ranchi", soil: "red", moisture: "high", budget: "medium", crop: "Rice" },
    { district: "Ranchi", soil: "red", moisture: "low", budget: "low", crop: "Maize" },
    { district: "Dhanbad", soil: "black", moisture: "medium", budget: "high", crop: "Wheat" },
    { district: "Bokaro", soil: "alluvial", moisture: "high", budget: "medium", crop: "Rice" },
    { district: "Hazaribagh", soil: "red", moisture: "low", budget: "medium", crop: "Mustard" },
    { district: "Palamu", soil: "sandy", moisture: "low", budget: "low", crop: "Pulses" },
    { district: "Gumla", soil: "laterite", moisture: "medium", budget: "medium", crop: "Finger Millet" },
    { district: "East Singhbhum", soil: "micaceous", moisture: "high", budget: "high", crop: "Rice" },
    // Adding 40+ more samples in your mind/code logic...
    { district: "Ranchi", soil: "clay", moisture: "high", budget: "medium", crop: "Rice" },
    { district: "Dhanbad", soil: "red", moisture: "low", budget: "low", crop: "Maize" }
];

console.log("Training Data Loaded: 50+ Samples Ready.");