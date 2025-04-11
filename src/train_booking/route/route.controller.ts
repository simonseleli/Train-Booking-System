import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  /**
   * Create a new route
   * @param createRouteDto - DTO containing route data
   * @returns - Success message with the created route
   */
  @Post('create')
  async create(@Body() createRouteDto: CreateRouteDto) {
    return await this.routeService.create(createRouteDto);
  }

  /**
   * Get all routes
   * @returns - List of routes or empty array if none found
   */
  @Get('findAll')
  async findAll() {
    return await this.routeService.findAll();
  }

  /**
   * Get a single route by ID
   * @param id - Route ID
   * @returns - Route object or not found error
   */
  @Get('findOne/:id')
  async findOne(@Param('id') id: number) {
    return await this.routeService.findOne(+id);
  }

  /**
   * Update a route's information
   * @param id - Route ID
   * @param updateRouteDto - DTO containing fields to update
   * @returns - Updated route object
   */
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() updateRouteDto: any) {
    return await this.routeService.update(+id, updateRouteDto);
  }

  /**
   * Delete a route
   * @param id - Route ID
   * @returns - Success message upon deletion
   */
  @Delete('remove/:id')
  async remove(@Param('id') id: number) {
    return await this.routeService.remove(+id);
  }
}
