const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    const admin = await User.findOne({ username: process.env.ADMIN_USERNAME });
    
    if (!admin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'System Admin',
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      console.log('✅ Default admin created successfully');
    } else {
      // Update existing admin name if changed
      if (admin.name !== process.env.ADMIN_NAME) {
        admin.name = process.env.ADMIN_NAME;
        await admin.save();
        console.log('✅ Admin name updated');
      } else {
        console.log('✅ Admin already exists');
      }
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

module.exports = createDefaultAdmin;
