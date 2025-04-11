import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  /**
   * Get all tickets
   */
  async findAll(): Promise<any> {
    const tickets = await this.ticketRepo.find({
      relations: ['bookingTicket', 'passengerTicket', 'trainTicket'],
    });
  
    return {
      message: 'Tickets fetched successfully',
      data: tickets,
      result: true,
    };
  }
  
  /**
   * Get ticket by ID
   */
  async findOne(id: number): Promise<any> {
    const ticket = await this.ticketRepo.findOne({
      where: { ticketId: id },
      relations: ['bookingTicket', 'passengerTicket', 'trainTicket'],
    });
  
    if (!ticket) throw new NotFoundException('Ticket not found');
  
    return {
      message: `Ticket ${id} fetched successfully`,
      data: ticket,
      result: true,
    };
  }
  
}
