const Member = require('../models/Member');

exports.addMember = async (req, res) => {
  try {
    const { name, email, phone, address, membershipType } = req.body;

    if (!name || !email || !phone || !address || !membershipType) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const membershipNumber = 'MEM' + Date.now();
    
    const member = await Member.create({
      membershipNumber,
      name,
      email,
      phone,
      address,
      membershipType
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberByNumber = async (req, res) => {
  try {
    const member = await Member.findOne({ membershipNumber: req.params.membershipNumber });
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { membershipNumber } = req.params;
    const { name, email, phone, address, membershipType, status } = req.body;

    if (!membershipNumber) {
      return res.status(400).json({ message: 'Membership number is mandatory' });
    }

    const member = await Member.findOne({ membershipNumber });
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (address) member.address = address;
    if (status) member.status = status;
    
    if (membershipType && membershipType !== member.membershipType) {
      member.membershipType = membershipType;
      member.startDate = new Date();
    }

    await member.save();

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.extendMembership = async (req, res) => {
  try {
    const { membershipNumber } = req.params;
    const { extensionType } = req.body;

    const member = await Member.findOne({ membershipNumber });
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const currentEnd = new Date(member.endDate);
    
    switch(extensionType || '6months') {
      case '6months':
        member.endDate = new Date(currentEnd.setMonth(currentEnd.getMonth() + 6));
        break;
      case '1year':
        member.endDate = new Date(currentEnd.setFullYear(currentEnd.getFullYear() + 1));
        break;
      case '2years':
        member.endDate = new Date(currentEnd.setFullYear(currentEnd.getFullYear() + 2));
        break;
    }

    member.status = 'active';
    await member.save();

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelMembership = async (req, res) => {
  try {
    const { membershipNumber } = req.params;

    const member = await Member.findOneAndUpdate(
      { membershipNumber },
      { status: 'cancelled' },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ success: true, message: 'Membership cancelled successfully', data: member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
