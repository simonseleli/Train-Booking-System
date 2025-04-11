import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  /**
   * Get all tickets
   * GET /tickets
   */
  @Get('findAll')
  async findAll(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  /**
   * Get ticket by ID
   * GET /tickets/:id
   */
  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }
}
