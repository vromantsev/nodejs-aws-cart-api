import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { CartRepository } from './repository';

@Module({
  imports: [OrderModule],
  providers: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
