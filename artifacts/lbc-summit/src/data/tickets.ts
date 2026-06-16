export const tickets = [
  {
    id: "general",
    name: "General Admission",
    price: "$25",
    inclusions: [
      "Access to all 2 days",
      "All 7 speaker sessions",
      "Workshops & panels",
      "General networking access",
      "Digital summit workbook",
    ],
    isVip: false,
  },
  {
    id: "vip",
    name: "VIP Admission",
    price: "$97",
    inclusions: [
      "All General Admission inclusions",
      "2 private VIP sessions",
      "Preferred seating",
      "Priority check-in",
      "Enhanced speaker access",
      "VIP networking",
      "Premium materials & exclusive gift",
    ],
    isVip: true,
  },
  {
    id: "group",
    name: "Group & Organizations",
    price: "Inquire",
    inclusions: [
      "Designed for teams and employers",
      "Great for nonprofits & veteran orgs",
      "Bulk ticket discounts",
      "Dedicated seating options",
    ],
    isVip: false,
  }
];
