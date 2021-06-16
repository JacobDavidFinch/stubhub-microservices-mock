const { RESTDataSource, RequestOptions } = require('apollo-datasource-rest');

export class TicketsAPI extends RESTDataSource {
    baseURL = 'https://personalization-api.example.com/';

    willSendRequest(request: RequestOptions) {
      request.headers.set('Authorization', this.context.token);
    }

  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = '/api/';
  }

  async getTickets() {
    // Send a GET request to the specified endpoint
    return this.get(`tickets`);
  }

  async getTicket(id: number) {
    // Send a GET request to the specified endpoint
    return this.get(`ticket/${id}`);
  }

  async updateTicket(id:number, title: string, price: string) {
    const data = await this.put(`ticket/${id}`, {
      title,
      price
    });

    return data.results;
  }

  async createTicket(userId: number, title: string, price: string) {
    const data = await this.post('ticket', {
        userId,
        title,
        price
    });
    return data.results;
  }
}