export const typeDefs = `
  type Ticket {
    title: String!
    price: Number
    userId: String
    version: Number
    ordedrId: String
  }

  type Query {
    ticket: Ticket!
  }
`;


