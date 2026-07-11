const mongoose = require('mongoose');
const Report = require('../models/Report');
const User = require('../models/User'); // Import User to bypass required ref constraint

require('dotenv').config({ path: __dirname + '/../.env' });

async function createReports() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding reports...');

    // 1. Create a placeholder citizen/user so the required 'reportedBy' reference passes validation
// 1. Create a placeholder citizen/user so the required 'reportedBy' reference passes validation
    let dummyUser = await User.findOne({ email: 'citizen.test@civic.in' });
    if (!dummyUser) {
      dummyUser = await User.create({
        firstName: 'Test',
        lastName: 'Citizen',
        email: 'citizen.test@civic.in',
        phone: '9999999999',
        gender: 'other',
        address: {
          street: '123 Civil Lines',
          city: 'Nagpur',
          state: 'Maharashtra',
          postalCode: '440001', // Added required field
          country: 'India'       // Added required field
        }
      });
      console.log('Created dummy citizen reporter profile.');
    }

    // 2. Clear out old test reports to avoid duplicate clutter
    await Report.deleteMany({});
    console.log('Cleared existing reports.');

    // 3. Insert reports matching strict schema enum options and required keys
    await Report.create([
      // Public Works Department (PWD) -> Handles category: "roads"
      { 
        title: "Large Pothole on Main Road", 
        description: "A dangerous pothole has developed near the intersection causing traffic jams.",
        category: "roads",
        department: "Public Works Department (PWD)", 
        status: "reported",
        reportedBy: dummyUser._id
      },
      { 
        title: "Broken Footpath Slab", 
        description: "The concrete pavement tile is loose and poses a tripping hazard.",
        category: "roads",
        department: "Public Works Department (PWD)", 
        status: "in-progress",
        reportedBy: dummyUser._id
      },
      { 
        title: "Road Divider Repainting Needed", 
        description: "The paint on the center divider has completely faded away.",
        category: "roads",
        department: "Public Works Department (PWD)", 
        status: "resolved",
        reportedBy: dummyUser._id
      },

      // Water Supply & Sewerage Board -> Handles category: "water"
      { 
        title: "Water Pipeline Leakage", 
        description: "Clean water is gushing out from an underground pipe leak on the street.",
        category: "water",
        department: "Water Supply & Sewerage Board", 
        status: "reported",
        reportedBy: dummyUser._id
      },
      { 
        title: "Low Water Pressure in Block C", 
        description: "Residents haven't received sufficient water pressure for the last three days.",
        category: "water",
        department: "Water Supply & Sewerage Board", 
        status: "resolved",
        reportedBy: dummyUser._id
      },

      // Electricity Board -> Handles category: "electric"
      { 
        title: "Streetlight Flashing Continuously", 
        description: "The light pole outside house number 42 keeps blinking all night long.",
        category: "electric",
        department: "Electricity Board", 
        status: "reported",
        reportedBy: dummyUser._id
      },
      { 
        title: "Hanging Electrical Cable Danger", 
        description: "A live overhead wire snapped and is dangerously low to the ground.",
        category: "electric",
        department: "Electricity Board", 
        status: "in-progress",
        reportedBy: dummyUser._id
      },

      // Pollution Control Board / Environment Department -> Handles category: "environment"
      { 
        title: "Illegal Industrial Waste Dumping", 
        description: "A small local factory is emitting thick black smoke beyond legal operational hours.",
        category: "environment",
        department: "Pollution Control Board / Environment Department", 
        status: "reported",
        reportedBy: dummyUser._id
      },

      // Municipal Corporation (Sanitation Wing) -> Handles category: "sanitation"
      { 
        title: "Overflowing Public Garbage Dumpster", 
        description: "Trash has piled onto the walking path and hasn't been cleared all week.",
        category: "sanitation",
        department: "Municipal Corporation (Sanitation Wing)", 
        status: "resolved",
        reportedBy: dummyUser._id
      },

      // Urban Development Authority / PWD -> Handles category: "infrastructure"
      { 
        title: "Unfinished Drainage Construction Site", 
        description: "Open concrete trenches are left unmarked without any warning barriers or signage.",
        category: "infrastructure",
        department: "Urban Development Authority / PWD", 
        status: "in-progress",
        reportedBy: dummyUser._id
      },
      { 
        title: "Damaged Park Benches", 
        description: "Public seating in the community park has been broken by vandals.",
        category: "infrastructure",
        department: "Urban Development Authority / PWD", 
        status: "reported",
        reportedBy: dummyUser._id
      }
    ]);

    console.log('✅ Sample reports created successfully with correct validations!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed due to an error:', error);
    process.exit(1);
  }
}

createReports();